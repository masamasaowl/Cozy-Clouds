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

    // insert the data
    // initData is th imported object and .data is the key of it containing all the sampleListings 
    await Listing.insertMany(initData.data);
    console.log("data was added");
}

// call the function
initDB();