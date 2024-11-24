const mongoose = require("mongoose");
const cajeroSchema = mongoose.Schema({
    lugar: String,
    ventas: Number,
    vale: {type: mongoose.Schema.Types.ObjectId, ref: "Vale"}
});

module.exports = mongoose.model("Cajero", cajeroSchema);
