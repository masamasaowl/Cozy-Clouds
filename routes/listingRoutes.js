const express = require("express");
const router = express.Router();
// require wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");
// check is user is logged in
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// controller for listings
const listingController = require("../controllers/listings.js");

// cloudinary + multer
const { cloudinary, upload } = require('../cloudConfig.js')



// =================== New route ==============
// a form to accept the details
router.get("/new", isLoggedIn, listingController.renderCreateForm);


// ============== Edit route ============
// update form
router.get("/edit/:id",isLoggedIn, isOwner, wrapAsync(listingController.editListings)) ;


// ================ Route to fetch data based on category ========
router.get("/getData", wrapAsync(listingController.switchCategory));


// ===================== Route "/" =========================
router
    .route('/')
    // Index route
    // showcase all the listings
    .get(wrapAsync(listingController.index))
    // Create route
    // a post request to make changes 

    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListings)
    );


// ==================== Route "/:id" ========================
router
    .route("/:id")   
    // Show route
    // Read operation to view the listing in detail
    .get(wrapAsync(listingController.showListing))
    // Update route
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListings))
    // Delete route
    .delete(isLoggedIn, isOwner,  wrapAsync(listingController.deleteListings)); 


// =============================================


module.exports = router;