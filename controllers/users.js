const User = require("../models/user");


// =================== Signup route ==============
module.exports.renderSignupForm = (req,res) => {
    res.render("signupForm.ejs");
};


module.exports.signupUser = async(req,res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({email, username});
    
        const registeredUser = await User.register(newUser, password);

        // automatic login after signup
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Cozy Clouds");
            res.redirect("/listings");
        });
        console.log(registeredUser);
        
    } catch (error) {
        console.log(error)
        req.flash("error", error.message);
        res.redirect("/signup");
    }
};


// =================== Login route ==============
module.exports.renderLoginForm = (req,res) => {
    res.render("loginForm.ejs");
};


module.exports.loginUser = async(req,res) => {
    req.flash('success', "Welcome back");

    // save the previous page
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};


// =================== Logout route ==============
module.exports.logoutUser = (req,res,next) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
    });
    
    req.flash("success", "You have successfully logged out");
    res.redirect('/listings');
};


