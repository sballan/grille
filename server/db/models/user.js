'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var GitHubApi = require('github')

var schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    githubId: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String
    },
    accessToken:{
        type:String,
        select: false
    },
    salt: {
        type: String
    },

    url: String,
    html_url: String,
    organizations_url: String,
    repos_url: String,
    avatar_url: String

});

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};


//OP: yay! does this work?
schema.virtual('githubAccess').get(function(){
    var self = this;
     var github = new GitHubApi({
        debug: true,
        version: "3.0.0"
    } );

    github.authenticate({
        type: "oauth",
        token: self.accessToken
    });
    return github;
});



schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

schema.plugin(require('mongoose-deep-populate')(mongoose));

mongoose.model('User', schema);
