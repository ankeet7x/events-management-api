const express = require("express");
const router = express.Router();
const checkPermission = require('../middleware/authCheck');
const Event = require('../models/eventmodel');
const Comment = require("../models/commentmodel");
const mongoose = require("mongoose");


//Post comment to certain event using event_id
router.post('/:eventId', checkPermission, (req, res, next) => {
    const eventId = req.params.eventId;
    Event.findById(eventId).exec().then((parentEvent) => {
        const commentData = Comment({
            _id: mongoose.Types.ObjectId(),
            author: req.body.author,
            parent_event: eventId,
            comment: req.body.comment,
            date: req.body.date
        });
        commentData.save().then((comment) => {
            res.status(200).json({
                message: "SavedComment",
                comment: comment
            })
        }).catch((err) => {
            res.status(500).json({
                message: "ErrorSavingComment",
                error: err.message
            });
        });
    }).catch((err) => {
        res.status(500).json({
            message: "ParentNotFound",
            error: err.message
        });
    });
});

//Get comment of post by post id
router.get('/:postId', checkPermission, (req, res, next) => {
    Comment.find({ parent_event: req.params.postId }).exec().then((comment) => {
        res.status(200).json({
            message: "CommentsFetched",
            comment: comment
        });
    }).catch((err) => {
        res.status(500).json({
            message: "ErrorFindingPostAndComment",
            error: err.message
        });
    });
});


//Delete comment of post by commentId
router.delete('/', checkPermission, (req, res, next) => {
    Comment.deleteOne({_id: req.body.commentId, author: req.body.author}).exec().then((comment) => {
        res.status(200).json({
            message: "CommentDeleted",
        })
    }).catch((err) => {
        res.status(500).json({
            message: "NoPermission",
            error: err.message
        })
    })
});

//Fetch all comments
router.get('/', checkPermission, (req, res, next) => {
    Comment.find().exec().then((comment) => {
        res.status(200).json({
            message: "GotComments",
            comments: comment
        })
    }).catch((err) => {
        res.status(500).json({
            message: "ErrorFetchingComments",
            error: err.message
        })
    })
})


module.exports = router;









// const commentData = Comment({
//     _id: mongoose.Types.ObjectId(),
//     author: req.body.author,
//     parent_event: req.body.parent_event,
//     comment: req.body.comment,
//     date: req.body.date
// });
// commentData.save().then((comment) => {
//     res.status(200).json({
//         message: "Comment Saved",
//         comment: comment
//     })
// }).catch((err) => {
//     res.status(500).json({
//         message: "ErrorSavingComment",
//         error: err.message
//     })
// });