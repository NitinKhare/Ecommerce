
exports.isAdmin = function(req, res , next){
    if(req.isAuthenticated() && res.locals.admin == 1){
        next();
    }else{
        req.flash('danger', 'Please log in');
        res.redirect('/user/login');
    }
}