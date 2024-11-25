const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const {ApolloServer, gql} = require("apollo-server-express");

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
}
type Cajero{
    id: ID!
    lugar: String!
    ventas: String!
    vale: Vale
}
input CajeroInput{
    lugar: String!
    ventas: String!
    vale: ID!
}
type Funcionario{
    id: ID!
    nombre: String!
    user: String!
    pass: String!
    vale: [Vale]
    perfil: PerfilFuncionario
    turno: [Turno]
    permisosGen: PermisosGen
}
input FuncionarioInput{
    nombre: String!
    user: String!
    pass: String!
    vale: [ID]
    perfil: ID!
    turno: [ID]
    permisosGen: ID!
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
    emitidos: [ID]
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
    limiteTurno: Int!
    esLimitado: Boolean!
    funcionario: Funcionario
    tipo: [TipoVale]
}
input PermisosGenInput{
    limiteTurno: Int!
    esLimitado: Boolean!
    funcionario: ID!
    tipo: [ID]
}
type TipoVale{
    id: ID!
    valorBase: Int!
    turno: Turno
}
input TipoValeInput{
    valorBase: Int!
    turno: ID
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
    valor: Int!
    canjeado: Boolean!
    tipo: TipoVale
    funcionario: Funcionario
}
input ValeInput{
    valor: Int!
    canjeado: Boolean!
    tipo: ID!
    funcionario: ID!
}
union ResponseBody = Administrador | Funcionario | Vale | Turno
type Response{
    statusCode: String
    body: ResponseBody
    errorCode: String
    descriptionError: String
}
type Query{
    getAdministradores: [Administrador]
    getAdministradorById(id: ID!): Administrador
    getCajeros: [Cajero]
    getCajeroById(id: ID!): Cajero
    getFuncionarios: [Funcionario]
    getFuncionarioById(id: ID!): Funcionario
    getInformes: [Informe]
    getInformeById(id: ID!): Informe
    getPerfilFuncionarios: [PerfilFuncionario]
    getPerfilFuncionarioById(id: ID!): PerfilFuncionario
    getPermisosGens: [PermisosGen]
    getPermisosGenById(id: ID!): PermisosGen
    getTipoVales: [TipoVale]
    getTipoValeById(id: ID!): TipoVale
    getTurnos: [Turno]
    getTurnoById(id: ID!): Turno
    getVales: [Vale]
    getValeById(id: ID!): Vale
    getValesByFuncionario(id: ID!): [Vale]
    getFuncionarioByPerfil(perfilId: ID!): [Funcionario]
    getPermisosGenByFuncionario(funcionarioId: ID!): PermisosGen
    getTurnosByFuncionario(funcionarioId: ID!): [Turno]
}
type Mutation{
    addAdministrador(input: AdministradorInput!): Response
    updateAdministrador(id: ID!, input: AdministradorInput!): Response
    deleteAdministrador(id: ID!): Response
    addCajero(input: CajeroInput!): Response
    updateCajero(id: ID!, input: CajeroInput!): Response
    deleteCajero(id: ID!): Response
    addFuncionario(input: FuncionarioInput!): Response
    updateFuncionario(id: ID!, input: FuncionarioInput!): Response
    deleteFuncionario(id: ID!): Response
    addVale(input: ValeInput!): Response
    updateVale(id: ID!, input: ValeInput!): Response
    deleteVale(id: ID!): Response
    addPermisoGen(input: PermisosGenInput!): Response
    updatePermisoGen(id: ID!, input: PermisosGenInput!): Response
    deletePermisoGen(id: ID!): Response
    addTurno(input: Turnoinput!): Response
    updateTurno(id: ID!, input: Turnoinput!): Response
    deleteTurno(id: ID!): Response
}
`

const resolvers = {
    ResponseBody: {
        __resolveType(obj) {
            if (obj.nombre && obj.user && obj.pass) {
                return "Administrador";
            }
            if (obj.nombre && obj.perfil && obj.turno) {
                return "Funcionario";
            }
            if (obj.valor && obj.canjeado !== undefined) {
                return "Vale";
            }
            if (obj.nombre && obj.horaIni && obj.horaFin) {
                return "Turno";
            }
            return null; // En caso de que no coincida con ningún tipo
        },
    },
    Query: {
        // Administrador
        async getAdministradores() {
            return await Administrador.find();
        },
        async getAdministradorById(_, { id }) {
            return await Administrador.findById(id);
        },
    
        // Cajero
        async getCajeros() {
            return await Cajero.find().populate('vale');
        },
        async getCajeroById(_, { id }) {
            return await Cajero.findById(id).populate('vale');
        },
    
        // Funcionario
        async getFuncionarios() {
            return await Funcionario.find().populate('vale perfil turno permisosGen');
        },
        async getFuncionarioById(_, { id }) {
            return await Funcionario.findById(id).populate('vale perfil turno permisosGen');
        },
    
        // Informe
        async getInformes() {
            return await Informe.find().populate('emitidos');
        },
        async getInformeById(_, { id }) {
            return await Informe.findById(id).populate('emitidos');
        },
    
        // PerfilFuncionario
        async getPerfilFuncionarios() {
            return await PerfilFuncionario.find();
        },
        async getPerfilFuncionarioById(_, { id }) {
            return await PerfilFuncionario.findById(id);
        },
    
        // PermisosGen
        async getPermisosGens() {
            return await PermisosGen.find().populate('funcionario tipo');
        },
        async getPermisosGenById(_, { id }) {
            return await PermisosGen.findById(id).populate('funcionario tipo');
        },
    
        // TipoVale
        async getTipoVales() {
            return await TipoVale.find().populate('turno');
        },
        async getTipoValeById(_, { id }) {
            return await TipoVale.findById(id).populate('turno');
        },
    
        // Turno
        async getTurnos() {
            return await Turno.find();
        },
        async getTurnoById(_, { id }) {
            return await Turno.findById(id);
        },
    
        // Vale
        async getVales() {
            return await Vale.find().populate('tipo funcionario');
        },
        async getValeById(_, { id }) {
            return await Vale.findById(id).populate('tipo funcionario');
        },

        // 
        async getValesByFuncionario(_, { id }) {
            return await Vale.find({ funcionario: id }).populate('tipo funcionario');
        },
        async getFuncionarioByPerfil(_, { perfilId }) {
            return await Funcionario.find({ perfil: perfilId }).populate('vale perfil turno permisosGen');
        },
        async getPermisosGenByFuncionario(_, { funcionarioId }) {
            return await PermisosGen.findOne({ funcionario: funcionarioId }).populate('funcionario tipo');
        },
        async getTurnosByFuncionario(_, { funcionarioId }) {
            const funcionario = await Funcionario.findById(funcionarioId).populate('turno');
            return funcionario ? funcionario.turno : [];
        },
    },
    Mutation: {
        // Administrador
        async addAdministrador(_, { input }) {
            if (!input || !input.nombre || !input.user || !input.pass) {
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "1",
                    descriptionError: "Los campos 'nombre', 'user' y 'pass' son obligatorios.",
                };
            }

            const administrador = new Administrador(input);
            await administrador.save();
            return {
                statusCode: "200",
                body: administrador,
                errorCode: "0",
                descriptionError: "",
            };
        },
        async updateAdministrador(_, { id, input }) {
            const administradorExistente = await Administrador.findById(id);
            if (!administradorExistente) {
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "2",
                    descriptionError: "El administrador especificado no existe.",
                };
            }

            if (!input || !input.nombre || !input.user || !input.pass) {
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "3",
                    descriptionError: "Los campos 'nombre', 'user' y 'pass' son obligatorios.",
                };
            }

            administradorExistente.nombre = input.nombre;
            administradorExistente.user = input.user;
            administradorExistente.pass = input.pass;

            await administradorExistente.save();
            return {
                statusCode: "200",
                body: administradorExistente,
                errorCode: "0",
                descriptionError: "",
            };
        },
        async deleteAdministrador(_, { id }) {
            const administrador = await Administrador.findById(id);
            if (!administrador) {
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "4",
                    descriptionError: "El administrador especificado no existe.",
                };
            }

            await administrador.deleteOne();
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: "Administrador eliminado correctamente.",
            };
        },

		// Funcionario
		async addFuncionario(_, { input }) {
			if (!input || !input.nombre || !input.user || !input.pass || !input.perfil) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "1",
					descriptionError: "Los campos 'nombre', 'user', 'pass' y 'perfil' son obligatorios.",
				};
			}

			// Verificar que el perfil existe
			const perfilBuscado = await PerfilFuncionario.findById(input.perfil);
			if (!perfilBuscado) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "2",
					descriptionError: "El perfil especificado no existe.",
				};
			}

			// Verificar que el turno no sea nulo o vacío
			if (!input.turno || input.turno.length === 0) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "3",
					descriptionError: "El empleado debe tener al menos un turno asignado.",
				};
			}

			// Verificar que los turnos existen
			const turnosBuscados = await Turno.find({ _id: { $in: input.turno } });
			if (turnosBuscados.length !== input.turno.length) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "4",
					descriptionError: "Uno o más turnos especificados no existen.",
				};
			}

			const funcionario = new Funcionario({
				nombre: input.nombre,
				user: input.user,
				pass: input.pass,
				perfil: perfilBuscado._id,
				vale: input.vale || [], // Opcional
				turno: input.turno, // Obligatorio
				permisosGen: input.permisosGen || null, // Opcional
			});

			await funcionario.save();
			return {
				statusCode: "200",
				body: funcionario,
				errorCode: "0",
				descriptionError: "",
			};
		},

		async updateFuncionario(_, { id, input }) {
			const funcionarioExistente = await Funcionario.findById(id);
			if (!funcionarioExistente) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "5",
					descriptionError: "El funcionario especificado no existe.",
				};
			}

			if (!input || !input.nombre || !input.user || !input.pass || !input.perfil) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "6",
					descriptionError: "Los campos 'nombre', 'user', 'pass' y 'perfil' son obligatorios.",
				};
			}

			// Validar turno
			if (!input.turno || input.turno.length === 0) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "7",
					descriptionError: "El empleado debe tener al menos un turno asignado.",
				};
			}

			const turnosBuscados = await Turno.find({ _id: { $in: input.turno } });
			if (turnosBuscados.length !== input.turno.length) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "8",
					descriptionError: "Uno o más turnos especificados no existen.",
				};
			}

			funcionarioExistente.nombre = input.nombre;
			funcionarioExistente.user = input.user;
			funcionarioExistente.pass = input.pass;
			funcionarioExistente.perfil = input.perfil;
			funcionarioExistente.vale = input.vale || funcionarioExistente.vale; // Opcional
			funcionarioExistente.turno = input.turno; // Obligatorio
			funcionarioExistente.permisosGen = input.permisosGen || funcionarioExistente.permisosGen;

			await funcionarioExistente.save();
			return {
				statusCode: "200",
				body: funcionarioExistente,
				errorCode: "0",
				descriptionError: "",
			};
		},

        // Turno
        async addTurno(_, { input }) {
            if (!input || !input.nombre || !input.horaIni || !input.horaFin) {
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "1",
                    descriptionError: "Los campos 'nombre', 'horaIni' y 'horaFin' son obligatorios.",
                };
            }

            const turno = new Turno(input);
            await turno.save();
            return {
                statusCode: "200",
                body: turno,
                errorCode: "0",
                descriptionError: "",
            };
        },
        async deleteTurno(_, { id }) {
            const turno = await Turno.findById(id);
            if (!turno) {
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "2",
                    descriptionError: "El turno especificado no existe.",
                };
            }

            await turno.deleteOne();
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: "Turno eliminado correctamente.",
            };
        },

		// Vales
		async addVale(_, { input }) {
			if (!input || !input.valor || input.canjeado == null || !input.tipo || !input.funcionario) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "1",
					descriptionError: "Los campos 'valor', 'canjeado', 'tipo' y 'funcionario' son obligatorios.",
				};
			}

			const tipoVale = await TipoVale.findById(input.tipo);
			if (!tipoVale) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "2",
					descriptionError: "El tipo de vale especificado no existe.",
				};
			}

			const funcionario = await Funcionario.findById(input.funcionario);
			if (!funcionario) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "3",
					descriptionError: "El funcionario especificado no existe.",
				};
			}

			const vale = new Vale({
				valor: input.valor,
				canjeado: input.canjeado,
				tipo: tipoVale._id,
				funcionario: funcionario._id,
			});

			await vale.save();
			return {
				statusCode: "200",
				body: vale,
				errorCode: "0",
				descriptionError: "",
			};
		},
		async updateVale(_, { id, input }) {
			const valeExistente = await Vale.findById(id);
			if (!valeExistente) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "4",
					descriptionError: "El vale especificado no existe.",
				};
			}

			if (!input || !input.valor || input.canjeado == null || !input.tipo || !input.funcionario) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "5",
					descriptionError: "Los campos 'valor', 'canjeado', 'tipo' y 'funcionario' son obligatorios.",
				};
			}

			const tipoVale = await TipoVale.findById(input.tipo);
			if (!tipoVale) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "6",
					descriptionError: "El tipo de vale especificado no existe.",
				};
			}

			const funcionario = await Funcionario.findById(input.funcionario);
			if (!funcionario) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "7",
					descriptionError: "El funcionario especificado no existe.",
				};
			}

			valeExistente.valor = input.valor;
			valeExistente.canjeado = input.canjeado;
			valeExistente.tipo = tipoVale._id;
			valeExistente.funcionario = funcionario._id;

			await valeExistente.save();
			return {
				statusCode: "200",
				body: valeExistente,
				errorCode: "0",
				descriptionError: "",
			};
		},
		async deleteVale(_, { id }) {
			const vale = await Vale.findById(id);
			if (!vale) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "8",
					descriptionError: "El vale especificado no existe.",
				};
			}

			await vale.deleteOne();
			return {
				statusCode: "200",
				body: null,
				errorCode: "0",
				descriptionError: "Vale eliminado correctamente.",
			};
		},
        
		// Cajeros
		async addCajero(_, { input }) {
			if (!input || !input.lugar || input.ventas == null || !input.vale) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "1",
					descriptionError: "Los campos 'lugar', 'ventas' y 'vale' son obligatorios.",
				};
			}

			const valeBuscado = await Vale.findById(input.vale);
			if (!valeBuscado) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "2",
					descriptionError: "El vale especificado no existe.",
				};
			}

			const cajero = new Cajero({
				lugar: input.lugar,
				ventas: input.ventas,
				vale: valeBuscado._id,
			});

			await cajero.save();
			return {
				statusCode: "200",
				body: cajero,
				errorCode: "0",
				descriptionError: "",
			};
		},
		async updateCajero(_, { id, input }) {
			const cajeroExistente = await Cajero.findById(id);
			if (!cajeroExistente) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "3",
					descriptionError: "El cajero especificado no existe.",
				};
			}

			if (!input || !input.lugar || input.ventas == null || !input.vale) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "4",
					descriptionError: "Los campos 'lugar', 'ventas' y 'vale' son obligatorios.",
				};
			}

			const valeBuscado = await Vale.findById(input.vale);
			if (!valeBuscado) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "5",
					descriptionError: "El vale especificado no existe.",
				};
			}

			cajeroExistente.lugar = input.lugar;
			cajeroExistente.ventas = input.ventas;
			cajeroExistente.vale = valeBuscado._id;

			await cajeroExistente.save();
			return {
				statusCode: "200",
				body: cajeroExistente,
				errorCode: "0",
				descriptionError: "",
			};
		},
		async deleteCajero(_, { id }) {
			const cajero = await Cajero.findById(id);
			if (!cajero) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "6",
					descriptionError: "El cajero especificado no existe.",
				};
			}

			await cajero.deleteOne();
			return {
				statusCode: "200",
				body: null,
				errorCode: "0",
				descriptionError: "Cajero eliminado correctamente.",
			};
		},

		// PermisosGen
		async addPermisoGen(_, { input }) {
			if (!input || input.limiteTurno == null || input.esLimitado == null || !input.funcionario || !input.tipo) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "1",
					descriptionError: "Los campos 'limiteTurno', 'esLimitado', 'funcionario' y 'tipo' son obligatorios.",
				};
			}

			const funcionario = await Funcionario.findById(input.funcionario);
			if (!funcionario) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "2",
					descriptionError: "El funcionario especificado no existe.",
				};
			}

			const tipos = await TipoVale.find({ _id: { $in: input.tipo } });
			if (tipos.length !== input.tipo.length) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "3",
					descriptionError: "Uno o más tipos de vale especificados no existen.",
				};
			}

			const permiso = new PermisosGen({
				limiteTurno: input.limiteTurno,
				esLimitado: input.esLimitado,
				funcionario: funcionario._id,
				tipo: input.tipo,
			});

			await permiso.save();
			return {
				statusCode: "200",
				body: permiso,
				errorCode: "0",
				descriptionError: "",
			};
		},
		async deletePermisoGen(_, { id }) {
			const permiso = await PermisosGen.findById(id);
			if (!permiso) {
				return {
					statusCode: "400",
					body: null,
					errorCode: "4",
					descriptionError: "El permiso especificado no existe.",
				};
			}

			await permiso.deleteOne();
			return {
				statusCode: "200",
				body: null,
				errorCode: "0",
				descriptionError: "Permiso eliminado correctamente.",
			};
		},
    },
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