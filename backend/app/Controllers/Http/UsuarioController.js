'use strict'

const Usuario = use('App/Models/User')

class UsuarioController {

    cadastrarUsuario({request}){
        const parametros = request.only(['username','email','password','tipo_usuario'])
        const usuario =  Usuario.create(parametros)    
        return usuario
    }

    async designarTopico({request}){
        const idTopico = request.only(['id_topico'])
        const email = request.only(['email'])
        const usuario = Usuario.findOrFail(email)
        if(usuario){
            usuario.id_topico = idTopico
            if(await usuario.save())
                return usuario
        }
        
       
    }
}

module.exports = UsuarioController
