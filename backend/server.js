require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors()); // Permite requisições de outros domínios (do seu frontend)
app.use(express.json()); // Para o Express entender requisições com corpo em JSON
app.set('trust proxy', true); // Essencial para obter o IP correto se estiver atrás de um proxy (Heroku, Vercel, etc.)

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch(err => console.error('Falha ao conectar com o MongoDB:', err));

// Rotas da API
const projectsRouter = require('./routes/projects');
app.use('/api/projects', projectsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
