
const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  categoria: {
    type: String,
    unique: true,
    required: true
  }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;
