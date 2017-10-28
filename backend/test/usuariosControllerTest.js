var should = require("should");
var expect = require("expect");
var app = require("../app");
var supertest = require("supertest")(app);
var mongoose = require("mongoose");
var Usuario = require("../models/usuario")
var UsuarioController = require("../controllers/usuariosController");
after (() => {
    Usuario.findOneAndRemove({email: "usuariotest1@gmail.com"}, function(err, usuario) {
    });
});

describe("/api/usuarios", () => {
  
    it("[POST] Crear usuario - Código 201 OK",(done) => {
        supertest
            .post("/api/usuarios")
            .send({
                "nombre": "Usuario test 1",
                "email": "usuariotest1@gmail.com",
                "contrasena": "123456",
                "edad": '36'
            })
            .set('Content-type', 'application/json')
            .expect(201)
            .end((err,res) => {
                res.body.token.should.not.equal("");
                done();
            });
    });

    it("[POST] Crear usuario email existente - Código 400 Email en uso",(done) => {
        supertest
            .post("/api/usuarios")
            .send({
                "nombre": "Usuario test 2",
                "email": "usuariotest1@gmail.com",
                "contrasena": "123456",
                "edad": '42'
            })
            .set('Content-type', 'application/json')
            .expect(400)
            .end(done);
            
    });

    it("[GET] Lista de todos los usuarios - Código 200 OK",(done) => {
        supertest
            .get("/api/usuarios")
            .expect(200)
            .end((err,res) => {
                res.body.length.should.equal(1);
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
            .expect(200)
            .end((err,res) => {
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
            .expect(401)
            .end(done);
            
    });

    it("[POST] Login usuario - Código 404 No existe el usuario",(done) => {
        supertest
            .post("/api/usuarios/login")
            .send({
                  "email": "usuariotest2@gmail.com",
                  "contrasena": "123456"
            })
            .set('Content-type', 'application/json')
            .expect(404)
            .end(done);
            
    });
});

describe("/api/usuarios/:id", () => {
    var idUsuarioInsertado = 0;
    var tokenUsuario="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjY2LCJpYXQiOjE1MDkyMjUyODIsImV4cCI6MTUxMDQzODQ4Mn0.hZddiJ6Y9JSiE1F6uwoUffYwqHEv_d_kclI7R-WHiaY";
    
    beforeEach ((done) => {
        idUsuarioInsertado=UsuarioController.findByEmailUsuario("usuariotest1@gmail.com");
        done();
    });

    it("[GET] Consulta usuario por ID - Código 200 OK"+idUsuarioInsertado,(done) => {
        supertest
             .get("/api/usuarios/"+idUsuarioInsertado)
             .expect(200)
             .end((err,res) => {
                  res.body.nombre.should.equal("Usuario test 1");
                  res.body.email.should.equal("usuariotest1@gmail.com");
                  res.body.contrasena.should.equal("123456");
                  res.body.edad.should.equal(36);
                  done();
              });
      });

      it("[GET] Consulta usuario por ID - Código 401 Usuario no existe",(done) => {
        supertest
             .get("/api/usuarios/50000")
             .expect(404)
             .end(done);
      });
});