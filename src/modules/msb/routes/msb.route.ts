let router = require('express').Router();

const msbController = require('../controllers/msb.controller');

router.post('/link', msbController.link);

module.exports = router;
