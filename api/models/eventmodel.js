const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    event_name: {
        type: String,
        unique: true,
        required: true
    } ,
    event_details: {
        type: String,
    },
    date_of_event: {
        type: Date,
        required: true
    },
    last_date_of_submission: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema);