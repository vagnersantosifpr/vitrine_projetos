const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    ipAddress: { type: String, required: true },
    reactionType: { type: String, required: true, enum: ['gostei', 'amei', 'susto'] }
});

// Cria um índice único para garantir que um IP só possa reagir uma vez a um projeto
reactionSchema.index({ projectId: 1, ipAddress: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);

