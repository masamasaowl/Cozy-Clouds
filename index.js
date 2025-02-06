// ================ BASIC SETUP =================

let express = require ("express");
const app = express();
const port = 8080;
const methodOverride = require ("method-override");
const path = require("path");
// require wrapAsync
const wrapAsync = require("./utils/wrapAsync.js");
// custom error class
const ExpressError = require("./utils/ExpressError.js");
// ejs-mate
const ejsMate = require ("ejs-mate");
// models
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
// Joi schema
const {listingSchema, reviewSchema} = require("./schema.js");
// mongoose
const mongoose = require('mongoose');

// mongoDB setup
main()
    .then(() => {
    console.log("connection successful");
    })
    .catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/cozyClouds');
};


// Request-Middlewares
app.use(methodOverride("_method"));

app.use(express.urlencoded({extended : true}));

app.set("view engine", "ejs");

app.engine("ejs", ejsMate);

app.set("views", path.join(__dirname, "views/pages"));

app.set(express.static(path.join(__dirname, "public")));

app.use('/static', express.static('public'));

app.listen(port, () => {
    console.log("App is listening on port : 8080")
});

//  =============================================


// ============ Server Side Validations =========

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



// ================ Test document ===============
// app.get("/testListing", async(req,res) => {
//     let sampleListing = new Listing ({
//       title : "The Angkor Wat",
//       description : "beautiful place",
//       price : 1,
//       location : "Cambodia"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful");
// });


// =================== Home Page =================
app.get("/", (req,res) => {
  res.render("home.ejs");
});


// =================== Index route ===============
// showcase all the listings
app.get("/listings",wrapAsync(async(req,res) => {

  let allListings = await Listing.find({});
  res.render("listings.ejs", {allListings});
}));


// ================== Show route ================
// Read operation to view the listing in detail
app.get("/listings/show/:id",wrapAsync(async(req,res) => {
  let {id} = req.params;

  let listing = await Listing.findById(id).populate("review");

  res.render("show.ejs", {listing});
})); 


// =================== Create route ==============
// a form to accept the details
app.get("/listings/new", (req,res) => {
  res.render("newListing");
});

// a post request to make changes 
app.post("/listings",validateListing, wrapAsync(async(req,res,next) => {

  // validate schema using Joi
  let result = listingSchema.validate(req.body);
  console.log(result);
  if(result.error){
    throw new ExpressError(400, result.error);
  }

  // let {title,location} = req.body;
  // instead we store the listing object which has all the values 
  let listing = req.body.listing;

  // directly parse into the collection
  let newListing = new Listing(listing);
  await newListing.save();

  console.log(newListing);
  res.redirect("/listings");
}));


// ============== Update route ============
// update form
app.get("/listings/edit/:id",wrapAsync(async(req,res) => {
  // extract id
  let {id} = req.params;

  let listing = await Listing.findById(id);

  res.render("edit.ejs", {listing});
})) ;

app.put("/listings/:id",validateListing, wrapAsync(async(req,res) => {
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
  res.redirect(`/listings/show/${id}`);
})); 


// ============== Delete route ===============
app.delete("/listings/delete/:id", wrapAsync(async(req,res) => {
  let {id} = req.params;

  let deletedListing = await Listing.findByIdAndDelete(id);

  console.log(deletedListing);
  res.redirect("/listings");
})); 

// =============================================


// ================= REVIEWS ===================

// =============== Create Route =================
app.post("/listings/review/:id",validateReviews, wrapAsync(async(req,res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id).populate("review");

  // extract and store the review object from the form
  let newReview = new Review(req.body.review)

  // store in the review array of the listing
  listing.review.push(newReview);
  console.log(listing);

  await newReview.save();
  await listing.save();

  console.log(listing.review);
  res.redirect(`/listings/show/${id}`);
}));



// If an undefined route is entered
app.all("*", (req, res) => {
  throw new ExpressError(404,'Page not found');
});


// ================ Error handling middlewares ================
app.use((err,req,res,next)=>{
  // give default values to status and message
  let {statusCode = 500, message = "An Unknown error seems to have been occurred", name} = err;
  
  console.log(err.stack);
  res.status(statusCode).render("error.ejs", {statusCode, message, name})
});