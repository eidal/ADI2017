//Cargamos el módulo express
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var router = express.Router();

//En Express asociamos un método HTTP y una URL con un callback a ejecutar
router.get('/', function(pet,resp) {
   //Tenemos una serie de primitivas para devolver la respuesta HTTP
   resp.status(200);
   resp.send('Hola soy Express'); 
});

app.use(router);

mongoose.connect('mongodb://localhost/compartecoche', function(err, res) {
    if(err) {
      console.log('ERROR: connecting to Database. ' + err);
    }
    //Este método delega en el server.listen "nativo" de Node
    app.listen(3000, function () {
    console.log("El servidor express está en el puerto 3000");
    });
});
