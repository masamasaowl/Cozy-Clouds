const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
// controller for users
const userController = require("../controllers/users.js");


// ===================== Route "/signup" =========================
router
    .route("/signup")
    // Signup route
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signupUser));


// ===================== Route "/login" =========================    
router
    .route("/login")
    // Login route
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate(
        'local',
        {
            failureRedirect: '/login',
            failureFlash: true
        }),
        userController.loginUser
    );


// ==================== Logout route ====================
router.get("/logout", userController.logoutUser);


module.exports = router;