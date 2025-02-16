const express = require("express");
const router = express.Router();
// require wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");
// custom error class
const ExpressError = require("../utils/ExpressError.js");
// model
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
// Joi schema
const { listingSchema } = require("../schema.js");
// check is user is logged in
const { isLoggedIn } = require("../middleware.js");



// validate Listing by Joi
const validateListing = (req,res,next) => {
    let { error } = listingSchema.validate(req.body);
  
    if(error){
      // combining the properties and details from the error msg
      let errMsg = error.details.map((el) => el.message).join(", ");
  
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
};


// =================== Index route ===============
// showcase all the listings
router.get("/",wrapAsync(async(req,res) => {

  let allListings = await Listing.find({});
  res.render("listings.ejs", {allListings});
}));


// ================== Show route ================
// Read operation to view the listing in detail
router.get("/show/:id",wrapAsync(async(req,res) => {
  let {id} = req.params;

  let listing = await Listing.findById(id).populate("review");

  // flash message if listing doesn't exist
  if(!listing){
    req.flash("error", "The listing you requested for doesn't exist ")
    res.redirect("/listings")
  }
  res.render("show.ejs", {listing});
})); 


// =================== Create route ==============
// a form to accept the details
router.get("/new", isLoggedIn,(req,res) => {
    res.render("newListing");
});

// a post request to make changes 
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req,res,next) => {
  // let {title,location} = req.body;
  // instead we store the listing object which has all the values 
  let listing = req.body.listing;

  // directly parse into the collection
  let newListing = new Listing(listing);
  await newListing.save();

  console.log(newListing);
  req.flash("success", "New listing was created!");
  res.redirect("/listings");
}));


// ============== Update route ============
// update form
router.get("/edit/:id",isLoggedIn,wrapAsync(async(req,res) => {
  // extract id
  let {id} = req.params;

  let listing = await Listing.findById(id);

  // flash message if listing doesn't exist
  if(!listing){
    req.flash("error", "The listing you requested for doesn't exist ")
    res.redirect("/listings")
  }
  res.render("edit.ejs", {listing});
})) ;

router.put("/:id",isLoggedIn,validateListing, wrapAsync(async(req,res) => {
  // extract id
  let {id} = req.params;

  // let listing = req.body.listing;

  // instead of this we can be more direct and use our concept of destructuring
  let updatedListing = await Listing.findByIdAndUpdate(
    id,
    {...req.body.listing},
    {runValidators: true, new: true},
  );
  // what this does is the listing object it is deconstructed and the value is stored directly 

  console.log(updatedListing);
  req.flash("success", "listing was edited successfully!");
  res.redirect(`/listings/show/${id}`);
})); 


// ============== Delete route ===============
router.delete("/delete/:id",isLoggedIn, wrapAsync(async(req,res) => {
  let {id} = req.params;

  let deletedListing = await Listing.findByIdAndDelete(id);

  console.log(deletedListing);
  req.flash("success", "listing was deleted");
  res.redirect("/listings");
})); 

// =============================================


module.exports = router;