'use strict'
const Subscriber = use('App/Models/Subscriber')

class SubscriberController {

    cadastrarSubscriber({request}){
        const parametros = request.only(['login','senha'])
        const subscriber =  Subscriber.create(parametros)    
        return subscriber
    }
}

module.exports = SubscriberController
