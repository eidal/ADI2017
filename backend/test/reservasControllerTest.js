var should = require("should");
var app3 = require("../app");
var supertest = require("supertest")(app3);
var Usuario = require("../models/usuario");
var Viaje = require("../models/viaje");
var Reserva = require("../models/reserva");

//Variables auxiliares para guardar id y token usuario a testear y viaje insertado
var idUsuarioInsertado = 9999;
var idUsuarioInsertado2 = 9999;
var tokenUsuario="";
var idViajeInsertado = 9999;
var idViajeInsertado2 = 9999;
var idReservaInsertada = 9999;
var idReservaInsertada2 = 9999;

//Necesito un segundo token correcto para una de las pruebas
var tokenUsuario2="";
//Vacío usuarios, viajes y reservas
before (() => {
    Usuario.remove().exec();
    Viaje.remove().exec();
    Reserva.remove().exec();
});

describe("/api/reservas", () => {

    beforeEach( (done) => {
        supertest
            .post("/api/usuarios")
            .send({
                "nombre": "Usuario test 2",
                "email": "usuariotestreserva@gmail.com",
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
        Usuario.findOneAndRemove({email: "usuariotestreserva@gmail.com".toLowerCase()}, function(err, usuarioExiste){
        });
        Viaje.findByIdAndRemove((idViajeInsertado),function (err,resp){
        });
        Viaje.findByIdAndRemove((idViajeInsertado2),function (err,resp){
        });
        Reserva.findByIdAndRemove((idReservaInsertada),function (err,resp){
        });
        done();
    });
    
    it("[POST] Crear reserva - Código 201 OK",(done) => {
    supertest    
        .post("/api/reservas")
        .send({
            "viaje": idViajeInsertado2,
            "plazas": 1
        })
        .set('Content-type', 'application/json')
        .set('Authorization','token '+tokenUsuario)
        .end((err,res) => {
                res.status.should.equal(201);
                res.body.usuario.should.equal(idUsuarioInsertado);
                res.body.viaje.should.equal(idViajeInsertado2);
                res.body.plazas.should.equal(1);
                idReservaInsertada=res.body._id;
                done();
            });
    });

    it("[POST] Crear reserva - Código 400 Nº plazas superior viaje",(done) => {
        supertest    
            .post("/api/reservas")
            .send({
                "viaje": idViajeInsertado2,
                "plazas": 8
            })
            .set('Content-type', 'application/json')
            .set('Authorization','token '+tokenUsuario)
            .end((err,res) => {
                    res.status.should.equal(400);
                    res.body.message.should.equal("Número de plazas reservadas superior a disponibles");
                    idReservaInsertada=res.body._id;
                    done();
                });
        });

    it("[POST] Crear reserva - Código 403 sin",(done) => {
        supertest    
            .post("/api/reservas")
            .send({
                "viaje": idViajeInsertado2,
                "plazas": 1
            })
            .set('Content-type', 'application/json')
            .end((err,res) => {
                    res.status.should.equal(403);
                    res.body.message.should.equal("Tu petición no tiene cabecera de autorización");
                    done();
                });
    });
}); 

describe("/api/reservas/:id", () => {

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
                    idUsuarioInsertado2=res.body.id;
                }
                done();
            });
    });

    beforeEach( (done) => {
        supertest    
        .post("/api/reservas")
        .send({
            "viaje": idViajeInsertado2,
            "plazas": 1
        })
        .set('Content-type', 'application/json')
        .set('Authorization','token '+tokenUsuario2)
        .end((err,res) => {
                idReservaInsertada=res.body._id;
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
        Reserva.findByIdAndRemove((idReservaInsertada),function (err,resp){
        });
        done();
    });

    it("[GET] Consulta reserva por ID - Código 200 OK",(done) => {
        supertest
             .get("/api/reservas/"+idReservaInsertada)
             .end((err,res) => {
                  res.status.should.equal(200);
                  res.body.usuario.should.equal(idUsuarioInsertado2);
                  res.body.viaje.should.equal(idViajeInsertado2);
                  res.body.plazas.should.equal(1);
                  done();
              });
      });

   it("[GET] Consulta reserva por ID - Código 404 Reserva no existe",(done) => {
        supertest
             .get("/api/reservas/5000")
             .end((err,res) => {
                res.status.should.equal(404);
                res.body.message.should.equal("No existe la reserva con id 5000");
                done();
             });
      });

      it("[PUT] Modifica reserva por ID - Código 403 sin cabecera autorización",(done) => {
        supertest
             .put("/api/reservas/"+idReservaInsertada)
             .send({
                "viaje": idViajeInsertado2,
                "plazas": 4
             })
             .set('Content-type', 'application/json')
             .end((err,res) => {
                  res.status.should.equal(403);
                  res.body.message.should.equal("Tu petición no tiene cabecera de autorización");
                  done();
              });
      });

      it("[PUT] Modifica reserva por ID - Código 404 reserva no existe",(done) => {
        supertest
             .put("/api/reservas/5000")
             .send({
                "viaje": idViajeInsertado2,
                "plazas": 4
             })
             .set('Content-type', 'application/json')
             .set('Authorization','token '+tokenUsuario2)
             .end((err,res) => {
                  res.status.should.equal(404);
                  res.body.message.should.equal("No existe la reserva con id 5000");
                  done();
              });
      });

      it("[PUT] Modifica reserva por ID - Código 401 no está autorizado",(done) => {
        supertest
             .put("/api/reservas/"+idReservaInsertada)
             .send({
                "viaje": idViajeInsertado2,
                "plazas": 4
             })
             .set('Content-type', 'application/json')
             .set('Authorization','token '+tokenUsuario)
             .end((err,res) => {
                  res.status.should.equal(401);
                  res.body.message.should.equal("No estás autorizado para realizar este cambio");
                  done();
              });
      });

      it("[PUT] Modifica reserva por ID - Código 204 Cambio correcto",(done) => {
        supertest
             .put("/api/reservas/"+idReservaInsertada)
             .send({
                "viaje": idViajeInsertado2,
                "plazas": 1
             })
             .set('Content-type', 'application/json')
             .set('Authorization','token '+tokenUsuario2)
             .end((err,res) => {
                res.status.should.equal(204);
                done();
              });
      });

      it("[PUT] Modifica reserva por ID - Código 400 Nº plazas superior viaje",(done) => {
        supertest
             .put("/api/reservas/"+idReservaInsertada)
             .send({
                "viaje": idViajeInsertado2,
                "plazas": 6
             })
             .set('Content-type', 'application/json')
             .set('Authorization','token '+tokenUsuario2)
             .end((err,res) => {
                res.status.should.equal(400);
                done();
              });
      });

      it("[DELETE] Borrar reserva por ID - Código 403 sin cabecera autorización",(done) => {
        supertest
             .delete("/api/reservas/"+idReservaInsertada)
             .end((err,res) => {
                res.status.should.equal(403);
                res.body.message.should.equal("Tu petición no tiene cabecera de autorización");
                done();
              });
      });

      it("[DELETE] Borrar reserva por ID - Código 404 viaje no existe",(done) => {
        supertest
             .delete("/api/reservas/5000")
             .set('Authorization','token '+tokenUsuario2)
             .end((err,res) => {
                res.status.should.equal(404);
                res.body.message.should.equal("No existe la reserva con id 5000");
                done();
              });
      });

      it("[DELETE] Borrar reserva por ID - Código 401 no está autorizado",(done) => {
        supertest
             .delete("/api/reservas/"+idReservaInsertada)
             .set('Authorization','token '+tokenUsuario)
             .end((err,res) => {
                res.status.should.equal(401);
                res.body.message.should.equal("No estás autorizado para realizar este cambio");
                done();
              });
      });

      it("[DELETE] Borrar reserva por ID - Código 200 Cambio correcto",(done) => {
        supertest
             .delete("/api/reservas/"+idReservaInsertada)
             .set('Authorization','token '+tokenUsuario2)
             .expect(200)
             .end((err,res) => {
                res.status.should.equal(200);
                res.body.message.should.equal("Reserva borrada correctamente");
                done();;
              });
      });
});