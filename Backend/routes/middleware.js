const jwt = require('jsonwebtoken');
const GenericError = require('../models/genericError');
const config = require('../config/config');
const models = require('../models');
const queries = require('../db-queries');

module.exports = {
    // checks if the request is authenticated
    isAuthorized: (req, res, next) => {
        // Check the request header for the access token
        const auth = req.get('Authorization');
        if (auth == null) { return next(new GenericError('Your token is missing', 'Provide a \'Bearer [token]\' in the Authorization header', 401)); }
        const token = auth.split(' ')[1];
        jwt.verify(token, config.jwtsecret, (err, decoded) => {
            if (err) return next(new GenericError(err.message, 'Please provide a valid token', 401));
            req.tokec = decoded;
            return next();
        });
        return null;
    },
    // Check if the body provided contains a valid station ID
    containsValidStation: async (req, res, next) => {
        // get the station parameter from the body
        const { station } = req.body;
        if (station == null) {
            return next(new GenericError('No station given', 'Please provide a valid station id in the request body', 400));
        }

        const found = await models.LPPStation.find({ _id: station }).limit(1);
        if (found != null) {
            return next();
        }
        return next(new GenericError('Station not found', 'The station with the given ID doesn\'t seem to exist', 400));
    },

    // check if all the fields for registration purposes are given
    containsFullUser: (req, res, next) => {
        const {
            username, password, email,
        } = req.body;

        // Check if the info was actually given
        if (username == null) {
            return next(new GenericError('Please provide a username to register',
                'Include a username field in the request body', 400));
        }
        if (password == null) {
            return next(new GenericError('Please provide a password for the user',
                'Include a password field in the request body', 400));
        } if (email == null) {
            return next(new GenericError('Please provide a email for the user',
                'Include an email field in the request body', 400));
        }
        return next();
    },

    // check if the given username already exists
    uniqueUsername: async (req, res, next) => {
        const { username } = req.body;
        const exists = await queries.getUserByUsername(username);
        if (exists) {
            return next(new GenericError('Username already exists',
                'Please choose a different username', 400));
        }
        return next();
    },

    // check if username and password have been sent in the request body
    containsLoginInfo: (req, res, next) => {
        // Read user info from the req body
        const { username, password } = req.body;
        // Check if the info was actually given
        if (username == null) {
            next(new GenericError('Please provide a username to register',
                'Include a userName field in the request body', 400));
        } else if (password == null) {
            next(new GenericError('Please provide a password for the user',
                'Include a password field in the request body', 400));
        } else {
            next();
        }
    },

    // check if the user has the station and that the staion is valid
    validURLStation: async (req, res, next) => {
        // read the data from url
        const { id } = req.params;
        if (!/^\d{6}$/.test(id)) {
            return next(new GenericError('The station ID format is invalid',
                'A valid station ID contains 6 digits', 400));
        }
        return next();
    },

    // check if there is at least something to update present in the body
    containsUserUpdate: (req, res, next) => {
        const {
            password, email, favouriteStations, favouriteBuses,
        } = req.body;

        if (!password && !email && !favouriteStations && !favouriteBuses) {
            return next(new GenericError('No update parameters', 'Please provide something to update on the user', 400));
        }

        if (favouriteStations) {
            if (!Array.isArray(favouriteStations)) {
                return next(new GenericError('Array expected', 'Favourite stations should be sent in an array', 400));
            }
            // Check if every station object has an id and name
            for (let i = 0; i < favouriteStations.length; i += 1) {
                const element = favouriteStations[i];
                if (!element.name && !element.id) {
                    return next(new GenericError('Invalid favourite station', 'A favourite station should contain an id and name field', 400));
                }
            }
        }

        if (favouriteBuses) {
            if (!Array.isArray(favouriteBuses)) {
                return next(new GenericError('Array expected', 'Favourite buses should be sent in an array', 400));
            }
            // Check if every bus object has an id and name
            for (let i = 0; i < favouriteBuses.length; i += 1) {
                const element = favouriteBuses[i];
                if (!element.name && !element.id) {
                    return next(new GenericError('Invalid favourite bus', 'A favourite bus should contain an id and name field', 400));
                }
            }
        }
        return next();
    },

    // check if the bus ID was sent via url and that it is valid
    validURLBus: async (req, res, next) => {
        // read the data from url
        const { id } = req.params;
        if (!/^\d{2}[A-Za-z]{0,2}_[A-Ž]$/.test(id)) {
            return next(new GenericError('The bus ID format is invalid',
                'Valid ID example: 18L_K or 03Ga_D or 14_B', 400));
        }
        return next();
    },
};
