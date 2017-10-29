//Incluimos los modelos
var Usuario = require('../models/usuario');
var Viaje = require('../models/viaje');
var Reserva = require('../models/reserva');
//Cargamos servicio
var service = require('../services/services');

/**
 *  CRUD'S
 */


/*
 * GET - Devuelve un objeto por su id
 */
exports.findByIdReserva = function(pet, resp){
    Reserva.findById(pet.params.id, function(error, reserva){
        if(error) 
            return resp.status(500).send({message: error.message});
        if(reserva){
            resp.status(200)
                    .jsonp(reserva);
            resp.end();
        }  
        else
            return resp.status(404)
                            .send({message: "No existe la reserva con id "+pet.params.id});
    });
};

/**
 * POST - Añade un nuevo registro
 */
exports.addReserva = function(pet, resp){
    var reserva = new Reserva({
        //valor de id sin importancia mongodb-autoincrement
        _id: 0, 
        usuario: pet.usuarioSesion,
        viaje: pet.body.viaje,
        plazas: pet.body.plazas
    });

    Usuario.findById(pet.usuarioSesion, function(error, usuario) {
        if(usuario){
            Viaje.findById(pet.body.viaje,function(err,viaje){
                if(viaje){
                    if(viaje.plazas>=pet.body.plazas){
                        reserva.save(function(error, reserva){
                            if(error)
                                return resp.status(500).send({message: error.message});
                            resp.status(201)
                                      .jsonp(reserva);
                            resp.end();
                        });
                    }
                    else
                        return resp.status(400)
                                        .send({message: "Número de plazas reservadas superior a disponibles"});
                }
                else
                    return resp.status(404)
                                    .send({message: "El viaje al que intenta reservar ya no existe"});
            })
            
        }
        else
            return resp.status(404)
                           .send({message: "Error de sesión, volver a intentar"});
    });
};

/**
 * PUT - Actualiza un registro
 */
exports.updateReserva = function(pet, resp){
    Reserva.findById(pet.params.id, function(error, reserva) {
        if(reserva){
            if (reserva.usuario==pet.usuarioSesion){
                if(reserva.viaje==pet.body.viaje){
                    for (var key in pet.body) {
                        if (pet.body.hasOwnProperty(key)) {
                            reserva[key] = pet.body[key];
                        }
                    }
                    reserva.save(function(error,reserva){
                        if(error)
                            return resp.status(500).send({message: error.message});  
                        resp.status(204)
                            .jsonp(reserva);
                        resp.end();
                    });
                }
                else
                    return resp.status(400)
                                    .send({message: "No se puede cambiar el viaje de la reserva"});
            }
            else
                return resp.status(401)
                                .send({message: "No estás autorizado para realizar este cambio"});
        }
        else
            return resp.status(404)
                            .send({message: "No existe la reserva con id "+pet.params.id});
    });
};

/**
 * DELETE - Borra un registro
 */
exports.deleteViaje = function(pet, resp){
    Reserva.findById(pet.params.id, function(error, reserva){
        if(reserva){
            if (reserva.usuario==pet.usuarioSesion){
                reserva.remove(function(error){
                    if(error){
                        return resp.status(500)
                                        .send({message: error.message});
                    }
                    resp.status(200)
                            .send({message: "Reserva borrrada correctamente"});
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

exports.findAllReservasUsuario = function(pet, resp){
    Usuario.findById(pet.params.usuario, function(error, usuario) {
            if(usuario){
                Reserva.find({'usuario': usuario}).populate('usuario').populate('viaje').exec(function(error, reservas){
                    if(reservas){
                        resp.status(200)
                                .jsonp(reservas);
                        resp.end();
                    }
                    else
                        return resp.status(404).
                                        send({message: "No existen reservas con id usuario "+usuario._id});
                });
            }
            else
                return resp.status(404).
                                send({message: "No existe el usuario con id "+pet.params.usuario});
    });
};

exports.findAllReservasViaje = function(pet, resp){
        Viaje.findById(pet.params.viaje, function(error, viaje) {
            if(viaje){
                Reserva.find({'viaje': viaje}).populate('usuario').populate('viaje').exec(function(error, reservas){
                    if(reservas){
                        resp.status(200)
                                .jsonp(reservas);
                        resp.end();
                    }
                    else
                        return resp.status(404).
                                        send({message: "No existen reservas con id viaje "+viaje._id});
                });
            }
            else
                return resp.status(404)
                                .send({message: "No existe el viaje con id "+pet.params.viaje});
        });
};

