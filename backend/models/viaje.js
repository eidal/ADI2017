var conf = require('../conf/conf')

var Viaje = new conf.Schema({
        usuario: { type: Number, ref: 'Usuario' },
        titulo: String,
        descripcion: String,
        desdeCiudad: String,
        hastaCiudad: String,
        fecha: Date,
        plazas: Number,
        importe: Number
    });

//Construyo el modelo

module.exports = conf.model('Viaje',Viaje);