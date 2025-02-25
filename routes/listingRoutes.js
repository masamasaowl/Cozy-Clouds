const express = require("express");
const router = express.Router();
// require wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");
// check is user is logged in
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// controller for listings
const listingController = require("../controllers/listings.js");


// =================== Index route ===============
// showcase all the listings
router.get("/",wrapAsync(listingController.index));


// ================== Show route ================
// Read operation to view the listing in detail
router.get("/show/:id",wrapAsync(listingController.showListing)); 


// =================== Create route ==============
// a form to accept the details
router.get("/new", isLoggedIn,(req,res) => {
  res.render("newListing");
});

// a post request to make changes 
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListings));


// ============== Edit route ============
// update form
router.get("/edit/:id",isLoggedIn, isOwner, wrapAsync(listingController.editListings)) ;


// ============== Update route ============
router.put("/:id",isLoggedIn, isOwner,validateListing, wrapAsync(listingController.updateListings)); 


// ============== Delete route ===============
router.delete("/delete/:id",isLoggedIn, isOwner,  wrapAsync(listingController.deleteListings)); 

// =============================================


module.exports = router;