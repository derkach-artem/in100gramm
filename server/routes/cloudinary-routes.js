const cloudinary = require('cloudinary');
const mongoose = require('mongoose');
const Image = mongoose.model('Image');

cloudinary.config({
    cloud_name: 'db6y5mykq',
    api_key: '392787289682527',
    api_secret: '9Jma95FhgYoCW03AY1gxZ6ChWgg'
});

router.post('/upload', multipartyMiddleware, function (req, res, next) {
        if (req.files.file) {
            cloudinary.uploader.upload(req.files.file.path, function (result) {
                if (result.url) {
                    let image = new Image();
                    
                    image.public_id = result.public_id;
                    image.url = result.url;
                    image._owner = req.body.user_id;
                    image.save((error, response) => {
                        res.status(201).json({public_id:result.public_id,url:result.url})
                        
                    })
                } else {
                    res.json(error);
                }
            });
        } else {
            next();
        }
    });