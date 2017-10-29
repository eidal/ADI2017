var should = require("should");
var expect = require("expect");
var app = require("../app");
var supertest = require("supertest")(app);
var mongoose = require("mongoose");
var Usuario = require("../models/usuario")

//Variables auxiliares para guardar id y token usuario a testear
var idUsuarioInsertado = 9999;
var tokenUsuario=""
//Necesito un segundo token correcto para una de las pruebas
var tokenUsuario2=""
//Vacío usuarios
before (() => {
    Usuario.remove().exec();
});

//Antes de cada test creo y asigno valor id y token usuario
beforeEach( (done) => {
    supertest
    .post("/api/usuarios")
    .send({
        "nombre": "Usuario test 2",
        "email": "usuariotest1@gmail.com",
        "contrasena": "123456",
        "edad": '36'
    })
    .set('Content-type', 'application/json')
    .end((err,res) => {
        if(err){
            idUsuarioInsertado=-3;
        }
        else{
            tokenUsuario=res.body.token;
            idUsuarioInsertado=res.body.id;
        }
        done();
        });
});

afterEach((done) => {
    Usuario.findOneAndRemove({email: "usuariotest1@gmail.com".toLowerCase()}, function(err, usuarioExiste){
    });
    done();
});

describe("/api/usuarios", () => {
  
    it("[POST] Crear usuario - Código 201 OK",(done) => {
        supertest
            .post("/api/usuarios")
            .send({
                "nombre": "Usuario test 2",
                "email": "usuariotest2@gmail.com",
                "contrasena": "123456",
                "edad": '36'
            })
            .set('Content-type', 'application/json')
            .end((err,res) => {
                res.status.should.equal(201);
                res.body.token.should.not.equal("");
                done();
            });
    });

    it("[POST] Crear usuario email existente - Código 400 Email en uso",(done) => {
        supertest
            .post("/api/usuarios")
            .send({
                "nombre": "Usuario test 2",
                "email": "usuariotest2@gmail.com",
                "contrasena": "123456",
                "edad": '42'
            })
            .set('Content-type', 'application/json')
            .end((err,res) => {
                res.status.should.equal(400);
                res.body.message.should.equal("Email en uso, seleccione otro");
                done();
            });
            
    });

    it("[GET] Lista de todos los usuarios - Código 200 OK",(done) => {
        supertest
            .get("/api/usuarios")
            .end((err,res) => {
                res.status.should.equal(200);
                res.body.length.should.equal(2);
            done();
            });
    });
});

describe("/api/usuarios/login",() => {
        
    it("[POST] Login usuario - Código 200 OK",(done) => {
        supertest
            .post("/api/usuarios/login")
            .send({
                  "email": "usuariotest1@gmail.com",
                  "contrasena": "123456"
            })
            .set('Content-type', 'application/json')
            .end((err,res) => {
               res.status.should.equal(200);
               res.body.token.should.not.equal("");
                done();
            });
    });

    it("[POST] Login usuario - Código 401 Credenciales incorrectas",(done) => {
        supertest
            .post("/api/usuarios/login")
            .send({
                  "email": "usuariotest1@gmail.com",
                  "contrasena": "1234567"
            })
            .set('Content-type', 'application/json')
            .end((err,res) => {
                res.status.should.equal(401);
                res.body.message.should.equal("Credenciales incorrectas pruebe de nuevo");
                done();
            });
    });

    it("[POST] Login usuario - Código 404 No existe el usuario",(done) => {
        supertest
            .post("/api/usuarios/login")
            .send({
                  "email": "usuariotest3@gmail.com",
                  "contrasena": "123456"
            })
            .set('Content-type', 'application/json')
            .end((err,res) => {
                res.status.should.equal(404);
                res.body.message.should.equal("No existe el usuario con ese email");
                done();
            });
            
    });
});

describe("/api/usuarios/:id", () => {

    before( (done) => {
        supertest
       .post("/api/usuarios")
       .send({
           "nombre": "Usuario test 3",
           "email": "usuariotest4@gmail.com",
           "contrasena": "123456",
           "edad": '36'
       })
       .set('Content-type', 'application/json')
       .end((err,res) => {
           if(err){
               tokenUsuario2="";
           }
           else{
               tokenUsuario2=res.body.token;
           }
           done();
           });
   });

    it("[GET] Consulta usuario por ID - Código 200 OK",(done) => {
        supertest
             .get("/api/usuarios/"+idUsuarioInsertado)
             .end((err,res) => {
                  res.status.should.equal(200);
                  res.body.nombre.should.equal("Usuario test 2");
                  res.body.email.should.equal("usuariotest1@gmail.com");
                  res.body.contrasena.should.equal("123456");
                  res.body.edad.should.equal(36);
                  done();
              });
      });

      it("[GET] Consulta usuario por ID - Código 404 Usuario no existe",(done) => {
        supertest
             .get("/api/usuarios/5000")
             .end((err,res) => {
                res.status.should.equal(404);
                res.body.message.should.equal("No existe el usuario con id 5000");
                done();
             });
      });

      it("[PUT] Modifica usuario por ID - Código 403 sin cabecera autorización",(done) => {
        supertest
             .put("/api/usuarios/"+idUsuarioInsertado)
             .send({
                "nombre": "Usuario test 3",
                "email": "usuariotest4@gmail.com",
                "contrasena": "123456",
                "edad": '36'
             })
             .set('Content-type', 'application/json')
             .end((err,res) => {
                  res.status.should.equal(403);
                  res.body.message.should.equal("Tu petición no tiene cabecera de autorización");
                  done();
              });
      });

      it("[PUT] Modifica usuario por ID - Código 404 usuario no existe",(done) => {
        supertest
             .put("/api/usuarios/5000")
             .send({
                "nombre": "Usuario test 3",
                "email": "usuariotest4@gmail.com",
                "contrasena": "123456",
                "edad": '36'
             })
             .set('Content-type', 'application/json')
             .set('Authorization','token '+tokenUsuario)
             .end((err,res) => {
                  res.status.should.equal(404);
                  res.body.message.should.equal("No existe el usuario con id 5000");
                  done();
              });
      });

      it("[PUT] Modifica usuario por ID - Código 401 no está autorizado",(done) => {
        supertest
             .put("/api/usuarios/"+idUsuarioInsertado)
             .send({
                "nombre": "Usuario test 3",
                "email": "usuariotest4@gmail.com",
                "contrasena": "123456",
                "edad": '36'
             })
             .set('Content-type', 'application/json')
             .set('Authorization','token '+tokenUsuario2)
             .end((err,res) => {
                  res.status.should.equal(401);
                  res.body.message.should.equal("No estás autorizado para realizar este cambio");
                  done();
              });
      });

      it("[PUT] Modifica usuario por ID - Código 204 Cambio correcto",(done) => {
        supertest
             .put("/api/usuarios/"+idUsuarioInsertado)
             .send({
                "nombre": "Usuario test 3",
                "email": "usuariotest4@gmail.com",
                "contrasena": "123456",
                "edad": '36'
             })
             .set('Content-type', 'application/json')
             .set('Authorization','token '+tokenUsuario)
             .end((err,res) => {
                res.status.should.equal(204);
                done();
              });
      });

      it("[DELETE] Borrar usuario por ID - Código 403 sin cabecera autorización",(done) => {
        supertest
             .delete("/api/usuarios/"+idUsuarioInsertado)
             .end((err,res) => {
                res.status.should.equal(403);
                res.body.message.should.equal("Tu petición no tiene cabecera de autorización");
                done();
              });
      });

      it("[DELETE] Borrar usuario por ID - Código 404 usuario no existe",(done) => {
        supertest
             .delete("/api/usuarios/5000")
             .set('Authorization','token '+tokenUsuario)
             .end((err,res) => {
                res.status.should.equal(404);
                res.body.message.should.equal("No existe el usuario con id 5000");
                done();
              });
      });

      it("[DELETE] Borrar usuario por ID - Código 401 no está autorizado",(done) => {
        supertest
             .delete("/api/usuarios/"+idUsuarioInsertado)
             .set('Authorization','token '+tokenUsuario2)
             .end((err,res) => {
                res.status.should.equal(401);
                res.body.message.should.equal("No estás autorizado para realizar este cambio");
                done();
              });
      });

      it("[DELETE] Borrar usuario por ID - Código 200 Cambio correcto",(done) => {
        supertest
             .delete("/api/usuarios/"+idUsuarioInsertado)
             .set('Authorization','token '+tokenUsuario)
             .expect(200)
             .end((err,res) => {
                res.status.should.equal(200);
                res.body.message.should.equal("Usuario borrado correctamente");
                done();;
              });
      });

});