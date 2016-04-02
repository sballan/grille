'use strict';
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  body: String,
  githubId: {
    type: Number,
    unique: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: Date,
  updated_at: Date,
  user: {}
});

commentSchema.plugin(require('mongoose-deep-populate')(mongoose));

mongoose.model('Comment', commentSchema);
