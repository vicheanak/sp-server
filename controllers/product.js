var Product = require('../models/product');

exports.create = function(req, res){
    var newProduct = Product({
        name: req.body.name,
    });

    newProduct.save(function(err, newProduct){
        if (err){
            res.json({success: false, msg: 'Failed to save'});
        }
        else{
            res.json({success: true, data: newProduct});
        }
    })
}
