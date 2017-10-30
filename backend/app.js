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
var viajesController = require('./controllers/viajesController');
var reservasController = require('./controllers/reservasController');

//Cargamos funcionalidad para sesion
var middleware = require('./services/middleware');

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
  .put(middleware.ensureAuthenticated,usuariosController.updateUsuario)
  .delete(middleware.ensureAuthenticated,usuariosController.deleteUsuario);

router.route('/usuarios/login')
  .post(usuariosController.emailLogin);
// ROUTES USUARIOS END

// ROUTES VIAJES BEGIN

router.route('/viajes')
  .get(viajesController.findAllViajes)
  .post(middleware.ensureAuthenticated,viajesController.addViaje);

router.route('/viajes/:id')
  .get(viajesController.findByIdViaje)
  .put(middleware.ensureAuthenticated,viajesController.updateViaje)
  .delete(middleware.ensureAuthenticated,viajesController.deleteViaje);

router.route('/viajes/usuarios/:usuario')
  .get(viajesController.findAllViajesUsuario);  

// ROUTES VIAJES END

// ROUTES RESERVAS BEGIN

router.route('/reservas')
.post(middleware.ensureAuthenticated,reservasController.addReserva);

router.route('/reservas/:id')
.get(reservasController.findByIdReserva)
.put(middleware.ensureAuthenticated,reservasController.updateReserva)
.delete(middleware.ensureAuthenticated,reservasController.deleteReserva);

router.route('/reservas/viajes/:viaje')
  .get(reservasController.findAllReservasViaje);

router.route('/reservas/usuarios/:usuario')
  .get(reservasController.findAllReservasUsuario);
// ROUTES RESERVAS END


app.use('/api',router);

//Este método delega en el server.listen "nativo" de Node
app.listen(3000, function () {
  console.log("El servidor express está en el puerto 3000");
});

module.exports = app;
