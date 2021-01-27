const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const queries = require('../db-queries');
const GenericError = require('../models/genericError');
const mw = require('./middleware');
const models = require('../models');

// Middleware to check for a valid JWT before proceeding
router.use(mw.isAuthorized);

router.get('/me', (req, res, next) => {
    // Get details about the provided user
    queries.getUserByUsername(req.tokec.u).then((user, err) => {
        if (err) return next(new GenericError('Oops', 'You have a valid token for a non-existent user', 401));
        return res.status(200).json(user);
    });
    return null;
});

// Update user (email, password, favouriteStations, favouriteBuses)
router.patch('/me', mw.containsUserUpdate, async (req, res, next) => {
    const {
        password, email, favouriteStations, favouriteBuses,
    } = req.body;

    // Only add the non null elements (middleware guarantees at least one)
    const updateModel = {};
    updateModel.$set = {};
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateModel.$set.password = hashedPassword;
    }
    if (email) {
        updateModel.$set.email = email;
    }
    if (favouriteStations) {
        updateModel.$push = {};
        updateModel.$push.favouriteStations = {};
        updateModel.$push.favouriteStations.$each = [];

        // If station is already favourited update the name,
        // otherwise add a new station
        const stations = await queries.getFavouriteStations(req.tokec.u);
        const favouriteIDs = stations.map(e => e.id);
        for (let i = 0; i < favouriteStations.length; i += 1) {
            const newID = favouriteStations[i].id;

            if (favouriteIDs.includes(newID)) {
                models.User.updateOne({ username: req.tokec.u, 'favouriteStations.id': newID },
                    {
                        $set: { 'favouriteStations.$.name': favouriteStations[i].name },
                    }).exec();
            } else {
                updateModel.$push.favouriteStations.$each.push(favouriteStations[i]);
            }
        }
        // If only existing favourites are being updated, remove the push
        if (updateModel.$push.favouriteStations.$each.length === 0) {
            delete updateModel.$push;
        }
    }

    if (favouriteBuses) {
        // Check if favouriteStations already has some push operations
        let createdPush = false;
        if (!updateModel.$push) {
            updateModel.$push = {};
            createdPush = true;
        }
        updateModel.$push.favouriteBuses = {};
        updateModel.$push.favouriteBuses.$each = [];

        // If station is already favourited update the name,
        // otherwise add a new station
        const buses = await queries.getFavouriteBuses(req.tokec.u);
        const favouriteIDs = buses.map(e => e.id);
        for (let i = 0; i < favouriteBuses.length; i += 1) {
            const newID = favouriteBuses[i].id;

            if (favouriteIDs.includes(newID)) {
                models.User.updateOne({ username: req.tokec.u, 'favouriteBuses.id': newID },
                    {
                        $set: { 'favouriteBuses.$.name': favouriteBuses[i].name },
                    }).exec();
            } else {
                updateModel.$push.favouriteBuses.$each.push(favouriteBuses[i]);
            }
        }
        // If only existing favourites are being updated, remove the push
        if (updateModel.$push.favouriteBuses.$each.length === 0) {
            // If you created the push, delete the whole thing, otherwise just buses
            // (keep station push)
            if (createdPush) {
                delete updateModel.$push;
            } else { delete updateModel.$push.favouriteBuses; }
        }
    }

    // Remove if we are only pushing to the favouriteStations
    if (Object.keys(updateModel.$set).length === 0 && updateModel.$set.constructor === Object) {
        delete updateModel.$set;
    }
    await models.User.updateOne({ username: req.tokec.u },
        updateModel,
        { new: true });
    res.sendStatus(204);
});

// Delete a favourite station (can only delete your own)
router.delete('/me/favourite/stations/:id', mw.validURLStation, async (req, res, next) => {
    const { id } = req.params;
    await models.User.updateOne({ username: req.tokec.u },
        {
            $pull: { favouriteStations: { id } },
        });
    res.sendStatus(204);
});

// Delete a favourite bus (can only delete your own)
router.delete('/me/favourite/buses/:id', mw.validURLBus, async (req, res, next) => {
    const { id } = req.params;
    await models.User.updateOne({ username: req.tokec.u },
        {
            $pull: { favouriteBuses: { id } },
        });
    res.sendStatus(204);
});

module.exports = router;
