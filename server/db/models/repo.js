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
    labels: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Label'
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

repoSchema.methods.getAllLabels = function() {
  return this.deepPopulate('issues issue.labels')
  .then(function(repo) {
    return _.uniqBy(repo.issues.map(issue => _.flatten(issue.labels)), 'name color');
  })
}

repoSchema.plugin(require('mongoose-deep-populate')(mongoose));

mongoose.model('Repo', repoSchema);
