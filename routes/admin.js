var express = require('express');
var router = express.Router();

router.get('/',(req, res)=>{
    res.render('index',{
        header:'index'
    });
});

router.get('/pages',(req, res)=>{
    res.send("FORBIDDEN");
});



module.exports = router