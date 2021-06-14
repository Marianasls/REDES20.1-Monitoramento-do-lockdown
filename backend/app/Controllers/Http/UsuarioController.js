'use strict'

const Usuario = use('App/Models/User')

class UsuarioController {

    cadastrarUsuario({request}){
        const parametros = request.only(['username','email','password','tipo_usuario'])
        const usuario =  Usuario.create(parametros)    
        return usuario
    }

    async designarTopico({request, params}){
        const dataToUpdate = request.all()
        const usuario = await Usuario.findBy('id',params.id)
        if(usuario){
            usuario.merge({...dataToUpdate})
            await usuario.save()
            return usuario
        }
        return "nao foi encontrado o cadastro"     
    }
}

module.exports = UsuarioController
