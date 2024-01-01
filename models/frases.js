
const mongoose = require('mongoose');

const fraseSchema = new mongoose.Schema({
    categoria: {
        type: String,
        required: true
    },
    phraseEnglish: {
        type: String,
        required: true
    },
    phraseSpanish: {
        type: String,
        required: true
    },
    phrasePortuges: {
        type: String,
        required: false
    },
    audioEnglish: {
        type: String,
        required: true
    },
    audioSpanish: {
        type: String,
        required: false
    },
    audioPortuges: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Frase', fraseSchema);
