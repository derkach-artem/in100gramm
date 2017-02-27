const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
var multipart = require('connect-multiparty');
//var multipartMiddleware = multipart();

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
    secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
    resave: true,
    saveUninitialized: true
}));

// var authRoutes = require('./routes/authRoute');

var setUpPassport = require('./auth/setup-passport');



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/TestPassport');
setUpPassport();

app.use(express.static(path.join(__dirname, '../clientBootstrap')));

app.use(passport.initialize());
app.use(passport.session());

// app.use('/', authRoutes);

var authRoutes = require('./routes/authRoutes.js');
var imageRoutes = require('./routes/imageRoutes.js');
var userRoutes = require('./routes/userRoutes.js');

app.use('/', authRoutes);
app.use('/', imageRoutes);
app.use('/', userRoutes);


app.listen(3000, function () {
    console.log("Server is started at 3000 port");
});