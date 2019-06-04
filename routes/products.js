var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Category = require('../models/category');
var fs = require('fs-extra');


router.get('/',(req, res)=>{
    Product.find({}, (err, product)=>{
        if(err) return console.log(err)
        else res.render('layouts/allProducts',{
            header: 'Products',
            title: 'All Products',
            products: product
        })
    });
});


router.get('/:category',(req, res)=>{
    var catSlug = req.params.category;
    Category.findOne({slug:catSlug}, (req, cat)=>{ 
    Product.find({category: cat.title}, (err, products)=>{
        if(err) {console.log(err);}
        else{ res.render('layouts/allProducts',{
            header: cat.title,
            title: 'All Products',
            products: products
        
        });
    }
    });
});
});

router.get('/:category/:product', (req, res) =>{
    var galleryImages = null;
    var loggedIn = req.isAuthenticated();
    console.log(loggedIn);
    Product.findOne({slug:req.params.product}, (err, product)=>{
        if(err){
            console.log(err)
        }else{
            var galleryDir = 'public/product_images/' + product._id +'/gallery';
            fs.readdir(galleryDir,(err, files)=>{
                if(err){
                    console.log(err);
                }else{
                    galleryImages = files;
                    res.render('layouts/product_details',{
                        header: product.title,
                        title: product.title,
                        product: product,
                        images: galleryImages,
                        loggedIn: loggedIn
                    
                    });
                }
            });
        }

    });
});





module.exports = router;