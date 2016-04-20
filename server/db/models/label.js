'use strict';
const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: Number,
    color: {
    	type: String,
        default: 'EEEEEE'
    },
    url: {
        type: String
    },
    issues: [{type: mongoose.Schema.Types.ObjectId, ref: 'Issue'}]
});

labelSchema.plugin(require('mongoose-deep-populate')(mongoose));

mongoose.model('Label', labelSchema);
