const mongoose = require("mongoose");
const turnoSchema = mongoose.Schema({
    nombre: String,
    horaIni: String,
    horaFin: String,
});

module.exports = mongoose.model("Turno", turnoSchema);