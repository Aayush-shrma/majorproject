const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const bookingController = require("../controllers/bookings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const safeUpload = (req, res, next) => {
    upload.single("listing[image]")(req, res, (err) => {
        if (err) {
            console.warn("Image upload notice:", err.message);
            req.flash("error", `Photo upload notice: ${err.message}. Default image will be used.`);
            return next();
        }
        next();
    });
};

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    safeUpload,
    wrapAsync(listingController.createListing)
  );

// New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Wishlist AJAX Toggle
router.post("/:id/wishlist", wrapAsync(listingController.toggleWishlist));

// Direct Booking for listing
router.post("/:id/book", isLoggedIn, wrapAsync(bookingController.createBooking));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    safeUpload,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroy));

// Edit Listing Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;