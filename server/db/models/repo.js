'use strict';
var mongoose = require('mongoose');
//
//var laneSchema = new mongoose.Schema({
//   title: {
//       type: String,
//       required: true
//   },
//   active: Boolean,
//   repo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Repo'
//   }
//});
//
//mongoose.model('Lane', laneSchema);
//
//
//var Lane = mongoose.model('Lane')

var repoSchema = new mongoose.Schema({
    name: String, //The name of the repo
    githubId: {
        type: Number,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    owner: {
        githubId: Number,
        url: String,
        username: String
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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


mongoose.model('Repo', repoSchema);
