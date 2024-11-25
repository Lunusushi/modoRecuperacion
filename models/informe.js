const mongoose = require("mongoose");
const informeSchema = mongoose.Schema({
    fecha: {type: String, required : true},
    hora: {type: String, required : true},
    lugar: {type: String, required : true},
    emitidos: [{type: mongoose.Schema.Types.ObjectId, ref: "Vale"}]
});

module.exports = mongoose.model("Informe", informeSchema);