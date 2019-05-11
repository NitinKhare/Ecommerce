var express = require('express');
var router = express.Router();


var Category = require('../models/category');

router.get('/',(req, res)=>{
     Category.find({}, (err, category)=>{
        if(err) return console.log(err);
        res.render('layouts/admin/categories/categories',{
            header:'Categories',
            Category: category
        });  
     });
})

router.get('/create', (req, res)=>{
    var title="";
    res.render('layouts/admin/categories/create_categories',{
        header:'Create Categories',
        title: title,
    });
});

router.post('/create', (req, res)=>{
    req.checkBody('title', 'Enter a Title').notEmpty();
    var title = req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
  
    var errors = req.validationErrors();

    if(errors){
        res.render('layouts/admin/categories/create_categories', {
            errors: errors,
            header: 'Create Categories',
            title: title,
            slug: slug
        });
    }else{
        Category.findOne({slug: slug}, (err, category)=>{
            if(category){
                req.flash('danger', 'Enter a different Category title');
                res.render('layouts/admin/categories/create_categories', {
                    errors: errors,
                    header: 'Create Categories',
                    title: title,
                    slug: slug     
                });
            }else{
                var category = new Category({
                    title: title,
                    slug: slug,
                });
                category.save((err) =>{
                    if(err) return console.log(err);
                     req.flash('success', 'category Added Successfully') 
                     res.redirect('/product-categories'); 
                });
            }
        });
      }
});

router.delete('/delete/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            throw err;
        }else{
            req.flash('success', 'Category deleted');
            res.redirect('/product-categories');
        }
    });
});

router.get('/edit/:id',(req, res)=>{
    Category.findById(req.params.id, (err, category)=>{
        if(err) return console.log(err);
        res.render('layouts/admin/categories/edit_categories', {

            header: 'Edit Categories',
            title: category.title,
            id: category._id     
        });
    });
});

router.post('/edit/:id', (req, res)=>{
    var id = req.params.id;
    req.checkBody('title', 'Enter a Title').notEmpty();
    var title = req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
  
    var errors = req.validationErrors();

    if(errors){
        res.render('layouts/admin/categories/create_categories', {
            errors: errors,
            header: 'Create Categories',
            title: title,
            slug: slug
        });
    }else{
        Category.findOne({slug: slug}, (err, category)=>{
            if(category){
                req.flash('danger', 'Enter a different Category title');
                res.render('layouts/admin/categories/create_categories', {
                    errors: errors,
                    header: 'Create Categories',
                    title: title,
                    slug: slug     
                });
            }else{
                // var category = new Category({
                //     title: title,
                //     slug: slug,
                // });
                // category.save((err) =>{
                //     if(err) return console.log(err);
                //      req.flash('success', 'category Added Successfully') 
                //      res.redirect('/product-categories'); 
                // });

                Category.findOneAndUpdate({_id:id}, {$set:{
                    title : req.body.title,
                }},{new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                    res.redirect('/product-categories');
                });
            }
        });
      }
});

module.exports = router;