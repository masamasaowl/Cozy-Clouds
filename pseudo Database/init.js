// here the pseudo database is established
require('dotenv').config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbURL = process.env.MONGO_ATLAS_URL
console.log(dbURL)

main()
    .then(() => {
    console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
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
      owner: "67ceb91b228730a71ec82038", 
      // Add geometry to every listing
      geometry: defaultGeometry,
      // Add category
      // category: "Trending"
    }));

    // insert the data
    // initData is the imported object and .data is the key of it containing all the sampleListings 
    await Listing.insertMany(initData.data);
    console.log("data was added");
}

// call the function
initDB();