//Incluimos los modelos
var Usuario = require('../models/usuario');
var Viaje = require('../models/viaje');

//Cargamos servicio
var service = require('../services/services');

//Incluimos librería propia para procesar paginación
var lib = require("../lib");

/**
 *  CRUD'S
 */

/**
 * GET ALL- Todos los registros almacenados
 */
exports.findAllViajes = function(pet, resp){
    //por defecto paginamos por 10 elementos
    var pagina = lib.procesarPaginacion(pet.query.page);
    Viaje.find().skip(pagina*10).limit(10).exec(function(error, viajes){
        if(error)
            resp.status(500).send({message: error.message});
        resp.status(200)
                .jsonp(viajes);
        resp.end();
    });  
};

/*
 * GET - Devuelve un objeto por su id
 */
exports.findByIdViaje = function(pet, resp){
    Viaje.findById(pet.params.id, function(error, viaje){
        if(error) 
            return resp.status(500).send({message: error.message});
        if(viaje){
            resp.status(200)
                    .jsonp(viaje);
            resp.end();
        }  
        else
            return resp.status(404)
                            .send({message: "No existe el viaje con id "+pet.params.id});
    });
};

/**
 * POST - Añade un nuevo registro
 */
exports.addViaje = function(pet, resp){
    var viaje = new Viaje({
        //valor de id sin importancia mongodb-autoincrement
        _id: 0, 
        usuario: pet.usuarioSesion,
        titulo: pet.body.titulo,
        descripcion: pet.body.descripcion,
        desdeCiudad: pet.body.desdeciudad,
        hastaCiudad: pet.body.hastaciudad,
        fecha: Date.parse(pet.body.fecha),
        plazas: pet.body.plazas,
        importe: pet.body.importe
    });

    Usuario.findById(pet.usuarioSesion, function(error, usuario) {
        if(usuario){
            viaje.save(function(error, viaje){
                if(error)
                    return resp.status(500).send({message: error.message});
                resp.status(201)
                          .jsonp(viaje);
                resp.end();
            });
        }
        else
            return resp.status(404)
                           .send({message: "Error de sesión, volver a intentar"});
    });
};

/**
 * PUT - Actualiza un registro
 */
exports.updateViaje = function(pet, resp){
    Viaje.findById(pet.params.id, function(error, viaje) {
        if(viaje){
            if (viaje.usuario==pet.usuarioSesion){
                for (var key in pet.body) {
                    if (pet.body.hasOwnProperty(key)) {
                        viaje[key] = pet.body[key];
                    }
                }
                viaje.save(function(error,viaje){
                    if(error)
                        return resp.status(500).send({message: error.message});  
                    resp.status(204)
                            .jsonp(viaje);
                        resp.end();
                });
            }
            else
                return resp.status(401)
                                .send({message: "No estás autorizado para realizar este cambio"});
        }
        else
            return resp.status(404)
                            .send({message: "No existe el viaje con id "+pet.params.id});
    });
};

/**
 * DELETE - Borra un registro
 */
exports.deleteViaje = function(pet, resp){
    Viaje.findById(pet.params.id, function(error, viaje){
        if(viaje){
            if (viaje.usuario==pet.usuarioSesion){
                viaje.remove(function(error){
                    if(error){
                        return resp.status(500)
                                        .send({message: error.message});
                    }
                    resp.status(200)
                            .send({message: "Viaje borrado correctamente"});
                });
            }
            else
            return resp.status(401)
                            .send({message: "No estás autorizado para realizar este cambio"});
        }
        else
            return resp.status(404)
                                .send({message: "No existe el viaje con id "+pet.params.id});
    });
};

/**
 *  FIN CRUD'S
 */

 /**
  *  MÉTODOS ADICIONALES
  */

  exports.findAllViajesUsuario = function(pet, resp) {
    
    Usuario.findById(pet.param.id, function(err, usuario) {
        
    	if(usuario){
            //por defecto paginamos por 10 elementos
            var pagina = lib.procesarPaginacion(pet.query.page);
            Viaje.find({usuario: usuario}).populate('usuario').skip(pagina*10).limit(10).exec(function(error, viajes) {
                if(error){
                    return resp.status(500)
                                    .send({message: error.message});
                }
                if(viajes){
                    resp.status(200)
                            .jsonp(viajes);
                }
                else
                    return resp.status(404).
                                    send("No existen viajes para el usuario "+usuario._id);

            });
        }
        else
        return resp.status(404)
                        .send({message: "No existe el usuario con id "+pet.params.id});
    });
  };
