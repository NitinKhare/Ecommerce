var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var User = require('../models/user');

router.get('/register', (req, res)=>{
    res.render('layouts/users/register',{
        header: 'Register',
        Title: 'Register'
    });
});

router.post('/register',(req, res)=>{

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    req.checkBody('name', 'Name is required!').notEmpty();
    req.checkBody('email', 'Email is required!').isEmail();
    req.checkBody('username', 'Username is required!').notEmpty();
    req.checkBody('password', 'Password is required!').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.render('layouts/users/register',{
            header: 'Register',
            Title: 'Register',
            user: null,
            errors : errors
        });
    }else{
        User.findOne({username: username}, function(err, user){
            if(err) console.log(err);
           
            if(user){
                req.flash('danger','Username exists');
                res.redirect('/user/register')
            }else{
                var user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    admin: 0
                });
                    bcrypt.genSalt(10, function(err, salt){
                        bcrypt.hash(user.password, salt, function(err, hash){
                            if(err) console.log(err);
                            user.password = hash;
                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                }else{
                                    req.flash('success','You are registered');
                                    res.redirect('/products')
                                }
                            });
                        });
                    });
                    
                
            }
        });
    }



});


router.get('/login', (req, res)=>{
    if(res.locals.user){
        res.redirect('/');
    }else{
    res.render('layouts/users/login',{
        header: 'Login',
        Title: 'Login'
    });
}
});

router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
    
});

router.get("/logout", (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/');
    });

});

module.exports = router;