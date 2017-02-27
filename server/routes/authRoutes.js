var mongoose = require('mongoose');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var router = require('express').Router();
var User = require('../models/user.js');

var authCtrl = require('../controllers/authCtrl.js');
require('../auth/setup-passport.js');

router.post('/login', authCtrl.login);
router.post('/registrate', authCtrl.registrate);
router.get('/logout', authCtrl.logout);

module.exports = router;