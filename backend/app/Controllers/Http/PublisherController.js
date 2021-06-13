'use strict'
const Publisher = use('App/Models/Publisher')
class PublisherController {

    cadastrarPublisher({request}){
        const parametros = request.only(['login','senha'])
        const publisher =  Publisher.create(parametros)    
        return publisher
    }
}

module.exports = PublisherController
