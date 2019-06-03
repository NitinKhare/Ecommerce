var express = require('express');
var router = express.Router();
var Page = require('../models/page');


router.get('/',(req, res)=>{
    res.render('index',{
        header:'index'
    });
});



module.exports = router;