const mongoose = require("mongoose");
const funcionarioSchema = mongoose.Schema({
    nombre: { type: String, required: true },
    user: { type: String, required: true },
    pass: { type: String, required: true },
    perfil: { type: mongoose.Schema.Types.ObjectId, ref: "PerfilFuncionario", required: true },
    vale: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vale" }],
    turno: [{ type: mongoose.Schema.Types.ObjectId, ref: "Turno", required: true}],
    permisosGen: { type: mongoose.Schema.Types.ObjectId, ref: "PermisosGeneracion" }
});
module.exports = mongoose.model("Funcionario", funcionarioSchema);
