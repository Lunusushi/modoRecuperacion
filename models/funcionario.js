const mongoose = require("mongoose");
const funcionarioSchema = mongoose.Schema({
    nombre: String,
    user: String,
    pass: String,
    perfil: {type: mongoose.Schema.Types.ObjectId, ref: "PerfilFuncionario"}
});

module.exports = mongoose.model("Funcionario", funcionarioSchema);
