module.exports.isLoggedIn =(req,res,next) =>{
    if(!req.isAuthenticated()){
        req.flash("info", "You must be logged in to perform the action");
        res.redirect("/login");
    }
    next();
}