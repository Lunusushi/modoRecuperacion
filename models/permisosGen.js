const mongoose = require("mongoose");
const permisosGeneracionSchema = mongoose.Schema({
    limiteTurno: Number,
    esLimitado: Boolean,
    funcionario: { type: mongoose.Schema.Types.ObjectId, ref: "Funcionario" },
    tipo: [{ type: mongoose.Schema.Types.ObjectId, ref: "TipoVale" }]
});

module.exports = mongoose.model("PermisosGeneracion", permisosGeneracionSchema);
