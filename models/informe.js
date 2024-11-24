const mongoose = require("mongoose");
const informeSchema = mongoose.Schema({
    fecha: String,
    hora: String,
    lugar: String,
    emitidos: [{type: mongoose.Schema.Types.ObjectId, ref: "Vale"}]
});

module.exports = mongoose.model("Informe", informeSchema);