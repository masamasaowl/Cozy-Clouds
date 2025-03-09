// here the pseudo database is established
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
    .then(() => {
    console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/cozyClouds');
};


const initDB = async() => {
    // delete any previously stored data
    await Listing.deleteMany({});

    // Default geometry for all listings
    const defaultGeometry = {
      type: "Point",
      coordinates: [73.8567437, 18.5204303]
    };
  
    
    initData.data = initData.data.map((obj) => ({
      ...obj, 
      // Add the owner
      owner: "67b36acc2031430240864753", 
      // Add geometry to every listing
      geometry: defaultGeometry,
      // Add category
      // category: "Trending"
    }));

    // insert the data
    // initData is th imported object and .data is the key of it containing all the sampleListings 
    await Listing.insertMany(initData.data);
    console.log("data was added");
}

// call the function
initDB();