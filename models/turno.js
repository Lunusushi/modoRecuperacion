const mongoose = require("mongoose");
const turnoSchema = mongoose.Schema({
    nombre: String,
    horaIni: String,
    horaFin: String,
    servIncluidos: [{ type: mongoose.Schema.Types.ObjectId, ref: "TipoVale" }]
});

module.exports = mongoose.model("Turno", turnoSchema);