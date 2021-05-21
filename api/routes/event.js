const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkAuth = require('../middleware/authCheck');
const Event = require('../models/eventmodel');

router.post('/postevent', checkAuth, (req, res, next) => {
    Event.findOne({event_name: req.body.event_name}).exec().then((thisEvent) => {
        if (thisEvent != null ){
            res.status(500).json({
                message: "SuchEventAlreadyExist",
            });
        }else{
            const eventData = Event({
                _id: mongoose.Types.ObjectId(),
                posted_by: req.body.posted_by,
                event_name: req.body.event_name,
                event_details: req.body.event_details,
                date_of_event: req.body.date_of_event,
                last_date_of_submission: req.body.last_date_of_submission
            });
            eventData.save().then((eventData) => {
                res.status(200).json({
                    message: "SavedEvent",
                    event: eventData
                });
            }).catch(err => {
                res.status(500).json({
                    message: "ErrorCreatingEvent",
                    error: err.message
                });
            });
        }
    }).catch((err) =>{
        res.status(500).json({
            message: "ErrorNow",
            error: err.message
        })
    })

});


module.exports = router;