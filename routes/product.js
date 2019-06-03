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
                        var path = 'public/product_images/' +product._id + '/' + imageFile;
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

router.get('/edit/:id', (req, res)=>{
    var errors;

    if(req.session.errors) errors = req.session.errors;
    req.session.errors = null;

   Category.find((err, categories)=>{
        Product.findById(req.params.id, (err, product)=>{
            if(err){
                console.log(product);
                res.redirect('/admin-products');
            }else{
                var galleryDir = 'public/product_images/'+product._id + '/gallery';
                var galleryImages = null;

                fs.readdir(galleryDir, (err, files)=>{
                    if(err){
                        console.log(err);
                    }else{
                        galleryImages =  files;
                        res.render('layouts/admin/products/edit',{
                            header: 'Edit Product',
                            title: product.title,
                            description: product.description,
                            Pcategory: product.category,
                            category:categories,
                            price: product.price,
                            image: product.image,
                            galleryImages: galleryImages,
                            id: product._id
                        })
                    }
                })
            }

        });
   });

});

router.post('/edit/:id', (req, res)=>{
    
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
    var pimage = req.body.image;
    var id = req.params.id;

    if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();
     
    if(errors){
        req.session.errors = errors
        res.redirect('/admin-products/edit-product/'+ id);
    }else{
        Product.findOne({slug: slug, _id:{'$ne':id}}, (err, product)=>{
            if(err){
                console.loge(err)
            }
            if(product){
                req.flash('danger','Product title exist');
                res.redirect('/admin-product/edit-product/'+ id); 
            }else{
                Product.findById(id, (err, product)=>{
                    if(err) console.log(err);
                    product.title = title;
                    product.slug = slug;
                    product.description = description;
                    product.price = parseFloat(price).toFixed(2);
                    product.categories = category;
                    if(imageFile !== ""){
                        product.image = imageFile;
                    }
                    product.save(function(err){
                        if(err) console.log(err);
                        if(imageFile !== ""){
                            fs.remove('public/product_images/'+id+'/'+productImage, (err)=>{
                                if(err) console.log(err);
                            });
                            var productImage = req.files.image;
                            var path = 'public/product_images/' +id + '/' + imageFile;
                            productImage.mv(path, (err)=>{
                                if(err) return console.log(err);
                            });
                        }
                        req.flash('success', 'Product added successfully');
                        res.redirect('/admin-products');
                    });
                })
            }
        })
    }
});

router.get('/delete/product/:id', (req, res)=>{
var id = req.params.id;
var path  = 'public/product_images/' +id;
fs.remove(path, (err)=>{
    if(err){
        console.log(err);
    }else{
        Product.findByIdAndRemove(id,(err, res)=>{
            if(err) console.log(err);
        });
        res.redirect('/admin-products');
    }
})
});

router.delete('/delete/:id', (req, res)=>{
    var id = req.params.id;
    var path  = 'public/product_images/' +id;
    fs.remove(path, (err)=>{
        if(err){
            console.log(err);
        }
    });

    Product.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            throw err;
        }else{
            req.flash('success', 'Product deleted');
            res.redirect('/amin-products');
        }
    });
});

module.exports = router;