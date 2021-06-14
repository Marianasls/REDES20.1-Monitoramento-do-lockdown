'use strict'
const LogsReconhecimento = use('App/Models/LogsReconhecimento')

class LogController {

    async logDeDeteccao({request}){
        const parametros = request.all()
        const logDeReconhecimento = LogsReconhecimento.create(parametros)
        if(logDeReconhecimento)
            return logDeReconhecimento
        return 'nao foi encontrado o id'
    }

    async deteccao({params}){
        const {nomeArquivo} = await LogsReconhecimento.findBy('id', params.id)
        if(nomeArquivo)
            return nomeArquivo
        return 'nao há logs com o id informado'
    }
}

module.exports = LogController
