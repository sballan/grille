'use strict';
var chalk = require('chalk');

// Requires in ./db/index.js -- which returns a promise that represents
// mongoose establishing a connection to a MongoDB database.
console.log('01')
var mongoose = require('mongoose');
console.log('02')
mongoose.Promise = require('bluebird');
console.log('03')

var startDb = require('./db');

var server = require('http').createServer();

var createApplication = function () {
    var app = require('./app');
    server.on('request', app);
    require('./io')(server);
};

var startServer = function () {

    var PORT = process.env.PORT || 1337;

    server.listen(PORT, function () {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });

};

startDb.then(createApplication).then(startServer).catch(function (err) {
    console.error(chalk.red(err.stack));
    process.kill(1);
});
