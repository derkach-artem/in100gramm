var Image = require('../models/image.js');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: __dirname + '/../temp' });


var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'db6y5mykq',
    api_key: '392787289682527',
    api_secret: '9Jma95FhgYoCW03AY1gxZ6ChWgg'
}); 


var loadImage = function (img, id) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(img.path, function (result) {
            if (result.url) {
                let image = new Image();
                image.public_id = result.public_id;
                image.url = result.url;
                image._owner = req.body.user_id;

                image.save((error, response) => { 
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


module.exports.upload = function (req, res, next) { // dont foget multipart
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
};

module.exports.getImagesCurrentUser = function (request, response) {
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
};

module.exports.deleteImage = function (request, response) {
    Image.remove({ 'public_id': request.params.id }, function () {
        cloudinary.api.delete_resources([request.params.id],
            function (result) {
                response.status(200).send(true);
            });
    })
};