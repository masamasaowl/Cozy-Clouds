const express = require("express");
// with merge params we extract listing id
const router = express.Router({mergeParams: true});
// require wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");
// check is user is logged in
const { isLoggedIn, validateReviews } = require("../middleware.js");
// controller for reviews
const reviewController = require("../controllers/reviews.js");


// =============== Create Route =================
router.post("/",isLoggedIn, validateReviews, wrapAsync(reviewController.createReview));
  
// ================== Delete Route =====================
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.deleteReview));
  
// =====================================================

module.exports = router;
