var express = require('express');
var router = express.Router();
var Page = require('../models/page');


router.get('/',(req, res)=>{
    res.render('index',{
        header:'index'
    });
});

router.get('/pages',(req, res)=>{
    Page.find({}).sort({sorting: 1}).exec((err, pages)=>{
        res.render('layouts/admin/pages',{
            header:'pages',
            pages: pages
        });         
    });
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

  //Date at which page was created
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  
 today = mm + '/' + dd + '/' + yyyy;
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
                dateCreated: today,
                content: content
            });
            page.save((err) =>{
                if(err) return console.log(err);
                 req.flash('success', 'Page Added Successfully') 
                 res.redirect('/admin/pages'); 
            });
        }
    });
  }

});


router.get('/pages/edit/:id',(req, res)=>{
    var id = req.params.id;
    Page.findOne({_id: id}, (err, page)=>{
    res.render('layouts/admin/edit_page', {
        id: page._id,
        header: 'Edit Page',
        title: page.title,
        slug: page.slug,
        content: page.content
    });
});
});

router.post('/pages/edit/:id',(req, res)=>{
    var id = req.params.id;
    req.checkBody('title', 'Enter a Title').notEmpty();
  req.checkBody('content', 'Content Must have some value').notEmpty();

  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
  if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
  
  var content = req.body.content;

  var errors = req.validationErrors();

  if(errors){
    res.render('layouts/admin/edit_page', {
        errors: errors,
        header: 'Edit Page',
        title: title,
        slug: slug,
        content: content
    });
  }else{
    Page.findOne({slug: slug, _id:{'$ne': id }}, (err, page)=>{
        if(page){
            req.flash('danger', 'Enter a different slug');
            res.render('layouts/admin/edit_page', {
                errors: errors,
                header: 'Create Page',
                title: title,
                slug: slug,
                content: content
            });
        }else{

        Page.findOneAndUpdate({_id:id}, {$set:{
            title : req.body.title,
            slug : req.body.slug,
            content :req.body.content
        }},{new: true}, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            res.redirect('/admin/pages/edit/'+id);
        });
        
   
         }
    });
  }

});

router.delete('/pages/delete/:id', (req, res)=>{
    Page.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            throw err;
        }else{
            res.redirect('/admin/pages');
        }
    });
});



module.exports = router;