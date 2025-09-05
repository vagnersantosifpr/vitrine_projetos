require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Project = require('./models/project');

const seedDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB para seeding...');

    // Limpa a coleção antes de popular
    await Project.deleteMany({});
    console.log('Coleção de projetos limpa.');

    // Lê o arquivo JSON
    const jsonPath = path.resolve(__dirname, '../frontend/apps.json');
    const appsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    const projectsToInsert = [];
    for (const ano in appsData) {
        const anoData = appsData[ano];
        anoData.projetos.forEach(projeto => {
            projectsToInsert.push({
                ...projeto,
                ano: ano,
                turma: anoData.turma,
                reactions: { gostei: 0, amei: 0, susto: 0 } // Estado inicial
            });
        });
    }

    // Insere os projetos no banco de dados
    await Project.insertMany(projectsToInsert);
    console.log('Banco de dados populado com sucesso!');

    mongoose.connection.close();
};

seedDB().catch(err => {
    console.error('Erro ao popular o banco de dados:', err);
    mongoose.connection.close();
});