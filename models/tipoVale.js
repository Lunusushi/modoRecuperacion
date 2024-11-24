const mongoose = require("mongoose");
const tipoValeSchema = mongoose.Schema({
    valorBase: Number,
    turno: {type: mongoose.Schema.Types.ObjectId, ref: "Turno"}
});

module.exports = mongoose.model("TipoVale", tipoValeSchema);