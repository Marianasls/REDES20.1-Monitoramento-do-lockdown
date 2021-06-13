'use strict'

const Usuario = use('App/Models/Usuario')

class UsuarioController {

    cadastrarUsuario({request}){
        const parametros = request.only(['login','senha','tipo_usuario'])
        const usuario =  Usuario.create(parametros)    
        return usuario
    }
}

module.exports = UsuarioController
