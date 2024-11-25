const mongoose = require("mongoose");
const valeSchema = mongoose.Schema({
    valor: {type: Number, required : true},
    canjeado: {type: Boolean, required : true},
    tipo: {type: mongoose.Schema.Types.ObjectId, ref: "TipoVale", required: true},
    funcionario: {type: mongoose.Schema.Types.ObjectId, ref: "Funcionario", required: true}
});

module.exports = mongoose.model("Vale", valeSchema);
