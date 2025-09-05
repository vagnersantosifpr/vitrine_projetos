const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    link: { type: String, required: true },
    ano: { type: String, required: true },
    turma: { type: String, required: true },
    reactions: {
        gostei: { type: Number, default: 0 },
        amei: { type: Number, default: 0 },
        susto: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('Project', projectSchema);

