// we previously used multer-storage-cloudinary package to store the data temporarily before a direct upload to cloudinary 
// as the package was no longer compatible so we use multer.memoryStorage() for the task

const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// configure the API
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// keep file in memory as buffer which can directly be uploaded to cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Function to upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        // upload_stream directly sends to cloudinary without storing anything locally
        cloudinary.uploader.upload_stream(
            {
                // specify storage location
                folder: "cozyClouds_DEV",              
                allowed_formats: ["png", "jpg", "jpeg"]
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
            // filebuffer parameter receives req.file.buffer which contains the uploaded file data by multer
        ).end(fileBuffer); 
        // .end() send data directly to cloudinary
    });
};

module.exports = {
    cloudinary,
    upload,
    uploadToCloudinary
};