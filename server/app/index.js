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

  github.repos.getAll({}, function(err, data) {
  	if(err) console.error(err)

		var parsedData = data.map(function(repo) {
			return payloadParser.repo(repo)
		})


		var promises = parsedData.map(function(repo) {
			return Board.find({githubID: repo.githubID})
		})
		console.log("-----Parsed Data", parsedData)


		Promise.all(promises)
		.then(function(boards) {
			var updates = boards.map(function(board, index) {
				return Board.update({githubID: board.githubID}, parsedData[index], {upsert: true})
				// _.extend(board, parsedData[index])
				// return board.save()
			})
			return Promise.all(updates)
		})
		.then(function(processed) {
			console.log(processed)
		})

	})
  next()

	// github.issues.createComment({
	// 	user: 'sballan',
	// 	repo: 'grille',
	// 	number: 5,
	// 	body: "YES MOTHERFUCKER"
	// },
	// 	function(err, data) {
	// 		console.log("err", err, "res", data)
	// 		res.send("<p>We Hit The Route</p>")
	// 	}
	// );

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

