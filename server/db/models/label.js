'use strict';
var mongoose = require('mongoose');

var labelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
    	type: String
    },
    url: {
        type: String
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    }
});

mongoose.model('Label', labelSchema);