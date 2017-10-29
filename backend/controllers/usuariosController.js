//Incluimos el modelo
var Usuario = require('../models/usuario')

//Cargamos servicio
var service = require('../services/services');

/**
 *  CRUD'S
 */

/**
 * GET ALL- Todos los registros almacenados
 */
exports.findAllUsuarios = function(pet, resp){
    Usuario.find(function(error, usuarios){
        if(error)
            resp.status(500).send({message: error.message});
        resp.status(200)
                .jsonp(usuarios);
        resp.end();
    });  
};

/*
 * GET - Devuelve un objeto por su id
 */
exports.findByIdUsuario = function(pet, resp){
    Usuario.findById(pet.params.id, function(error, usuario){
        if(error) 
            return resp.status(500).send({message: error.message});
        if(usuario){
            resp.status(200)
                    .jsonp(usuario);
            resp.end();
        }  
        else
            return resp.status(404)
                            .send({message: "No existe el usuario con id "+pet.params.id});
    });
};

/**
 * POST - Añade un nuevo registro
 */
exports.addUsuario = function(pet, resp){
    var usuario = new Usuario({
        //valor de id sin importancia mongodb-autoincrement
        _id: 0, 
        nombre: pet.body.nombre,
        email: pet.body.email,
        contrasena: pet.body.contrasena,
        edad: pet.body.edad
    });

    //al hacer test me he dado cuenta que el login es por email, no se debe repetir
    Usuario.findOne({email: pet.body.email.toLowerCase()}, function(err, usuarioExiste) {
        if(usuarioExiste){
            return resp.status(400)
                            .send({message: "Email en uso, seleccione otro"});
        }
        else{
            usuario.save(function(error, usuario){
                if(error)
                    return resp.status(500).send({message: error.message});
                resp.status(201)
                        .send({token: service.createToken(usuario), id: usuario._id});
                resp.end();
            });
        }
    });
};

/**
 * PUT - Actualiza un registro
 */
exports.updateUsuario = function(pet, resp){
    Usuario.findById(pet.params.id, function(error, usuario) {
        if(usuario){
            if (usuario.id==pet.usuarioSesion){
                for (var key in pet.body) {
                    if (pet.body.hasOwnProperty(key)) {
                        usuario[key] = pet.body[key];
                    }
                }
                usuario.save(function(error,usuario){
                    if(error)
                        return resp.status(500).send({message: error.message});  
                    resp.status(204)
                            .jsonp(usuario);
                        resp.end();
                });
            }
            else
                return resp.status(401)
                                .send({message: "No estás autorizado para realizar este cambio"});
        }
        else
            return resp.status(404).
                            send({message: "No existe el usuario con id "+pet.params.id});
    });
};

/**
 * DELETE - Borra un registro
 */
exports.deleteUsuario = function(pet, resp){
    Usuario.findById(pet.params.id, function(error, usuario){
        if(usuario){
            if (usuario.id==pet.usuarioSesion){
                usuario.remove(function(error){
                    if(error){
                        return resp.status(500)
                                        .send({message: error.message});
                    }
                    resp.status(200)
                            .send({message: "Usuario borrado correctamente"});
                });
            }
            else
            return resp.status(401)
                            .send({message: "No estás autorizado para realizar este cambio"});
        }
        else
            return resp.status(404)
                                .send({message: "No existe el usuario con id "+pet.params.id});
    });
};

/**
 *  FIN CRUD'S
 */

 /**
  *  MÉTODOS ADICIONALES
  */

  exports.emailLogin = function(pet, resp) {
	Usuario.findOne({email: pet.body.email.toLowerCase()}, function(err, usuario) {
    	if(usuario){
            if(usuario.contrasena.localeCompare(pet.body.contrasena)==0){
                return resp
                    .status(200)
                        .send({token: service.createToken(usuario)});
            }
            else
                return resp.status(401)
                                .send({message: "Credenciales incorrectas pruebe de nuevo"});
        }
        else
        return resp.status(404)
                        .send({message: "No existe el usuario con ese email"});
    });
  };
