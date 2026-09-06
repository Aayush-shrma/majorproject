const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "gkdwtkoh",
    api_key: process.env.CLOUD_API_KEY || "554736461434243",
    api_secret: process.env.CLOUD_API_SECRET || "K6t0wdGMfNiUBbSd96nvj8ywOdI"
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowed_formats: ["png", "jpg", "jpeg", "webp"],
  },
});

module.exports = { cloudinary,storage }