const mongoose = require("mongoose");
const valeSchema = mongoose.Schema({
    valor: Number,
    canjeado: Boolean,
    tipo: {type: mongoose.Schema.Types.ObjectId, ref: "TipoVale"},
    funcionario: {type: mongoose.Schema.Types.ObjectId, ref: "Funcionario"}
});

module.exports = mongoose.model("Vale", valeSchema);
