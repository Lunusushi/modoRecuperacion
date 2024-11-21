const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const {ApolloServer, gql} = require("apollo-server-express");

//const Usuario = require("./models/usuario") (Ahi vemos que maquetita nos armamos para las entradas del db)
//const Perfil = require("./models/perfil");
const { graphql } = require("graphql");

mongoose.connect("mongodb://localhost:27017/graphQL"); //No se como van a llamar a sus db, pero lo wa dejal asi

//falta llenar esto, pero eso lo hago despues
const typeDefs = gql`
`
//no se puede llenar esto sin los typedefs
const resolvers = {};

let apolloServer = null;

const corsOptions = {
    origin: "http://localhost:8091",
    credentials: false
}

async function startServer(){
    apolloServer = new ApolloServer({typeDefs, resolvers, corsOptions});
    await apolloServer.start();

    apolloServer.applyMiddleware({app, cors: false});
} 

startServer();

const app = express();
app.use(cors())
app.listen(8091, function(){
    console.log("Servidor iniciado");
});