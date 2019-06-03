
var express = require('express');
var router = express.Router();
var Page = require('../models/page');



router.get('/:slug',(req, res)=>{
    var slug = req.params.slug;
    Page.findOne({slug:slug}, (err, page)=>{
        if(err) console.log(err);
        if(!page) res.redirect('/');
        else res.render('pageTemplate',{
            header:page.title,
            title: page.title,
            content : page.content
        });
    });
 
});

module.exports = router;