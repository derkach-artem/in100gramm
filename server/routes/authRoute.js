var express = require('express');
var mongoose = require('mongoose');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: __dirname + '/../temp' });

const cloudinary = require('cloudinary');


var User = require('../models/user.js');
var Image = require('../models/image.js');

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
            response.status(200).send({ token: token, name: user.username });
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
                response.status(200).send({ username: user.username });
            }
        })
    } else {
        response.status(500).send({ err: "You need to logout and login again" })
    }
});

// router.get('/checkprofile', function (request, response) {
//     User.findOne({ _id: request.session._id }, function (err, res) {
//         if (!err) {
//             if (res === null) {
//                 response.send({ msg: 'guest' });
//             }
//             response.send({
//                 "private": res.private
//             });
//         } else {
//             console.log('ERROR PROFILE DATA');
//             res.send('ERROR CHECK PROFILE');
//         }
//     });
// });

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
});

router.get('/#!/user/:username', function (req, res) {
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
});

cloudinary.config({
    cloud_name: 'db6y5mykq',
    api_key: '392787289682527',
    api_secret: '9Jma95FhgYoCW03AY1gxZ6ChWgg'
});

var loadImage = (img, id) => {

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(img.path, function (result) {
            if (result.url) {
                let image = new Image();
                image.public_id = result.public_id;//
                image.url = result.url;//
                image._owner = req.body.user_id;//

                image.save((error, response) => { //
                    if (error) {
                        reject('mongodb err')
                    }
                    resolve({ public_id: result.public_id, url: result.url });
                })
            }
            else {
                reject('cloudinary err');
            }
        });
    })
};

router.post('/upload', multipartMiddleware, function (req, res, next) {
    if (req.files.file) {
        cloudinary.uploader.upload(req.files.file.path, function (result) {
            if (result.url) {
                let image = new Image();
                image.public_id = result.public_id;
                image.url = result.url;
                image._owner = req.body.user_id;
                image.save((error, response) => {
                    res.status(201).json({ public_id: result.public_id, url: result.url })

                })
            } else {
                res.json(error);
            }
        });
    } else {
        next();
    }
});


router.post('/getImagesCurrentUser', function (request, response) {
    var currentImagesArray = [];
    Image.find({ "_owner": request.body._id }, function (err, data) {
        if (err) {
            response.status(400).send({ err: "Error" });
        } else {
            data.forEach(function (im) {
                currentImagesArray.push({ url: im.url, id: im.public_id })
            })
            response.json(currentImagesArray)
        }
    })
});

router.post('/getCurrentUser', function (request, response) {
    User.findOne({ username: request.body.userId }, function (err, user) {
        if (err) {
            response.status(400).send({ err: "Error" });
        }
        response.status(200).send({ username: user.username, _id: user._id, private: user.private, isAdmin: user.isAdmin });
    })
});


router.post('/checkUser', function (request, response) {

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
});


router.delete('/home/image/:id', function (request, response) {
    Image.remove({ 'public_id': request.params.id }, function () {
        cloudinary.api.delete_resources([request.params.id],
            function (result) {
                response.status(200).send(true);
            });
    })
});


module.exports = router;