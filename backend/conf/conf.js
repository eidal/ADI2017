//Importamos librería para MongoDB
var mongoose  = require('mongoose');
mongoose.set('debug', true);
//Librería para hacer _id autoincrement
var autoIncrement = require('mongodb-autoincrement');

//URL en local (sustituir)
mongoose.connect('mongodb://localhost/comparteviaje', function(err, resp) { 
//mongoose.connect('mongodb://eidal:eidal1980@dbh63.mlab.com:27637/heroku_qq15mj4l',function(err,resp) {
 if(err) {
    console.log('ERROR: al conectar con la base de datos. ' + err);
  }
}); 

mongoose.plugin(autoIncrement.mongoosePlugin);

module.exports = mongoose;