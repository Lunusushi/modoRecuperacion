const mongoose = require("mongoose");
const turnoSchema = mongoose.Schema({
    nombre: {type: String, required : true},
    horaIni: {type: String, required : true},
    horaFin: {type: String, required : true}
});

module.exports = mongoose.model("Turno", turnoSchema);