const mongoose = require('mongoose');

// A simple user model
const userSchema = new mongoose.Schema({
    username: String, // the username for the user (should be UNIQUE)
    password: String, // password for the user (should be hashed)
    email: String,
    favouriteStations: [
        {
            id: { type: mongoose.Schema.Types.Number, ref: 'LPPStation' }, // Station ID
            name: String, // Generic name the user gives the station
        },
    ],
    favouriteBuses: [
        {
            id: { type: mongoose.Schema.Types.String, ref: 'LPPBus' }, // BUS ID
            name: String, // Generic name the user gives the bus
        },
    ],
}, {
    toJSON: {
        transform: (docs, ret) => {
            const obj = ret;
            delete obj.password;
            obj.id = obj._id;
            for (let i = 0; i < obj.favouriteStations.length; i += 1) {
                delete obj.favouriteStations[i]._id;
            }
            for (let i = 0; i < obj.favouriteBuses.length; i += 1) {
                delete obj.favouriteBuses[i]._id;
            }
            delete obj._id;
            delete obj.__v;
            return obj;
        },
    },
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
