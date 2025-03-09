const mongoose = require("mongoose");
const Review = require("./review"); 
const { required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    image : {
        filename: {
            type: String,
            default: "listing image"
        },
        url: {
            type: String,
            default : "https://plus.unsplash.com/premium_photo-1661963188432-5de8a11f21a7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

            // for an empty image
            set : (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1661963188432-5de8a11f21a7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
        },  
    },
    price : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
    },
    // one to few relation between the listing and its reviews
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    geometry: {
        type: {
            type: String,
            default: "Point" 
        }, 
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
        type: String,
        enum: ["Mountains", "Snowy peaks", "Trending", "Cities", "Lush green", "Amazing pools", "Beaches"],
        default: "Trending"
    }
});

// a mongoose middleware to delete all reviews of a listing is deleted
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.review }});
    }
});

module.exports = mongoose.model("Listing", listingSchema);