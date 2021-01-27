const mongoose = require('mongoose');

// A bus arrival schema for a certain station (when a bus arrives on which station)
const arrivalSchema = new mongoose.Schema({
    bus: { type: mongoose.Schema.Types.String, ref: 'LPPBus' }, // the Bus (line + direction), e.g. 14B, Bokalce
    station: { type: mongoose.Schema.Types.Number, ref: 'LPPStation' }, // e.g. 600012 (a station with a location marker)
    arrivalTimes: [Date], // e.g. 15:19, 15:28, etc.
    dayType: String, // e.q. Delavnik, Sobota, Nedelja in prazniki
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
// TO-DO The travel schedule also includes time needed to get to other stations
// (in the bus direction)

const LPPArrival = mongoose.model('LPPArrival', arrivalSchema, 'lpp_arrivals');

// Export the LPPArrival model for use in other parts of the app
module.exports = LPPArrival;
