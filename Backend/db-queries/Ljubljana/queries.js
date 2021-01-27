const moment = require('moment');
const models = require('../../models');

// This module exports all GET based queries for the model LPPStation
module.exports = {
    // A simple get all method for demonstration purposes
    allStations: () => new Promise((callback) => {
        models.LPPStation.find({}, (err, res) => {
            if (err) {
                callback(err);
            }
            callback(res);
        });
    }),
    // Returns details about a station with the given ID
    stationByID: stationID => new Promise((callback) => {
        models.LPPStation.findById(stationID, (err, station) => {
            // TODO better error handling
            if (err) {
                callback(err);
            }
            callback(station);
        });
    }),

    // Buses
    // get all buses
    allBuses: () => new Promise((callback) => {
        models.LPPBus.find({}, (err, buses) => {
            if (err) {
                callback(err);
            }
            callback(buses);
        });
    }),
    // get a bus with the given id
    busByID: busID => new Promise((callback) => {
        models.LPPBus.findById(busID, (err, bus) => {
            if (err) {
                callback(err);
            }
            callback(bus);
        });
    }),

    // Arrivals (aka Schedule)
    // get times for when a bus arrives on a given station
    getArrival: (bus, station) => new Promise((callback) => {
        models.LPPArrival.find({
            bus,
            station,
        }).populate({
            path: 'bus station',
        }).exec((err, arrival) => {
            if (err) {
                callback(err);
            }
            callback(arrival);
        });
    }),


    // ! Use with caution !
    // populates some sample data into the database
    createSampleData: () => new Promise((callback) => {
        const result = {};
        // Create some stations
        const dm = new models.LPPStation({
            _id: 703112,
            stationName: 'Dolgi most',
            location: [14.4651607, 46.0367302],
        });
        const bd = new models.LPPStation({
            _id: 600012,
            stationName: 'Bavarski dvor',
            location: [14.5047956, 46.0551294],
        });
        const gs = new models.LPPStation({
            _id: 100022,
            stationName: 'Razstavišče',
            location: [14.5076542, 46.0611348],
        });
        const ss = [dm, bd, gs];
        ss.forEach((s) => {
            s.save((err) => {
                if (err) result.st_err = err;
            });
        });
        const bus18l = new models.LPPBus({
            _id: '18L',
            busDirection: 'Kolodvor',
        });
        // Create a bus that stops on one of the upper stations
        bus18l.save((err) => {
            if (err) result.bus_err = err;
        });
        // Create a schedule listing for the given bus
        const arrival1 = new models.LPPArrival({
            bus: bus18l,
            station: bd,
            arrivalTimes: [
                moment.utc('4:31', 'HH:mm'), moment.utc('4:56', 'HH:mm'), moment.utc('5:24', 'HH:mm'),
                moment.utc('5:47', 'HH:mm'), moment.utc('6:08', 'HH:mm'), moment.utc('6:21', 'HH:mm'),
                moment.utc('7:00', 'HH:mm'), moment.utc('7:05', 'HH:mm'), moment.utc('7:14', 'HH:mm'),
            ],
            dayType: 'Delavnik',
        });
        arrival1.save((err) => {
            if (err) result.arr_err = err;
        });

        callback(result);
    }),
};
