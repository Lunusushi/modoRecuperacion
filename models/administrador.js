const mongoose = require("mongoose");
const administradorSchema = mongoose.Schema({
    nombre: String,
    user: String,
    pass: String
});

module.exports = mongoose.model("Administrador", administradorSchema);
