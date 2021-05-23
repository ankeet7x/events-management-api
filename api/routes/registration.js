const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Registration = require("../models/registrationmodel");
const checkAuth = require("../middleware/authCheck");
const Event = require("../models/eventmodel");

//Register for an event
router.post('/:eventId', checkAuth, (req, res, next) => {
    Event.findById(req.params.eventId).exec().then((foundEvent) => {
        const registrationData = Registration({
            _id: mongoose.Types.ObjectId(),
            registrated_event: req.params.eventId,
            registration_date: req.body.registration_date,
            person_registered: req.body.person_registered,
        });
        registrationData.save().then((registration) => {
            res.status(200).json({
                message: "RegisteredForEvent",
                registrationData: registration
            });
        }).catch((err) => {
            res.status(500).json({
                message: "CheckDetails",
                error: err.message
            });
        });
    }).catch((err) => {
        res.status(500).json({
            message: "EventNotFound",
            error: err.message
        });
    });
});

//Get all registrations
router.get('/', checkAuth, (req, res, next) => {
    Registration.find().exec().then((registrations) => {
        res.status(200).json({
            message: "GotRegistrations",
            registrations: registrations
        });
    }).catch((err) => {
        res.status(500).json({
            error: "ErrorGettingRegistrations",
            error: err.message
        });
    });
});

//Get registrations by person
router.get("/person/:personId", checkAuth, (req, res, next) => {
    Registration.find({ person_registered: req.params.personId }).exec().then((registration) => {
        res.status(200).json({
            message: "RegistrationOfPersonFetched",
            registration: registration
        });
    }).catch((err) => {
        res.status(500).json({
            message: "CannotFetchEvents",
            error: err.message
        });
    });
});

//Get registration by event
router.get("/event/:eventId", checkAuth, (req, res, next) => {
    Registration.find({registrated_event: req.params.eventId}).exec().then((registrations) => {
        res.status(200).json({
            message: "FetchedRegistrationsOfThisEvent",
            registrations: registrations
        });
    }).catch((err) => {
        res.status(500).json({
            message: "ErrorFetchingRegistrationOfEvent",
            error: err.message
        });
    });
});


module.exports = router;