'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
var _ = require('lodash');

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
    columnColor: {
      type: String,
      default: 'EEEEEE'
    },
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

repoSchema.methods.getAllLabels = function() {
  return Promise.map(this.issues, issue => issue.deepPopulate('labels'))
  .then(function(issues) {
    return _.uniqBy(issues.map(issue => _.flatten(issue.labels)), 'name color');
  })
}

repoSchema.plugin(require('mongoose-deep-populate')(mongoose));

mongoose.model('Repo', repoSchema);
