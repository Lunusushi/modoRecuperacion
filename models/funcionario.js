const mongoose = require("mongoose");
const funcionarioSchema = mongoose.Schema({
    nombre: String,
    user: String,
    pass: String,
    perfil: {type: mongoose.Schema.Types.ObjectId, ref: "PerfilFuncionario"},
    turno: {type: mongoose.Schema.Types.ObjectId, ref: "Turno"},
    permisosGen: [{ type: mongoose.Schema.Types.ObjectId, ref: "PermisosGeneracion" }]
});

module.exports = mongoose.model("Funcionario", funcionarioSchema);
