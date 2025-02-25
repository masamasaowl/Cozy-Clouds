// model
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


// =============== Create Route =================
module.exports.createReview = async(req,res) => {
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
};


// =============== Delete Route =================
module.exports.deleteReview = async(req,res) => {
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
};