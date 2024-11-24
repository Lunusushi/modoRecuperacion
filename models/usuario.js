const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    email: String,
    pass: String
});

module.exports = mongoose.model('usuario', usuarioSchema)