//Incluimos el modelo
var Usuario = require('../models/usuario')


/**
 *  CRUD'S
 */

/**
 * GET ALL- Todos los registros almacenados
 */
exports.findAllUsuarios = function(pet, resp){
    Usuario.find(function(error, usuarios){
        if(error)
            resp.send(500, error.message);
        resp.status(200).jsonp(usuarios);
        resp.end();
    });  
};

/*
 * GET - Devuelve un objeto por su id
 */
exports.findByIdUsuario = function(pet, resp){
    Usuario.findById(pet.params.id, function(error, usuario){
        if(error) 
            return resp.send(500, error.message);
        if(usuario){
            resp.status(200).jsonp(usuario);
            resp.end();
        }  
        else
            return resp.send(404, 'No existe el usuario con id '+pet.params.id);
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
        edad: pet.body.edad
    });
    usuario.save(function(error, usuario){
        if(error)
            return resp.status(500).send(error.message);
        resp.status(201).jsonp(usuario);
        resp.end();
    });
};

/**
 * PUT - Actualiza un registro
 */
exports.updateUsuario = function(pet, resp){
    Usuario.findById(pet.params.id, function(error, usuario) {
        if(usuario){
            //bucle para no tener que indicar los valores
            for (var key in pet.body) {
                if (pet.body.hasOwnProperty(key)) {
                        usuario[key] = pet.body[key];
                }
            }
            usuario.save(function(error){
                if(error)
                    return resp.status(500).send(error.message);
                resp.status(204).jsonp(usuario);
                resp.end();
            });
        }
        else
            return resp.send(404, 'No existe el usuario con id '+pet.params.id);
    });
};

/**
 * DELETE - Borra un registro
 */
exports.deleteUsuario = function(pet, resp){
    Usuario.findById(pet.params.id, function(error, usuario){
        if(usuario){
            usuario.remove(function(error){
                if(error)
                    return resp.status(500).send(error.message);
                resp.status(200).send();
            });
        }
        else
            return resp.send(404, 'No existe el usuario con id '+pet.params.id);
    });
};

/**
 *  FIN CRUD'S
 */
