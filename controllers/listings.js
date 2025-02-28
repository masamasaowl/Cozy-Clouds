// model
const { uploadToCloudinary } = require("../cloudConfig.js");
const Listing = require("../models/listing.js");
// to make HTTP request to Google Maps
const axios = require("axios");


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

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  res.render("show.ejs", {listing, apiKey });
};


// ================== Create route ================
module.exports.renderCreateForm = (req,res) => {
  res.render("newListing");
};


module.exports.createListings = async(req,res,next) => {
  // upload the image the image to cloudinary
  const uploadedImg = await uploadToCloudinary(req.file.buffer);

  // parse url and filename as saved on cloudinary
  let url = uploadedImg.secure_url;
  let filename = uploadedImg.public_id;

  // let {title,location} = req.body;
  // instead we store the listing object which has all the values 
  let listing = req.body.listing;

  // directly parse into the collection
  let newListing = new Listing(listing);
  // add user information
  newListing.owner = req.user._id;
  // save image url and filename
  newListing.image = { url,filename };

  // geocoding the location
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  // sending the location of newListing to be geocoded by Google Maps
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(newListing.location)}&key=${apiKey}`;

  const response = await axios.get(geocodeUrl);
  const { data } = response;

  // check if correct response was returned
  if (data.status === 'OK') {
    // pull coordinates
    const coordinates = data.results[0].geometry.location;

    // save coordinates in the database
    newListing.geometry = {
      type: "Point",
      coordinates: [coordinates.lng, coordinates.lat]
    };
  } else {
    console.error('Geocoding error:', data.status);
    req.flash("error", "Invalid location. Please try again.");
    return res.redirect("/listings/new");
  }
    
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

  // displaying a scaled down listing image 
  let originalImageUrl = listing.image.url;

  // replace cloudinary url to scale down
  originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_140');

  res.render("edit.ejs", {listing, originalImageUrl});
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

  // save image in the updated listing
  if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;

    updatedListing.image = { url,filename };
    await updatedListing.save();
  }

  console.log(updatedListing);
  req.flash("success", "listing was edited successfully!");
  res.redirect(`/listings/${id}`);
};


// ============== Delete route ============
module.exports.deleteListings = async(req,res) => {
    let {id} = req.params;
  
    let deletedListing = await Listing.findByIdAndDelete(id);
  
    console.log(deletedListing);
    req.flash("success", "listing was deleted");
    res.redirect("/listings");
};