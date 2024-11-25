const mongoose = require("mongoose");
const perfilFuncionarioSchema = mongoose.Schema({
    cargo: {type: String, required : true},
    factorValor: {type: Number, required : true}
    // comentario 2: Filho da puta agora si temdo, el Number se usa para el mongo
});

module.exports = mongoose.model("PerfilFuncionario", perfilFuncionarioSchema);
