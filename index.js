// ================ BASIC SETUP =================

let express = require ("express");
const app = express();
const port = 8080;
const methodOverride = require ("method-override");
const path = require("path");
const mongoose = require('mongoose');
// run command to start mongosh
// sudo mongod --dbpath=/Users/Alok/data/db

// mongoDB setup
main()
    .then(() => {
    console.log("connnection successful");
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
app.set("views", path.join(__dirname, "views"));

app.set(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));


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
//     res.send("succesful");
// });

// =================== Home Page =================
app.get("/", (req,res) => {
  res.render("home.ejs");
});


// =================== Index route ===============
app.get("/listings", async(req,res) => {
  let allListings = await Listing.find({});
  
  res.render("listings.ejs", {allListings});
});


// ================== Show route ================
app.get("/listings/:id", async(req,res) => {
  let {id} = req.params;

  let listing = await Listing.findById(id);

  res.render("show.ejs", {listing});
});
