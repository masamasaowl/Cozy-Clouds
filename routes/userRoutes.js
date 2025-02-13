const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user");

// =================== Signup route ==============
router.get("/signup", (req,res) => {
    res.render("signupForm.ejs");
});

router.post("/signup", async(req,res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({email, username});
    
        const registeredUser = await User.register(newUser, password);
        
        console.log(registeredUser);
        req.flash("success", "Welcome to Cozy Clouds");
        res.redirect("/listings");
        
    } catch (error) {
        console.log(error)
        req.flash("error", error.message);
        res.redirect("/signup");
    }
});


// =================== Login route ==============
router.get("/login", (req,res) => {
    res.render("loginForm.ejs");
});

router.post("/login", async(req,res) => {

});


module.exports = router;