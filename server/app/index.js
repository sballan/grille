'use strict';
var path = require('path');
var express = require('express');
var app = express();
var GitHubApi = require("github");
module.exports = app;

// Pass our express application pipeline into the configuration
// function located at server/app/configure/index.js
require('./configure')(app);

// Routes that will be accessed via AJAX should be prepended with
// /api so they are isolated from our GET /* wildcard.
app.use('/api', require('./routes'));

// Tester route for github auth
app.use('/test', function(req, res, next) {
	console.log('----REQ.USER',req.user)
		var github = new GitHubApi({ debug: true, version: "3.0.0" });

    console.log('user', req.user)

		github.authenticate({
        type: "oauth",
        token: req.user.accessToken
    });

		github.issues.createComment({
			user: 'sballan',
			repo: 'grille',
			number: 5,
			body: "YES MOTHERFUCKER"
		},
			function(err, data) {
				console.log("err", err, "res", data)
				res.send("<p>We Hit The Route</p>")
			}
		);

})

app.use('/getUser', function(req, res, next) {
		var repo = require('./github-data').repo
		res.send(repo.getUser())
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

