'use strict'

class AutenticacaoController {

    async autenticar({request, auth}){
        const {email, password} = request.all()
        const token =  await auth.attempt(email, password)
        return token
    }
}

module.exports = AutenticacaoController
