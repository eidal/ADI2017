var config = require('../conf/config')

var Reserva = new config.Schema({ 
    usuario: { type: Number, ref: 'Usuario' },
    viaje: { type: Number, ref: 'Viaje' },
    plazas: Number
})

module.exports = config.model('Reserva', Reserva);