const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkAuth = require('../middleware/authCheck');
const Event = require('../models/eventmodel');
const cloudinary = require('cloudinary').v2;
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './uploads/');
    },
    filename: function(req, file, callback){
        callback(null, new Date().toISOString() + file.originalname);
    }
});
const upload = multer({storage: storage});

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME_CLOUDINARY,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});


router.post('/', checkAuth, upload.single("event_image") ,(req, res, next) => {
    cloudinary.uploader.upload(req.file.path, (err, result) => {
        if(err){
            res.status(500).json({
				message: 'errorInUploading',
				error: err
			});
        }else{
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
                        event_file: result.url,
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
        }
    })
    

});


router.get('/', checkAuth, (req, res, next) => {
    Event.find().exec().then((events) => {
        res.status(200).json({
            message: "EventsFetched",
            events: events
        });
    }).catch((err) => {
        res.status(500).json({
            message: "ErrorFindingEvents",
            error: err.message
        });
    });
});


router.get('/:eventId', checkAuth, (req, res, next) => {
    Event.findById(req.params.eventId).exec().then((thisEvent) => {
        res.status(200).json({
            message: "GotEvent",
            event: thisEvent
        });
    }).catch((err) => {
        res.status(500).json({
            message: "ErrorGettingEvent",
            error: err.message
        });
    });
});

router.delete('/:eventId', checkAuth, (req, res, next) => {
    Event.deleteOne({_id: req.params.eventId, posted_by: req.body.userId}).exec().then((thisEvent) => {
        if (thisEvent.body == null){
            res.status(200).json({
                message: "EventDeleted",
                eventData: thisEvent
            });
        }else{
            res.status(200).json({
                message: "PermissionDenied",

            });
        }
    }).catch((err) => {
        res.status(500).json({
            message: "Error",
            error: err.message
        });
    });
});



module.exports = router;