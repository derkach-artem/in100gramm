var router = require('express').Router();

var userCtrl = require('../controllers/userCtrl.js');

router.get('/checkprofile', userCtrl.checkProfile);
router.post('/changeprivate', userCtrl.changePrivate);
router.post('/showusers', userCtrl.showUsers);
router.post('/checkUser', userCtrl.checkUser);
router.post('/getCurrentUser', userCtrl.getCurrentUser);

module.exports = router;