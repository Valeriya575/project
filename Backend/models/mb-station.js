const mongoose = require('mongoose');

// Basic station schema
const stationSchema = new mongoose.Schema({
    stationName: String, // e.g. Bavarski dvor
    location: { type: [Number], index: { type: '2dsphere', sparse: true } }
});

const MbStation = mongoose.model('MbStation', stationSchema, 'mb_stations');

// Export the MbStations model for use in other parts of the app
module.exports = MbStation;
