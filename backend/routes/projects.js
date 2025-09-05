const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const Reaction = require('../models/reaction');

// Rota para buscar projetos por ano
router.get('/:ano', async (req, res) => {
    try {
        const projects = await Project.find({ ano: req.params.ano }).sort({ nome: 1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rota para registrar uma reação
router.post('/:id/react', async (req, res) => {
    const { reaction } = req.body;
    const ipAddress = req.ip; // Express pega o IP do requisitante
    const projectId = req.params.id;

    if (!['gostei', 'amei', 'susto'].includes(reaction)) {
        return res.status(400).json({ message: 'Tipo de reação inválida.' });
    }

    try {
        // Verifica se já existe uma reação deste IP para este projeto
        const existingReaction = await Reaction.findOne({ projectId, ipAddress });
        if (existingReaction) {
            return res.status(409).json({ message: 'Você já reagiu a este projeto.' });
        }

        // Se não houver, registra a nova reação
        const newReaction = new Reaction({ projectId, ipAddress, reactionType: reaction });
        await newReaction.save();

        // Atualiza a contagem no documento do projeto de forma atômica
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $inc: { [`reactions.${reaction}`]: 1 } },
            { new: true } // Retorna o documento atualizado
        );

        res.status(201).json(updatedProject);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

