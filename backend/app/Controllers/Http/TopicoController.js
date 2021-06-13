'use strict'
const Topico = use('App/Models/Topico')

class TopicoController {
    
    cadastrarTopico({request}){
        const parametros = request.only(['nome'])
        const topico =  Topico.create(parametros)    
        return topico
    }
}

module.exports = TopicoController
