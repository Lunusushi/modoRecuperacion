const mongoose = require("mongoose");
const administradorSchema = mongoose.Schema({
    nombre: {type: String, required : true},
    user: {type: String, required : true},
    pass: {type: String, required : true}
});

module.exports = mongoose.model("Administrador", administradorSchema);
