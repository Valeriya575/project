const lj = require('./Ljubljana/queries');
const models = require('../models');

const q = {};

// All the queries for the Ljubljana subdirectory
q.lj = lj;

// Generic queries
q.newUser = u => new Promise((callback) => {
    const newUser = models.User(u);
    newUser.save((err) => {
        if (err) {
            callback(err);
        }
        callback('Success!');
    });
});

q.getUserByUsername = un => new Promise((callback) => {
    models.User.findOne({ username: un }, (err, user) => {
        if (err) {
            callback(null, err);
        }
        callback(user, null);
    });
});

q.getFavouriteStations = un => new Promise((callback) => {
    models.User.findOne({ username: un }, (err, user) => {
        if (err) {
            callback(null, err);
        }
        callback(user.toJSON().favouriteStations, null);
    });
});

q.getFavouriteBuses = un => new Promise((callback) => {
    models.User.findOne({ username: un }, (err, user) => {
        if (err) {
            callback(null, err);
        }
        callback(user.toJSON().favouriteBuses, null);
    });
});

module.exports = q;
