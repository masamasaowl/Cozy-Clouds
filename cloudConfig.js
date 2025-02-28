const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


// configure the API
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// specify storage location
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "cozyClouds_DEV",
        allowedFormats: ["png", "jpg", "jpeg"]
    }
});

module.exports = {
    cloudinary,
    storage
};