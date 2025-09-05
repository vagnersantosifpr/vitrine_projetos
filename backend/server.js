require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Por este bloco de código:
const whitelist = process.env.WHITELISTED_ORIGINS ? process.env.WHITELISTED_ORIGINS.split(',') : [];

const corsOptions = {
  origin: function (origin, callback) {
    // A verificação `!origin` permite requisições sem origem, como as de aplicativos mobile ou Postman
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pela política de CORS'));
    }
  }
};

app.use(cors(corsOptions));

// Middlewares
//app.use(cors()); // Permite requisições de outros domínios (do seu frontend)
app.use(express.json()); // Para o Express entender requisições com corpo em JSON
app.set('trust proxy', true); // Essencial para obter o IP correto se estiver atrás de um proxy (Heroku, Vercel, etc.)

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch(err => console.error('Falha ao conectar com o MongoDB:', err));

// Rotas da API
const projectsRouter = require('./routes/projects');
app.use('/api/projects', projectsRouter);


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

    //mongoose.connection.close();
};

seedDB().catch(err => {
    console.error('Erro ao popular o banco de dados:', err);
    mongoose.connection.close();
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
