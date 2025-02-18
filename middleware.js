module.exports.isLoggedIn =(req,res,next) =>{
    if(!req.isAuthenticated()){
        // store the previous page 
        req.session.redirectUrl = req.originalUrl;

        req.flash("info", "You must be logged in to perform the action");
        res.redirect("/login");
    }
    next();
};

// middleware to save previous page when passport resets req.session
module.exports.saveRedirectUrl =(req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

