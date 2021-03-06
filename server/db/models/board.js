'use strict';
var mongoose = require('mongoose');

var laneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    active: Boolean,
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    }
});

mongoose.model('Lane', laneSchema);


var Lane = mongoose.model('Lane')

var boardSchema = new mongoose.Schema({
    name: String, //The name of the repo
    githubID: {
        type: Number,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    owner: {
        githubID: Number,
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

boardSchema.post('init', function(doc) {
    Lane.find({
            board: doc._id
        })
        .then(function(theLanes) {

            if (!theLanes.length) {
                var lanes = ['Backlog', 'Ready', 'Active', 'Done'];
                lanes.forEach(function(laneTitle) {
                    Lane.create({
                        title: laneTitle,
                        active: true,
                        board: doc._id
                    });
                })
            }

        })
})


mongoose.model('Board', boardSchema);
