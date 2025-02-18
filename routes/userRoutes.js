const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// =================== Signup route ==============
router.get("/signup", (req,res) => {
    res.render("signupForm.ejs");
});


router.post("/signup", wrapAsync(async(req,res) => {
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
}));


// =================== Login route ==============
router.get("/login", (req,res) => {
    res.render("loginForm.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true
    
}), async(req,res) => {
    req.flash('success', "Welcome back");

    // save the previous page
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
});


// ================== Logout route ================
router.get("/logout", (req,res,next) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
    });
    
    req.flash("success", "You have successfully logged out");
    res.redirect('/listings');
});

module.exports = router;