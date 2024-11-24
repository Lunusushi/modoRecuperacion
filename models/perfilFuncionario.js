const mongoose = require("mongoose");
const perfilFuncionarioSchema = mongoose.Schema({
    nombre: String,
    //factorValor: Float32Array | js de mierda no se puede definir un float solo
    factorValor: Number
    // comentario 2: Filho da puta agora si temdo, el Number se usa para el mongo
});

module.exports = mongoose.model("PerfilFuncionario", perfilFuncionarioSchema);
