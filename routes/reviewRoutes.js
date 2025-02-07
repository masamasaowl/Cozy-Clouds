const express = require("express");
const router = express.Router({mergeParams: true});
// require wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");
// custom error class
const ExpressError = require("../utils/ExpressError.js");
// model
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
// Joi schema
const { reviewSchema} = require("../schema.js");


// server side validation for reviews
const validateReviews = (req,res,next) => {
    let { error } = reviewSchema.validate(req.body);
  
    if(error){
      let errMsg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
};


// =============== Create Route =================
router.post("/",validateReviews, wrapAsync(async(req,res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id).populate("review");
  
    // extract and store the review object from the form
    let newReview = new Review(req.body.review)
    
    console.log(listing.review)
    // store in the review array of the listing
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
  
    res.redirect(`/listings/show/${id}`);
}));
  
// ================== Delete Route =====================
router.delete("/:reviewId", wrapAsync(async(req,res) => {
    let { id, reviewId } = req.params;
    // delete from collection
    await Review.findByIdAndDelete(reviewId)
  
    // delete from the listings.review array
    // $pull finds and delete from an array
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    
    res.redirect(`/listings/show/${id}`)
}));
  
// =======================================================

module.exports = router;
