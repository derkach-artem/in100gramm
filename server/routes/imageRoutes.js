var router = require('express').Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: __dirname + '/../temp' });
var Image = require('../models/image.js');
const mongoose = require('mongoose');

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'db6y5mykq',
    api_key: '392787289682527',
    api_secret: '9Jma95FhgYoCW03AY1gxZ6ChWgg'
});

var imgCtrl = require('../controllers/imgCtrl.js');

router.post('/upload', multipartMiddleware, imgCtrl.upload);
router.post('/getImagesCurrentUser', imgCtrl.getImagesCurrentUser);
router.delete('/home/image/:id', imgCtrl.deleteImage);

module.exports = router;