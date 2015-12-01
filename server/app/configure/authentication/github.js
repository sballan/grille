'use strict';
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var github = require('github');

module.exports = function (app) {

    var githubConfig = app.getValue('env').GITHUB;

    var githubCredentials = {
        clientID: githubConfig.clientID,
        clientSecret: githubConfig.clientSecret,
        callbackURL: githubConfig.callbackURL
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {
        UserModel.findOne({ githubID: profile.id }).exec()
            .then(function (user) {

                if (user) {
                    if(user.accessToken === accessToken) return user;
                    else {
                        user.accessToken = accessToken
                        return user.save()
                    }
                } else {
                    return UserModel.create({
                        githubID: profile.id,
                        username: profile.username,
                        url: profile.profileUrl,
                        accessToken: accessToken,
                    });
                }

            }).then(function (userToLogin) {
                done(null, userToLogin);
            }, function (err) {
                console.error('Error creating user from github authentication', err);
                done(err);
            })

    };

    passport.use(new GithubStrategy(githubCredentials, verifyCallback));


    app.get('/auth/github', passport.authenticate('github', {scope: ['user', 'repo']}));

    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),
        function (req, res) {
            //Do Login/Signup Logic

            res.redirect('/userSettings');
        });

};
