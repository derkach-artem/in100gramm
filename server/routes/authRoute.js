var express = require('express');
const mongoose = require('mongoose');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require('../models/user.js');

require('../auth/setup-passport.js');
var router = express.Router();

router.post('/login', function (request, response, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            response.status(400).send({ err: "Error" });
        }
        if (user) {
            let token = user.generateJwt();
            request.session._id = user._doc._id;
            request.session.token = token;
            response.status(200).send({ token: token })
        } else {
            response.status(401).send(info)
        }
    })(request, response);
});

router.post('/registrate', function (request, response) {
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
                    //console.log(user + ' reg');
                    response.status(200).send({ token: token })
                }
            })
        }
    })
});

router.get('/logout', function (request, response) {
    request.session._id = null;
    request.session.token = null;
    response.status(200).send("ok");
});

router.post('/isauth', function (request, response) {
    if ('"' + request.session.token + '"' == request.body.token.toString()) {
        User.findOne({ _id: request.session._id }, function (err, user) {
            if (err) {
                response.status(400).send({ err: "No User find" })
            } else {
                //response.status(200).send({ username: user.username, isAdmin: user.isAdmin })
                response.status(200).send({ username: user.username });
            }
        })
    } else {
        response.status(500).send({ err: "You need to logout and login again" })
    }
});

router.get('/checkprofile', function (request, response) {
    User.findOne({ _id: request.session._id }, function (err, res) {
        if (!err) {
            //console.log(res.private);
            response.send({
                "private": res.private
            });
        } else {
            console.log('ERROR PROFILE DATA');
        }
    });
});

router.post('/changeprivate', function (request, response) {
    User.update({ _id: request.session._id },
        { $set: { "private": request.body.private } },
        function (err, res) {
            if (err) {
                response.send({ err: 'Some error update change visible profile' });
            } else {
                //console.log(res);
                response.status(200);
            }
        }
    )
});

router.post('/showusers', function (request, response) {
    User.findOne({ _id: request.session._id }, function (err, doc) {
        if (err) {
            response.send({ err: "ERROR DB SHOWUSERS" })
        } else {
            if (doc === null) {
                //return response.send({ 'data': 'Not Admin' });
                User.find({ "private": false }, "username createdAt", function (err, docs) {
                    response.send({ "users": docs });
                });
                return;
            }
            if (doc.isAdmin == true) {
                // найти всех
                //response.send({'data' : 'Admin'});
                User.find({}, "username createdAt", function (err, docs) {
                    response.send({ "users": docs });
                })
            } else {
                // только открытые пользователи
                //response.send({'data' : 'Not Admin'});
                User.find({ "private": false }, "username createdAt", function (err, docs) {
                    response.send({ "users": docs });
                });
            };
        };
    });
});



module.exports = router;

























router.post('/showusers', isAdminstr, function (request, response, err, next) {
    console.log('next');
    if (err) {
        response.send({ err: 'ERROR ADMIN' });
    } else {
        next();
    }
});

function isAdminstr(request, response, next) {
    User.findOne({ _id: request.session._id }, function (err, res) {
        if (err) {
            response.send({ err: 'Some ERR DB' })
        } else {
            if (res.isAdmin == false) {
                next(error)
            } else {
                next();
            }
        }
    });
};