const mongoose = require('mongoose');

// Basic bus schema for LPP buses
const busSchema = new mongoose.Schema({
    _id: String, // e.g. 14B_B, the bus line with the first letter of direction
    busLine: String, // e.g. 14B
    busDirection: String, // e.g. Bokalce
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

const LPPBus = mongoose.model('LPPBus', busSchema, 'lpp_buses');

// Export the LPPBus model for use in other parts of the app
module.exports = LPPBus;
