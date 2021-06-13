'use strict'

const Usuario = use('App/Models/User')

class UsuarioController {

    cadastrarUsuario({request}){
        const parametros = request.only(['username','email','password','tipo_usuario'])
        const usuario =  Usuario.create(parametros)    
        return usuario
    }
}

module.exports = UsuarioController
