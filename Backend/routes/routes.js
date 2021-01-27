const express = require('express');
const swagger = require('swagger-ui-express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const yaml = require('js-yaml');
const fs = require('fs');

const queries = require('../db-queries');
const config = require('../config/config');
const GenericError = require('../models/genericError');
const mw = require('./middleware');

const apiSpec = yaml.safeLoad(fs.readFileSync('config/openapi.yaml', 'utf8'));

const router = express.Router();

// Register a new user
router.post('/users', mw.containsFullUser, mw.uniqueUsername, (req, res, next) => {
    // Read user info from the req body
    const {
        username, password, email,
    } = req.body;

    // Hash the password using bcrypt
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            next(err);
        } else {
            // Save the new user
            queries.newUser({
                username, password: hashedPassword, email,
            }).then(() => {
                res.sendStatus(204);
            });
        }
    });
});

// Login with a username and password combination
router.post('/auth', mw.containsLoginInfo, (req, res, next) => {
    // Read user info from the req body
    const { username, password } = req.body;
    // Generic error fron wrong username/password
    const mismatchErr = new GenericError('Username and password do not match',
        'Please provide a registered username and its password', 403);
    queries.getUserByUsername(username).then((foundUser, err) => {
        if (err || foundUser == null) {
            return next(mismatchErr);
        }
        bcrypt.compare(password, foundUser.password).then((match) => {
            if (!match) {
                return next(mismatchErr);
            }
            // All OK, generate  a new token with 15mins expiry
            const token = jwt.sign({
                u: foundUser.username,
                exp: Math.floor(Date.now() / 1000) + (60 * 15),
            }, config.jwtsecret);
            return res.status(200).json({ token, message: 'Enjoy your token!' });
        });
        return null;
    });
    return null;
});

// The path till here is already /api, paths should be written based on that
router.get('/', (req, res, next) => {
    // Test function, returns a generic response
    res.status(200).json({ title: 'hello' });
});

// The swagger documentation
router.use('/docs', swagger.serve);
router.get('/docs', swagger.setup(apiSpec));

// Ljubljana part

// GET all stations in Ljubljana
router.get('/lj/stations', (req, res, next) => {
    queries.lj.allStations().then((result) => {
        res.status(200).json(result);
    });
});

// GET details about a station via its ID
router.get('/lj/stations/:stID', (req, res, next) => {
    const { stID } = req.params;
    if (!/^\d{6}$/.test(stID)) {
        next(new GenericError('The station ID format is invalid',
            'A valid station ID contains 6 digits', 400));
    } else {
        queries.lj.stationByID(stID).then((result) => {
            res.status(200).json(result);
        });
    }
});

// GET all the buses in Ljubljana
router.get('/lj/buses', (req, res, next) => {
    queries.lj.allBuses().then((result) => {
        res.status(200).json(result);
    });
});

// GET details about a given bus
router.get('/lj/buses/:busID', (req, res, next) => {
    const { busID } = req.params;
    // Check if valid bus_id
    if (!/^\d{2}[A-Za-z]{0,2}_[A-Ž]$/.test(busID)) {
        next(new GenericError('The bus ID format is invalid',
            'Valid ID example: 18L_K or 03Ga_D', 400));
    } else {
        queries.lj.busByID(busID).then((result) => {
            res.status(200).json(result);
        });
    }
});

// GET information about when a bus arrives on a station
router.get('/lj/schedule', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { b, s } = req.query;
    // Check if station and bus are valid ids
    if (b == null) {
        next(new GenericError('Please provide a bus',
            "Include a 'b' query on the url", 400));
    } else if (s == null) {
        next(new GenericError('Please provide a station',
            "Include a 's' query on the url", 400));
    } else if (!/^\d{2}[A-Za-z]{0,2}_[A-Ž]$/.test(b)) {
        next(new GenericError('The bus ID format is invalid',
            "Valid ID example: '18L_K' or '03Ga_D'", 400));
    } else if (!/^\d{6}$/.test(s)) {
        next(new GenericError('The station ID format is invalid',
            'A valid station ID contains 6 digits', 400));
    } else {
        queries.lj.getArrival(b, parseInt(s, 10)).then((result) => {
            res.status(200).json(result);
        });
    }
});

module.exports = router;
