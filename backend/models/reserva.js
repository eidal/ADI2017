var conf = require('../conf/conf')

var Reserva = new conf.Schema({ 
    usuario: { type: Number, ref: 'Usuario' },
    viaje: { type: Number, ref: 'Viaje' },
    plazas: Number
});

module.exports = conf.model('Reserva', Reserva);