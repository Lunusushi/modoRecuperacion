const mongoose = require("mongoose");
const cajeroSchema = mongoose.Schema({
    lugar: {type: String, required : true},
    ventas: {type: Number, required : true},
    vale: {type: mongoose.Schema.Types.ObjectId, ref: "Vale"}
});

module.exports = mongoose.model("Cajero", cajeroSchema);
