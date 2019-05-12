var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');

var Product = require('../models/product');
var Category = require('../models/category');

router.get('/',(req, res)=>{
    Product.find({}, (err, product)=>{
        res.render('layouts/admin/products/products',{
            header:'Products',
            product: product
        }); 
    });
});

router.get('/create', (req, res)=>{
    Category.find({}, (err, category)=>{
    res.render('layouts/admin/products/create_products',{
        header:'Products',
        category: category
    }); 
});
});

router.post('/create',(req, res)=>{

    var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name: "";
    req.checkBody('title', 'Enter a Title').notEmpty();
    req.checkBody('description', 'Write some product description').notEmpty();
    req.checkBody('price', 'Selling it for Free ? Add a price').notEmpty();
    req.checkBody('image', 'Upload a proper image').isImage(imageFile);

  
    var title = req.body.title;
    var price = req.body.price;
    var description = req.body.description;
    var category = req.body.category;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if(errors) {
        Category.find({}, (err, category)=>{
            res.render('layouts/admin/products/create_products',{
                errors: errors,
                header:'Products',
                category: category
            }); 
        });
    }else{
        Product.findOne({slug: slug}, (err, product)=>{
            if(product){
                req.flash('danger', 'Product with same name exists' );
                Category.find({}, (err, category)=>{
                    res.render('layouts/admin/products/create_products',{
                        errors: errors,
                        header:'Products',
                        category: category
                    }); 
                });
            }else{
                var product = new Product({
                    title: title,
                    slug: slug,
                    description: description,
                    category: category,
                    price: price,
                    image: imageFile

                });

                product.save((err)=>{
                    if(err) return console.log(err);

                    mkdirp('public/product_images/'+product._id, (err)=>{
                        if(err) return console.log(err);
                    });

                    // for gallery

                    mkdirp('public/product_images/'+product._id+'/gallery', (err)=>{
                        if(err) return console.log(err);
                    }); 

                    //for thumbnails
                    mkdirp('public/product_images/'+product._id+'/gallery/thumbs', (err)=>{
                        if(err) return console.log(err);
                    });

                    if(imageFile != ""){
                        var productImage = req.files.image;
                        var path = 'public/product_image/' +product._id + '/' + imageFile;
                        productImage.mv(path, (err)=>{
                            if(err) return console.log(err);
                        });
                    }

                    req.flash('success', 'Product added successfully');
                    res.redirect('/admin-products');
                });
            }
        });
    }
});

module.exports = router;