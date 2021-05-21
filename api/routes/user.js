const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const saltRounds = 10;
const validator = require('validator');
const mongoose = require("mongoose");

router.post('/signup', (req, res, next) => {
    const email = req.body.email;
    if (validator.isEmail(email))  {
        User.findOne({email: email}).exec().then((user) => {
            if (user != null){
                return res.status(500).json({
                    message: "userAlreadyExists",
                    
                })
            }else{
                bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                    if(err){
                        res.status(500).json({
                            message: err.message
                        });
                    }else{
                        const userData = User({
                            _id: mongoose.Types.ObjectId(),
                            email: email,
                            password: hash,
                            fullname: req.body.fullname
                        });
                        userData.save().then((user) => {
                            res.status(200).json({
                                message: "userCreated",
                                user: user
                            })
                        }).catch((err) => {
                            res.status(500).json({
                                message: "errorCreatingUser",
                                err: err.message
                            });
                        });
                    }
                });
            }
        }).catch((err) => {
            res.status(500).json({
                message: "errorCreatingUser",
                error: err.message
            });
        });
    }else{
        return res.status(500).json({
            messsage: 'emailInvalid'
        });
    }
});


router.post("/login", (req, res, next) => {
    const email = req.body.email;
    if (validator.isEmail(email)){
        User.findOne({email: email}).exec().then((user) => {
            if (user == null){
                return res.status(500).json({
                    message: "UserDoesn'tExist"
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err){
                    return res.status(500).json({
                        message: "passwordInvalid",
                        error: err.message
                    });
                }
                if(result){
                    const token = jwt.sign({email: user.email, userId: user._id}, 'secret', {expiresIn: "300h"});
                    return res.status(200).json({
                        message: "userLoggedIn",
                        token: token
                    })
                }
                return res.status(500).json({
                    message: "authFailed"
                });
            });
        }).catch((err) => {
            res.status(500).json({
                message: "errorFindingUser",
                err: err.message
            });
        });
    }else{
        return res.status(500).json({
            message: "emailInvalid"
        })
    }
});


router.get('/', (req, res, next) => {
    User.find().exec().then(users => {
        res.status(200).json({
            users: users
        })
    }).catch(err => 
        res.status(500).json({
            message: err.message
        })
        )
});

router.get('/:userId', (req, res, next) => {
    User.findById(req.params.userId).then(user => {
        res.status(200).json({
            user: user,
            message: "UserFound"
        })
    }).catch(err => {
        res.status(500).json({
            error: "NoSuchUser",
            message: err.message
        })
    })
})


module.exports = router;