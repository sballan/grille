'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true
    },
    accessToken:{
        type:String,
        unique:true
    },
    githubID: {
        type: String,
        require: true,
        unique: true
    },

    email: {
        type: String
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },

    url: String,
    html_url: String,
    organizations_url: String,
    repos_url: String

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

schema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

schema.virtual('githubAccess').get(function(){
     var github = new GitHubApi({
        debug: true,
        version: "3.0.0"
    } );

    github.authenticate({
        type: "oauth",
        token: this.user.accessToken
    });
    return github;
})

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', schema);