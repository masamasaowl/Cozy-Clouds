const express = require("express");
// with merge params we extract listing id
const router = express.Router({mergeParams: true});
// require wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");
// model
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
// check is user is logged in
const { isLoggedIn, validateReviews } = require("../middleware.js");


// =============== Create Route =================
router.post("/",isLoggedIn, validateReviews, wrapAsync(async(req,res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id).populate("review");
  
    // extract and store the review object from the form
    let newReview = new Review(req.body.review)
    
    // add author
    newReview.author = req.user._id;
    
    // store in the review array of the listing
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    
    req.flash("success", "Review was added!");
    res.redirect(`/listings/show/${id}`);
}));
  
// ================== Delete Route =====================
router.delete("/:reviewId", isLoggedIn, wrapAsync(async(req,res) => {
    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);

    if(!req.user._id.toString() === review.author._id.toString()){
        req.flash("error", "You don't have permission to perform this operation");
        return res.redirect(`/listings/show/${id}`);
    }

    // delete from collection
    await Review.findByIdAndDelete(reviewId)
  
    // delete from the listings.review array
    // $pull finds and delete from an array
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    
    req.flash("success", "Review was deleted");
    res.redirect(`/listings/show/${id}`)
}));
  
// =====================================================

module.exports = router;
