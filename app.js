const express = require('express');
const mongoose = require("mongoose");
const app = express();
const userRoute = require('./api/routes/user');
const eventRoute = require("./api/routes/event");
const commentRoute = require("./api/routes/comment");
const registrationRoute = require('./api/routes/registration');
const morgan = require('morgan');

mongoose.connect("mongodb+srv://ankeet:" + process.env.MONGO_ATLAS_PWD +"@cluster0.c0n1n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use('/user', userRoute);
app.use("/event", eventRoute);
app.use("/comment", commentRoute);
app.use("/register", registrationRoute);

app.get('/', (req, res) => {
    res.send('api is live');
});

if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status(404);
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;