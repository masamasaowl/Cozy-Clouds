// model
const Listing = require("../models/listing.js");


// =================== Index route ===============
module.exports.index = async(req,res) => {
    let allListings = await Listing.find({});
    res.render("listings.ejs", {allListings});
};


// ================== Show route ================
module.exports.showListing = async(req,res) => {
  let {id} = req.params;

  let listing = await Listing.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author"
      },
    })
    .populate("owner");

  // flash message if listing doesn't exist
  if(!listing){
    req.flash("error", "The listing you requested for doesn't exist ")
    res.redirect("/listings")
  }
  res.render("show.ejs", {listing});
};


// ================== Create route ================
module.exports.createListings = async(req,res,next) => {
  // let {title,location} = req.body;
  // instead we store the listing object which has all the values 
  let listing = req.body.listing;

  // directly parse into the collection
  let newListing = new Listing(listing);
  // add user information
  newListing.owner = req.user._id;
  await newListing.save();

  console.log(newListing);
  req.flash("success", "New listing was created!");
  res.redirect("/listings");
};


// ============== Edit route ============
// the edit form
module.exports.editListings = async(req,res) => {
  // extract id
  let {id} = req.params;

  let listing = await Listing.findById(id);

  // flash message if listing doesn't exist
  if(!listing){
    req.flash("error", "The listing you requested for doesn't exist ")
    res.redirect("/listings")
  }
  res.render("edit.ejs", {listing});
};


// ============== Update route ============
module.exports.updateListings = async(req,res) => {
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
};


// ============== Delete route ============
module.exports.deleteListings = async(req,res) => {
    let {id} = req.params;
  
    let deletedListing = await Listing.findByIdAndDelete(id);
  
    console.log(deletedListing);
    req.flash("success", "listing was deleted");
    res.redirect("/listings");
};