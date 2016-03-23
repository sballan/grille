'use strict';
const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: Number,
    color: {
    	type: String
    },
    url: {
        type: String
    },
    repo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repo'
    }
});

mongoose.model('Label', labelSchema);
