const mongoose = require("mongoose");
const permisosGeneracionSchema = mongoose.Schema({
    limiteTurno: Number,
    esLimitado: Boolean,
    tipo: [{ type: mongoose.Schema.Types.ObjectId, ref: "TipoVale" }]
});

module.exports = mongoose.model("PermisosGeneracion", permisosGeneracionSchema);
