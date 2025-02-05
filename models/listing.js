const mongoose = require("mongoose");
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
    ]

});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;