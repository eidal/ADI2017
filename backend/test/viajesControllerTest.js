var should = require("should");
var app2 = require("../app");
var supertest = require("supertest")(app2);
var Usuario = require("../models/usuario");
var Viaje = require("../models/viaje");
//Variables auxiliares para guardar id y token usuario a testear y viaje insertado
var idUsuarioInsertado = 9999;
var tokenUsuario="";
var idViajeInsertado = 9999;
var idViajeInsertado2 = 9999;
//Necesito un segundo token correcto para una de las pruebas
var tokenUsuario2="";
//Vacío usuarios y viajes
before (() => {
    Usuario.remove().exec();
    Viaje.remove().exec();
});

describe("/api/viajes", () => {

    beforeEach( (done) => {
        supertest
            .post("/api/usuarios")
            .send({
                "nombre": "Usuario test 2",
                "email": "usuariotestviaje@gmail.com",
                "contrasena": "123456",
                "edad": '36'
            })
            .set('Content-type', 'application/json')
            .end(function (err,res) {
                if(err){
                    tokenUsuario="Noconsigo.nada.denada";
                }
                else{
                    tokenUsuario=res.body.token;
                    idUsuarioInsertado=res.body.id;
                }
                done();
            });
    });

    beforeEach( (done) => {
        supertest    
        .post("/api/viajes")
        .send({
            "titulo": "Viaje 3",
            "descripcion": "Es un viaje apasionante",
            "desdeCiudad": "Elche",
            "hastaCiudad": "Hong Kong",
            "fecha": "2017-11-15",
            "plazas": '3',
            "importe": '2000'
        })
        .set('Content-type', 'application/json')
        .set('Authorization','token '+tokenUsuario)
        .end((err,res) => {
                idViajeInsertado2=res.body._id;
                done();
            });
    });
    
    afterEach((done) => {
        Usuario.findOneAndRemove({email: "usuariotestviaje@gmail.com".toLowerCase()}, function(err, usuarioExiste){
        });
        Viaje.findByIdAndRemove((idViajeInsertado),function (err,resp){
        });
        Viaje.findByIdAndRemove((idViajeInsertado2),function (err,resp){
        });
        done();
    });
    
    it("[POST] Crear viaje - Código 201 OK",(done) => {
    supertest    
        .post("/api/viajes")
        .send({
            "titulo": "Viaje 3",
            "descripcion": "Es un viaje apasionante",
            "desdeCiudad": "Elche",
            "hastaCiudad": "Hong Kong",
            "fecha": "2017-11-15",
            "plazas": '3',
            "importe": '2000'
        })
        .set('Content-type', 'application/json')
        .set('Authorization','token '+tokenUsuario)
        .end((err,res) => {
                res.status.should.equal(201);
                res.body.usuario.should.equal(idUsuarioInsertado);
                idViajeInsertado=res.body._id;
                done();
            });
    });

    it("[POST] Crear viaje - Código 403 sin",(done) => {
        supertest    
            .post("/api/viajes")
            .send({
                "titulo": "Viaje 3",
                "descripcion": "Es un viaje apasionante",
                "desdeCiudad": "Elche",
                "hastaCiudad": "Hong Kong",
                "fecha": "2017-11-15",
                "plazas": '3',
                "importe": '2000'
            })
            .set('Content-type', 'application/json')
            .end((err,res) => {
                    res.status.should.equal(403);
                    res.body.message.should.equal("Tu petición no tiene cabecera de autorización");
                    done();
                });
    });

    it("[GET] Lista de todos los viajes - Código 200 OK",(done) => {
        supertest
            .get("/api/viajes")
            .end((err,res) => {
                res.status.should.equal(200);
                res.body.length.should.equal(1);
            done();
            });
    });    
}); 

describe("/api/viajes/:id", () => {

    beforeEach( (done) => {
        supertest
            .post("/api/usuarios")
            .send({
                "nombre": "Usuario test 2",
                "email": "usuariotestviaje@gmail.com",
                "contrasena": "123456",
                "edad": '36'
            })
            .set('Content-type', 'application/json')
            .end(function (err,res) {
                if(err){
                    tokenUsuario="Noconsigo.nada.denada";
                }
                else{
                    tokenUsuario=res.body.token;
                    idUsuarioInsertado=res.body.id;
                }
                done();
            });
    });

    beforeEach( (done) => {
        supertest    
        .post("/api/viajes")
        .send({
            "titulo": "Viaje 3",
            "descripcion": "Es un viaje apasionante",
            "desdeCiudad": "Elche",
            "hastaCiudad": "Hong Kong",
            "fecha": "2017-11-15",
            "plazas": '3',
            "importe": '2000'
        })
        .set('Content-type', 'application/json')
        .set('Authorization','token '+tokenUsuario)
        .end((err,res) => {
                idViajeInsertado2=res.body._id;
                done();
            });
    });

    beforeEach( (done) => {
        supertest
            .post("/api/usuarios")
            .send({
                "nombre": "Usuario test 2",
                "email": "usuariotestviaje2@gmail.com",
                "contrasena": "123456",
                "edad": '36'
            })
            .set('Content-type', 'application/json')
            .end(function (err,res) {
                if(err){
                    tokenUsuario="Noconsigo.nada.denada";
                }
                else{
                    tokenUsuario2=res.body.token;
                }
                done();
            });
    });
    
    afterEach((done) => {
        Usuario.findOneAndRemove({email: "usuariotestviaje@gmail.com".toLowerCase()}, function(err, usuarioExiste){
        });
        Usuario.findOneAndRemove({email: "usuariotestviaje2@gmail.com".toLowerCase()}, function(err, usuarioExiste){
        });
        Viaje.findByIdAndRemove((idViajeInsertado),function (err,resp){
        });
        Viaje.findByIdAndRemove((idViajeInsertado2),function (err,resp){
        });
        done();
    });

    it("[GET] Consulta viaje por ID - Código 200 OK",(done) => {
        supertest
             .get("/api/viajes/"+idViajeInsertado2)
             .end((err,res) => {
                  res.status.should.equal(200);
                  res.body.usuario.should.equal(idUsuarioInsertado);
                  res.body.titulo.should.equal("Viaje 3");
                  res.body.descripcion.should.equal("Es un viaje apasionante");
                  res.body.plazas.should.equal(3);
                  res.body.importe.should.equal(2000);
                  done();
              });
      });

   it("[GET] Consulta viaje por ID - Código 404 Viaje no existe",(done) => {
        supertest
             .get("/api/viajes/5000")
             .end((err,res) => {
                res.status.should.equal(404);
                res.body.message.should.equal("No existe el viaje con id 5000");
                done();
             });
      });

      it("[PUT] Modifica viaje por ID - Código 403 sin cabecera autorización",(done) => {
        supertest
             .put("/api/viajes/"+idViajeInsertado2)
             .send({
                "titulo": "Viaje 4",
                "descripcion": "Es un viaje desconcertante",
                "desdeCiudad": "Elche",
                "hastaCiudad": "Las Bayas",
                "fecha": "2017-11-15",
                "plazas": '3',
                "importe": '1'
             })
             .set('Content-type', 'application/json')
             .end((err,res) => {
                  res.status.should.equal(403);
                  res.body.message.should.equal("Tu petición no tiene cabecera de autorización");
                  done();
              });
      });

      it("[PUT] Modifica viaje por ID - Código 404 viaje no existe",(done) => {
        supertest
             .put("/api/viajes/5000")
             .send({
                "titulo": "Viaje 4",
                "descripcion": "Es un viaje desconcertante",
                "desdeCiudad": "Elche",
                "hastaCiudad": "Las Bayas",
                "fecha": "2017-11-15",
                "plazas": '3',
                "importe": '1'
             })
             .set('Content-type', 'application/json')
             .set('Authorization','token '+tokenUsuario)
             .end((err,res) => {
                  res.status.should.equal(404);
                  res.body.message.should.equal("No existe el viaje con id 5000");
                  done();
              });
      });

      it("[PUT] Modifica viaje por ID - Código 401 no está autorizado",(done) => {
        supertest
             .put("/api/viajes/"+idViajeInsertado2)
             .send({
                "titulo": "Viaje 4",
                "descripcion": "Es un viaje desconcertante",
                "desdeCiudad": "Elche",
                "hastaCiudad": "Las Bayas",
                "fecha": "2017-11-15",
                "plazas": '3',
                "importe": '1'
             })
             .set('Content-type', 'application/json')
             .set('Authorization','token '+tokenUsuario2)
             .end((err,res) => {
                  res.status.should.equal(401);
                  res.body.message.should.equal("No estás autorizado para realizar este cambio");
                  done();
              });
      });

      it("[PUT] Modifica viaje por ID - Código 204 Cambio correcto",(done) => {
        supertest
             .put("/api/viajes/"+idViajeInsertado2)
             .send({
                "titulo": "Viaje 4",
                "descripcion": "Es un viaje desconcertante",
                "desdeCiudad": "Elche",
                "hastaCiudad": "Las Bayas",
                "fecha": "2017-11-15",
                "plazas": '3',
                "importe": '1'
             })
             .set('Content-type', 'application/json')
             .set('Authorization','token '+tokenUsuario)
             .end((err,res) => {
                res.status.should.equal(204);
                done();
              });
      });

      it("[DELETE] Borrar viaje por ID - Código 403 sin cabecera autorización",(done) => {
        supertest
             .delete("/api/viajes/"+idViajeInsertado2)
             .end((err,res) => {
                res.status.should.equal(403);
                res.body.message.should.equal("Tu petición no tiene cabecera de autorización");
                done();
              });
      });

      it("[DELETE] Borrar viaje por ID - Código 404 viaje no existe",(done) => {
        supertest
             .delete("/api/viajes/5000")
             .set('Authorization','token '+tokenUsuario)
             .end((err,res) => {
                res.status.should.equal(404);
                res.body.message.should.equal("No existe el viaje con id 5000");
                done();
              });
      });

      it("[DELETE] Borrar viaje por ID - Código 401 no está autorizado",(done) => {
        supertest
             .delete("/api/viajes/"+idViajeInsertado2)
             .set('Authorization','token '+tokenUsuario2)
             .end((err,res) => {
                res.status.should.equal(401);
                res.body.message.should.equal("No estás autorizado para realizar este cambio");
                done();
              });
      });

      it("[DELETE] Borrar viaje por ID - Código 200 Cambio correcto",(done) => {
        supertest
             .delete("/api/viajes/"+idViajeInsertado2)
             .set('Authorization','token '+tokenUsuario)
             .expect(200)
             .end((err,res) => {
                res.status.should.equal(200);
                res.body.message.should.equal("Viaje borrado correctamente");
                done();;
              });
      });
});