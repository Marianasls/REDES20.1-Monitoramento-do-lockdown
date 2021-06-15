'use strict'
const Horario = use("App/Models/Horario")
class HorarioController {

    cadastrarHorario({request}){
        const parametro = request.all()
        const horario = Horario.create(parametro)
        return horario
    }

    async horario({params}){
        const {horario} = await Horario.findBy('id', params.id)
        if(horario)
            return horario
        return 'nao há logs com o id informado'
    }
}

module.exports = HorarioController
