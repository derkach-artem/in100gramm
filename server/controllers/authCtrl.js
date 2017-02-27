var mongoose = require('mongoose');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require('../models/user.js');
require('../auth/setup-passport.js');

module.exports.login = function (request, response, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            response.status(400).send({ err: "Error" });
        }
        if (user) {
            let token = user.generateJwt();
            request.session._id = user._doc._id;
            request.session.token = token;
            response.status(200).send({ token: token, name: user.username });
        } else {
            response.status(401).send(info)
        }
    })(request, response);

};


module.exports.registrate = function (request, response) {
    User.findOne({ username: request.body.username }, function (err, user, next) {
        if (err) {
            response.status(400).send({ err: "Error" });
        } else if (user) {
            response.status(400).send({ err: "Such User unavailable" })
        } else {
            let newUser = new User({ username: request.body.username, password: request.body.password, email: request.body.email, private: true });
            newUser.save(function (err, user) {
                if (err) {
                    response.status(400).send({ err: "Some Error with DB" })
                } else {
                    let token = newUser.generateJwt();
                    request.session._id = user._doc._id;
                    request.session.token = token;
                    response.status(200).send({ token: token })
                }
            })
        }
    })
};


module.exports.logout = function (request, response) {
    request.session._id = null;
    request.session.token = null;
    response.status(200).send("ok");
};
