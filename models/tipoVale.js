const mongoose = require("mongoose");
const tipoValeSchema = mongoose.Schema({
    valorBase: {type: Number, required : true},
    turno: {type: mongoose.Schema.Types.ObjectId, ref: "Turno", required: true}
});

module.exports = mongoose.model("TipoVale", tipoValeSchema);