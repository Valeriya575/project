const mongoose = require('mongoose');
var MbDepartures = require('../models/mb-departures');

//Schema for marprom bus lines 
const lineSchema = new mongoose.Schema({
    lineName: String, // e.g. Linija 1
	departures:[{ type: mongoose.Schema.ObjectId, ref: 'MbDepartures'}]
	
});

const MbLine = mongoose.model('MbLine', lineSchema, 'mb_lines');

// Export the MbLine model for use in other parts of the app
module.exports = MbLine;
