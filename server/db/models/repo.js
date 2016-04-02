'use strict';
var mongoose = require('mongoose');


var repoSchema = new mongoose.Schema({
    name: String, //The name of the repo
    githubId: {
        type: Number,
        unique: true
    },
    active: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    collabs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    issues: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue'
    }],
    html_url: String,
    url: String, //---- API ----
    collaborators_url: String,
    teams_url: String,
    hooks_url: String
});

//repoSchema.post('init', function(doc) {
//    Lane.find({
//            repo: doc._id
//        })
//        .then(function(theLanes) {
//
//            if (!theLanes.length) {
//                var lanes = ['Backlog', 'Ready', 'Active', 'Done'];
//                lanes.forEach(function(laneTitle) {
//                    Lane.create({
//                        title: laneTitle,
//                        active: true,
//                        repo: doc._id
//                    });
//                })
//            }
//
//        })
//})

repoSchema.plugin(require('mongoose-deep-populate')(mongoose));

mongoose.model('Repo', repoSchema);
