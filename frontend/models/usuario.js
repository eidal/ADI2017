var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

    var Usuario = new Schema({
        nombre: String,
        apellidos: String,
        email: String,
        puntuacion: Number
    });

    //Construyo el modelo

    module.exports = mongoose.model('Usuario',Usuario);