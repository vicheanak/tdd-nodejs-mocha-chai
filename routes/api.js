var express = require('express');
var router = express.Router();
var Product = require('../models/product');

router.post('/products', function(req, res, next){
    var newProduct = new Product({
        name: req.body.name
    });
    newProduct.save(function(err, product){
        if (err){
            res.json({'ERROR': err});
        }
        else{
            res.json({'SUCCESS': product});
        }
    });
});

router.get('/products', function(req, res, next){
    Product.find(function(err, products){
        if (err){
            res.json({'ERROR': err});
        }
        else{
            res.json(products);
        }
    });
});

router.get('/product/:id', function(req, res, next){
    Product.findById(req.params.id, function(err, product){
        if (err){
            res.json({'ERROR': err});
        }
        else{
            res.json(product);
        }
    });
});

router.put('/product/:id', function(req, res, next){
    Product.findById(req.params.id, function(err, product){
        product.name = req.body.name;
        product.save(function(err){
            if (err){
                res.json({'ERROR': err});
            }
            else{
                res.json({'UPDATED': product});
            }
        });
    });
});

router.delete('/product/:id', function(req, res, next){
    Product.findById(req.params.id, function(err, product){
        product.remove(function(err){
            if (err){
                res.json({'ERROR': err});
            }
            else{
                res.json({'REMOVED': product});
            }
        });
    });
})

module.exports = router;
