// The exported object to which all other models will be assigned (for easier imports)
const models = {};

// Ljubljana
models.LPPRide = require('./lpp-ride');
models.LPPStation = require('./lpp-station');
models.LPPArrival = require('./lpp-arrival');
models.LPPBus = require('./lpp-bus');

// Generic
models.User = require('./user');
models.GenericError = require('./genericError');

module.exports = models;
