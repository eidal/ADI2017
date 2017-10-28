var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../conf/config');

exports.createToken = function(usuario) {
  var payload = {
    sub: usuario._id,
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};