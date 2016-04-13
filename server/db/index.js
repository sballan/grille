'use strict';
var Promise = require('bluebird');
var path = require('path');
var chalk = require('chalk');

console.log('04')
var mongoose = require('mongoose');

var DATABASE_URI = require(path.join(__dirname, '../env')).DATABASE_URI;
console.log('05')
var db = mongoose.connect(DATABASE_URI).connection;

require('./models');

console.log('06')
var startDbPromise = new Promise(function (resolve, reject) {
    db.on('open', resolve);
    db.on('error', reject);
});

console.log(chalk.yellow('Opening connection to MongoDB . . .'));
startDbPromise.then(function () {
    console.log(chalk.green('MongoDB connection opened!'));
});

module.exports = startDbPromise;
