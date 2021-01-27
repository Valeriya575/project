const mongoose = require('mongoose');

// Basic station schema based on LPP travel times posted on each station
const stationSchema = new mongoose.Schema({
    _id: Number, // e.g. 600012
    stationName: String, // e.g. Bavarski dvor
    location: { type: [Number], index: { type: '2dsphere', sparse: true } },
}, {
    toJSON: {
        transform: (docs, ret) => {
            const obj = ret;
            obj.id = obj._id;
            delete obj._id;
            const lon = obj.location[0];
            const lat = obj.location[1];
            obj.location = {};
            obj.location.lon = lon;
            obj.location.lat = lat;
            delete obj.__v;
            return obj;
        },
    },
});

// TO-DO The travel schedule also includes time needed to get to other stations
// (in the bus direction)

const LPPStation = mongoose.model('LPPStation', stationSchema, 'lpp_stations');

// Export the LPPStation model for use in other parts of the app
module.exports = LPPStation;
