const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const {ApolloServer, gql} = require("apollo-server-express");

//const usuario = require("./models/Usuario");
//const Perfil = require("./models/perfil");

const Administrador = require("./models/administrador")
const Cajero = require("./models/cajero")
const Funcionario = require("./models/funcionario")
const Informe = require("./models/informe")
const PerfilFuncionario = require("./models/perfilFuncionario")
const PermisosGen = require("./models/permisosGen")
const TipoVale = require("./models/tipoVale")
const Turno = require("./models/turno")
const Vale = require("./models/vale")

const { graphql } = require("graphql");

mongoose.connect("mongodb://localhost:27017/graphQL"); //No se como van a llamar a sus db, pero lo wa dejal asi

/*
const typeDefs = gql`
type Usuario{
    id: ID!
    email: String!
    pass: String!
}
input UsuarioInput{
    email: String!
    pass: String!
}
type Vales{
    id: ID!
    servicio: String!
    horario: String!
    valor: Float!
}
input ValesInput{
    servicio: String!
    horario: String!
    valor: Float!
}
type Alert{
    message: String
}
type Response{
    statusCode: String
    body: String
    errorCode: String
    descriptionError: String
}
type Query{
    getUsuarios: [Usuario]
    getUsuarioById(id: ID!): Usuario
    getVales: [Vales]
    getValesById(id: ID!)
    getValesUsuario: [Vales]
    getValesByIdUsuarios(id: ID!): Vales
}
type Mutation{
    addUsuario(input: UsuarioInput): Response
    updUsuario(id: ID!, input: UsuarioInput): Usuario
    delUsuario(id: ID!): Alert
    addVales(input: ValesInput): Vales
    updVales(id: ID!, input: ValesInput): Vales
    delVales(id: ID!): Alert
}
`
*/
const typeDefs = gql`
type Administrador{
    id: ID!
    nombre: String!
    user: String!
    pass: String!
}
input AdministradorInput{
    nombre: String!
    user: String!
    pass: String!
type Cajero{
    id: ID!
    lugar: String!
    ventas: String!
    vale: Vale
}
input CajeroInput{
    lugar: String!
    ventas: String!
    vale: Vale
}
type Funcionario{
    id: ID!
    nombre: String!
    user: String!
    pass: String!
    vale: [Vale]
    perfil: PerfilFuncionario
    turno: [Turno]
    permisosGen: PermisosGeneracion
}
input FuncionarioInput{
    nombre: String!
    user: String!
    pass: String!
    vale: [Vale]
    perfil: PerfilFuncionario
    turno: [Turno]
    permisosGen: PermisosGeneracion
}
type Informe{
    id: ID!
    fecha: String!
    hora: String!
    lugar: String!
    emitidos: [Vale]
}
input InformeInput{
    fecha: String!
    hora: String!
    lugar: String!
    emitidos: [Vale]
}
type PerfilFuncionario{
    id: ID!
    cargo: String!
    factorValor: String!
}
input PerfilFuncionarioInput{
    cargo: String!
    factorValor: String!
}
type PermisosGen{
    id: ID!
    limiteTurno: Number!
    esLimitado: Boolean!
    funcionario: Funcionario
    tipo: [TipoVale]
}
input PermisosGenInput{
    limiteTurno: Number!
    esLimitado: Boolean!
    funcionario: Funcionario
    tipo: [TipoVale]
}
type TipoVale{
    id: ID!
    valorBase: Number!
    turno: Turno
}
input TipoValeInput{
    valorBase: Number!
    turno: Turno
}
type Turno{
    id: ID!
    nombre: String!
    horaIni: String!
    horaFin: String!
}
input Turnoinput{
    nombre: String!
    horaIni: String!
    horaFin: String!
}
type Vale{
    id: ID!
    valor: Number!
    canjeado: Boolean!
    tipo: TipoVale
    funcionario: Funcionario
}
input ValeInput{
    valor: Number!
    canjeado: Boolean!
    tipo: TipoVale
    funcionario: Funcionario
}
`

//no se puede llenar esto sin los typedefs
const resolvers = {
    Query: {
        async getUsuarios(obj){
            let usuarios = await Usuario.find();
            return usuarios;
        },
        async getUsuarioById(obj, { id }) {
            let usuarios = await Usuario.findById(id);
            return usuario;
        },
        async getVales(obj){
            let vales = await Vales.find();
            return vales;
        },
        async getValesById(obj, { id }){
            let vales = await Vales.findById(id);
            return vales
        },
        async getValesUsuario(obj){
            let vales = await Vales.find().populate('Usuario');
            return vales;
        },
        async getValesByIdUsuarios(obj, { id }) {
            let vales = await Vales.findById(id).populate('Usuario');
            return vales;
        }
    },
    Mutation: {
        //a este se le añaden las validaciones para añadir un usuario
        async addUsuario(obj, { input }){
            let usuario = new Usuario({email: input.email, pass: input.pass});
            await usuario.save()
            return {
                statusCode: "200",
                body: usuario,
                errorCode: "0",
                descriptionError: ""
            }
        },
        async updUsuario(obj, {id, input}){
            let usuario = await Usuario.findByIdAndUpdate(id, {email: input.email, pass: input.pass});
            return usuario;
        },
        async delUsuario(obj, { id }){
            await Usuario.deleteOne({_id: id});
            return {
                message: "Usuario eliminado"
            }
        }
    }
};

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