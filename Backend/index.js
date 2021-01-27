const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const chalk = require('chalk');
const cors = require('cors');
const routes = require('./routes/routes.js');
const protectedRoutes = require('./routes/protected-routes');
// TODO Enable HTTP/2

const app = express();

// Use morgan to log based on dev / prod ENV
if (app.get('env') === 'development') app.use(morgan('dev'));
else app.use(morgan('common'));

// Our app will consume and produce JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Enable CORS (TODO options)
app.use(cors());
// Add the API routes
app.use('/api/v1', routes); // Buses, stations, schedule
app.use('/api/v1/users', protectedRoutes); // User info (register, auth, etc.)

// Test the connection to the database
mongoose.connect('mongodb://localhost/buslines', { useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, chalk.red('connection error :(')));
db.once('open', () => {
    // we're connected!
    console.log(chalk.greenBright('Connected'), 'to the buslines db', chalk.yellowBright(':)'));
});

// Dev error handler, will print a stacktrace
if (app.get('env') === 'development') {
    console.info(chalk.keyword('orange')('Using the development env, are you a developer?'));
    console.log('');
    app.use(morgan('dev'));
    app.use((err, req, res, next) => {
        if (res.headersSent) {
            next(err);
        } else {
            res.status(err.status || 500).json({
                error: err.message,
                description: err.description,
                stack: err.stack,
            });
        }
    });
} else {
    // Production error handler, shouldn't leak
    // stacktraces to the user
    app.use((err, req, res, next) => {
        if (res.headersSent) {
            next(err);
        } else {
            res.status(err.status || 500).json({
                error: err.message,
                description: err.description,
            });
        }
    });
}

module.exports = app;
