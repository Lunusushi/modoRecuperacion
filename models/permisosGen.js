const mongoose = require("mongoose");
const permisosGeneracionSchema = mongoose.Schema({
    limiteTurno: {type: Number, required : true},
    esLimitado: {type: Boolean, required : true},
    funcionario: { type: mongoose.Schema.Types.ObjectId, ref: "Funcionario", required: true},
    tipo: [{ type: mongoose.Schema.Types.ObjectId, ref: "TipoVale" }]
});

module.exports = mongoose.model("PermisosGeneracion", permisosGeneracionSchema);
