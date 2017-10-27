//Cargamos el módulo express
var express = require('express');
var app = express();

//Cargamos body-parser
var bodpar = require('body-parser');
app.use(bodpar.json());

// Cargamos librerías MongoDB
var mongoose  = require('mongoose')
mongoose.set('debug', true);
//Librería para hacer _id autoincrement
var autoIncrement = require('mongodb-autoincrement')

var router = express.Router();

//Cargamos controller Usuario
var usuariosController = require('./controllers/usuariosController');

//En Express asociamos un método HTTP y una URL con un callback a ejecutar
router.get('/', function(pet,resp) {
   //Tenemos una serie de primitivas para devolver la respuesta HTTP
   resp.status(200);
   resp.send('Bienvenido al API de ComparteCoche'); 
});

// API ROUTES

// ROUTES USUARIOS BEGIN

router.route('/usuarios')
  .get(usuariosController.findAllUsuarios)
  .post(usuariosController.addUsuario);

router.route('/usuarios/:id')
  .get(usuariosController.findByIdUsuario)
  .put(usuariosController.updateUsuario)
  .delete(usuariosController.deleteUsuario);
  
// ROUTES USUARIOS END

app.use('/api',router);

//Este método delega en el server.listen "nativo" de Node
app.listen(3000, function () {
  console.log("El servidor express está en el puerto 3000");
});

