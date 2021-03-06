'use strict';
var path = require('path');
var mongoose = require('mongoose')
var express = require('express');
var app = express();
var Promise = require('bluebird')
var _ = require('lodash')


// var GitHubApi = Promise.promisifyAll(require("github"));
var GitHubApi = require('github')
var payloadParser = require('./github-data/parsers')
var Board = mongoose.model('Board')


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



})


app.use('/logout', function(req, res, next) {
	req.logout()
	res.redirect('/')
})


/*
 This middleware will catch any URLs resembling a file extension
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
		console.error(err, typeof next);
		res.status(err.status || 500).send(err.message || 'Internal server error.');
});

