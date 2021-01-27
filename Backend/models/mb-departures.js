const mongoose = require('mongoose');
//var MbStation = require('../models/mb-station');

//Schema for marprom bus departures 
const departuresSchema = new mongoose.Schema({
    //line: { type: mongoose.Schema.ObjectId, ref: 'MbLine'},
	from: { type: mongoose.Schema.ObjectId, ref: 'MbStation'},
	to: { type: mongoose.Schema.ObjectId, ref: 'MbStation'},
	times:[String],
	days:String
	
});

const MbDepartures = mongoose.model('MbDepartures', departuresSchema, 'mb_departures');

// Export the MbDepartures model for use in other parts of the app
module.exports = MbDepartures;
