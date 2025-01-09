// ================ BASIC SETUP =================

let express = require ("express");
const app = express();
const port = 8080;
const methodOverride = require ("method-override");
const path = require("path");

// ejs-mate
const ejsMate = require ("ejs-mate");
const mongoose = require('mongoose');
// run command to start mongosh
// brew services start mongodb-community@8.0


// mongoDB setup
main()
    .then(() => {
    console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/cozyClouds');
};

// models
const Listing = require("./models/listing.js")

app.use(methodOverride("_method"));

app.use(express.urlencoded({extended : true}));

app.set("view engine", "ejs");

app.engine("ejs", ejsMate);

app.set("views", path.join(__dirname, "views"));

app.set(express.static(path.join(__dirname, "public")));
app.use('/static', express.static('public'));


app.listen(port, () => {
    console.log("App is listening on port : 8080")
});

//  =============================================

// ==================== Test document ============
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
app.get("/listings", async(req,res) => {
  let allListings = await Listing.find({});
  
  res.render("listings.ejs", {allListings});
});


// ================== Show route ================
// Read operation to view the listing in detail
app.get("/listings/show/:id", async(req,res) => {
  let {id} = req.params;

  let listing = await Listing.findById(id);

  res.render("show.ejs", {listing});
});


// =================== Create route ==============
// a form to accept the details
app.get("/listings/new", (req,res) => {
  res.render("newListing");
});

// a post request to make changes 
app.post("/listings", async(req,res) => {
  // let {title,location} = req.body;

  // instead we store the listing object which has all the values 
  let listing = req.body.listing;

  // directly parse into the collection
  let newListing = new Listing(listing);
  await newListing.save();

  console.log(newListing);

  res.redirect("/listings");
});


// ============== Update route ============
// update form
app.get("/listings/edit/:id", async(req,res) => {
  // extract id
  let {id} = req.params;

  let listing = await Listing.findById(id);

  res.render("edit.ejs", {listing});
});

app.put("/listings/:id", async(req,res) => {
  // extract id
  let {id} = req.params;
  

  // let listing = req.body.listing;
  // intend of this we can be more direct and use our concept of destructuring

  let updatedListing = await Listing.findByIdAndUpdate(

    id,
    {...req.body.listing},
    {runValidators: true, new: true},
  );
  // what this does is the listing object it is deconstructed and the value is stored directly 

  console.log(updatedListing);
  res.redirect(`/listings/show/${id}`);
});


// ============== Delete route ===============
app.delete("/listings/delete/:id", async(req,res) => {
  let {id} = req.params;

  let deletedListing = await Listing.findByIdAndDelete(id);

  console.log(deletedListing);
  res.redirect("/listings");
});