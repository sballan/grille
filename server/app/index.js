'use strict';
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Promise = require('bluebird');
const _ = require('lodash');
const chalk = require('chalk');



// var GitHubApi = Promise.promisifyAll(require("github"));
const GitHubApi = require('github')

module.exports = app;

// Pass our express application pipeline into the configuration
// function located at server/app/configure/index.js
require('./configure')(app);

// Routes that will be accessed via AJAX should be prepended with
// /api so they are isolated from our GET /* wildcard.
app.use('/api', require('./routes'));

// Tester route for github auth
app.use('/test', function(req, res, next) {
	var github = new GitHubApi({ debug: true, version: "3.0.0" } );

	github.authenticate({
      type: "oauth",
      token: req.user.accessToken
  });
  next()

});

app.use('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/')
});

/*
 This modules will catch any URLs resembling a file extension
 for example: .js, .html, .css
 This allows for proper 404s instead of the wildcard '/*' catching
 URLs that bypass express.static because the given file does not exist.
 */
app.use(function (req, res, next) {

		if (path.extname(req.path).length > 0) {
				res.status(404).end();
		} else {
				next(null);
		}

});

app.get('/*', function (req, res) {
		res.sendFile(app.get('indexHTMLPath'));
});

// Error catching endware.
app.use(function (err, req, res, next) {
		console.error(chalk.magenta(err), `, Next is of type: ${typeof next}`);
		res.status(err.status || 500).send(err.message || 'Internal server error.');
});
