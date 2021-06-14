'use strict'
const LogsReconhecimento = use('App/Models/LogsReconhecimento')

class LogController {

    async logDeDeteccao({request}){
        const parametros = request.all()
        const logDeReconhecimento = LogsReconhecimento.create(parametros)
        return logDeReconhecimento
        // const nomeArquivo = request.only(['nomeArquivo'])
        // const texto = request.only(['logsReconhecimento'])
        // Reconhecimento.create(nomeArquivo)
        // const reconhecimento = await Reconhecimento.findBy(nomeArquivo)
        // const id_reconhecimento = reconhecimento.id
        // const logDeReconhecimento = LogsReconhecimento.create(texto, id_reconhecimento)
        // return log
        // if(id_reconhecimento){
        //     LogsReconhecimento.create(texto)
        //     const logDeReconhecimento = await LogsReconhecimento.findBy(texto)
        //     logDeReconhecimento.merge({...id_reconhecimento})
        //     await logDeReconhecimento.save()
        //     return logDeReconhecimento
        // }
        return 'nao foi encontrado o id'
    }

    deteccao({params}){
        const logReconhecimento = LogsReconhecimento.findBy('id', params.id)
        const nomeArquivo = logReconhecimento.nomeArquivo
        if(nomeArquivo)
            return nomeArquivo
        return 'nao há logs com o id informado'
    }
}

module.exports = LogController
