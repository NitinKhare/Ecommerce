var express = require('express');
var router = express.Router();
var Page = require('../models/page');


router.get('/',(req, res)=>{
    res.render('index',{
        header:'index'
    });
});

router.get('/pages',(req, res)=>{
    res.send("FORBIDDEN"); 
});

router.get('/pages/create',(req, res)=>{
    var title = "";
    var slug = "";
    var content = ""; 
    res.render('layouts/admin/create_page', {
        header: 'Create Page',
        title: title,
        slug: slug,
        content: content
    });
});

router.post('/pages/create',(req, res)=>{

  req.checkBody('title', 'Enter a Title').notEmpty();
  req.checkBody('content', 'Content Must have some value').notEmpty();

  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
  if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
  
  var content = req.body.content;

  var errors = req.validationErrors();

  if(errors){
    res.render('layouts/admin/create_page', {
        errors: errors,
        header: 'Create Page',
        title: title,
        slug: slug,
        content: content
    });
  }else{
    Page.findOne({slug: slug}, (err, page)=>{
        if(page){
            req.flash('danger', 'Enter a different slug');
            res.render('layouts/admin/create_page', {
                errors: errors,
                header: 'Create Page',
                title: title,
                slug: slug,
                content: content
            });
        }else{
            var page = new Page({
                title: title,
                slug: slug,
                content: content
            });

            page.save((err) =>{
                if(err) return console.log(err);
                 req.flash('success', 'Page Added Successfully') 
                 res.redirect('/admin/pages'); 
            })
        }
    });
  }

});





module.exports = router;