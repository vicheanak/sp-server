var express = require('express');
var router = express.Router();

var user = require('../controllers/user');
var product = require('../controllers/product');

router.post('/authenticate', user.authenticate);
router.post('/adduser', user.addNew);
router.post('/products', user.isAuth, product.create);

module.exports=router;
