var mongoose = require('mongoose');
var User = require('../models/user.js');


module.exports.checkProfile = function (request, response) {
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
};

module.exports.changePrivate = function (request, response) {
    User.update({ _id: request.session._id },
        { $set: { "private": request.body.private } },
        function (err, res) {
            if (err) {
                response.send({ err: 'Some error update change visible profile' });
            } else {
                response.status(200);
            }
        }
    )
};

module.exports.showUsers = function (request, response) {
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
                //response.send({'data' : 'Admin'});
                User.find({}, "username createdAt", function (err, docs) {
                    response.send({ "users": docs });
                })
            } else {
                //response.send({'data' : 'Not Admin'});
                User.find({ "private": false }, "username createdAt", function (err, docs) {
                    response.send({ "users": docs });
                });
            };
        };
    });
};


module.exports.getUsername = function (req, res) {
    User.findOne({ _id: req.session._id }, function (err, doc) {
        if (err) {
            res.send({ err: "ERROR DB user/username" })
        } else {
            if (doc === null) {
                //не админ, показать открытого и только фотки
                // User.find({ "username": false }, "username createdAt", function (err, docs) {
                //     response.send({ "users": docs });
                // });
                // return;
                res.send({ "data": "аноним, показать открытого и только фотки" });
                return;
            }
            if (doc.isAdmin === true) {
                // админ, показать даже если скрытый
                // User.find({}, "username createdAt", function (err, docs) {
                //     response.send({ "users": docs });
                // })
                res.send({ "data": "админ, показать даже если скрытый" });
            } else {
                // не админ показать только открытого и только фотки
                // User.find({ "private": false }, "username createdAt", function (err, docs) {
                //     response.send({ "users": docs });
                // });
                res.send({ "data": "не админ показать только открытого и только фотки" });
            };
        };
    });
};


module.exports.checkUser = function (request, response) {
    if ('"' + request.session.token + '"' == request.body.token.toString()) {
        User.findOne({ _id: request.session._id }, function (err, user) {
            if (err) {
                response.status(400).send({ err: "No User find" })
            } else {
                response.status(200).send({ username: user.username, isAdmin: user.isAdmin })
            }
        })
    } else {
        response.status(500).send({ err: "You need to logout and login again" })
    }
};

module.exports.getCurrentUser = function (request, response) {
    User.findOne({ username: request.body.userId }, function (err, user) {
        if (err) {
            response.status(400).send({ err: "Error" });
        }
        response.status(200).send({ username: user.username, _id: user._id, private: user.private, isAdmin: user.isAdmin });
    })
};