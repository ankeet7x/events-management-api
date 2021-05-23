const mongoose = require("mongoose");

const registrationSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    registrated_event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    registration_date: {
        type: Date,
        required: true,
    },
    person_registered: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

module.exports = mongoose.model("Registration", registrationSchema);