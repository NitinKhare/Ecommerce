var express = require('express');
var router = express.Router();

var Product = require('../models/product');

router.get('/add/:product',(req, res)=>{
    var slug = req.params.product;
    Product.findOne({slug:slug}, (err,product)=>{
        if(err){
            console.log(err);
        }else{
             if(typeof req.session.cart == "undefined"){
                 req.session.cart = [];
                 req.session.cart.push({
                    title: slug,
                    qty: 1,
                    price: product.price,
                    image: '/product_images/'+ product._id +'/' + product.image
                 });
             }else{
                 var cart = req.session.cart;
                 var isNew = true;
                 for (let i = 0; i < cart.length; i++) {
                     if(cart[i].title == slug){
                         cart[i].qty++;
                         isNew = false;
                         break;
                     }
                     
                 }
                 if(isNew){
                    cart.push({
                        title: slug,
                        qty: 1,
                        price: product.price,
                        image: '/product_images/'+ product._id +'/' + product.image
                     });
                 }
             } 
             req.flash('success', 'Product added');  
             res.redirect('/products');
        }
    });

});

router.get('/checkout', (req, res)=>{
    res.render('layouts/checkout',{
        header: 'Checkout',
        cart: req.session.cart
    });
});

router.get('/update/:product', (req, res)=>{
    var slug = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;
    console.log(action);
    for (let i = 0;i < cart.length;i++) {
        if(cart[i].title == slug){
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    if(cart[i].qty >0){
                    cart[i].qty--;
                    }
                    break;
                    case "clear":
                    cart.splice(i, 1);
                    if(cart.length == 0){
                        delete req.session.cart;
                    }
                    break;
                default:
                    break;
            }
            break;
        }
        
    }
    req.flash('success','Cart updated');
    res.redirect('/cart/checkout');
});

router.get('/clear', (req, res)=>{
    delete req.session.cart;
 res.redirect('/products');
 req.flash('danger','Cart Emptied');

});

module.exports = router;