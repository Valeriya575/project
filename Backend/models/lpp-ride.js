const mongoose = require('mongoose');

// The model is based on data from Jan-Nov 2012, which was obtained as an assignment
// for a class held in Ljubljana (FRI, Business intelligence a.k.a. Core concepts of
// data mining, held by prof. dr. Blaž Zupan)
const lppRideSchema = new mongoose.Schema({
    registration: String, // the bus registration number, e.g. LJ - something something
    driverID: Number, // the driver id, e.g. 1
    route: String, // the bus line number, e.g. 14B
    routeDirection: String, // the direction of the bus, e.g. Savlje-Bokalce
    routeDescription: String, // common name for the route, e.g. Bokalce
    firstStation: String, // the first station of the route, e.g. Savlje
    lastStation: String, // the last station on the route, e.g. Bokalce
    departureTime: Date, // timestamp for the departure time from the first station
    arrivalTime: Date, // timestamp for the arrival time on the last station
}, {
    toJSON: {
        transform: (docs, ret) => {
            const obj = ret;
            obj.id = obj._id;
            delete obj._id;
            delete obj.__v;
            return obj;
        },
    },
});

// Create a model based on the schema
const LPPRide = mongoose.model('LPPRide', lppRideSchema, 'lpp_rides');

module.exports = LPPRide;
