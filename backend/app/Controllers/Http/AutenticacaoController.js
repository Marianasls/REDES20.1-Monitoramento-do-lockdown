'use strict'
const Subscriber = use('App/Models/Subscriber')
class AutenticacaoController {

    async autenticar({request, auth}){
        const login = request.only('login')
        const senha = request.only('senha')
        const token =  await auth.attempt(login, senha)
        return token
    }
}

module.exports = AutenticacaoController
