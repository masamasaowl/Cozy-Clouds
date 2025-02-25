const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
// controller for users
const userController = require("../controllers/users.js");


// =================== Signup route ==============
router.get("/signup", (req,res) => {
    res.render("signupForm.ejs");
});


router.post("/signup", wrapAsync(userController.signupUser));


// =================== Login route ==============
router.get("/login", (req,res) => {
    res.render("loginForm.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate(
    'local', {
        failureRedirect: '/login',
        failureFlash: true
        }),
        userController.loginUser);


// ================== Logout route ================
router.get("/logout", userController.logoutUser);

module.exports = router;