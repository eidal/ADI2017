var conf = require('../conf/conf')

var Usuario = new conf.Schema({
        nombre: String,
        email: String,
        edad: Number
    });

    //Construyo el modelo

    module.exports = conf.model('Usuario',Usuario);