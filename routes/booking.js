const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateBooking } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

// Guest Bookings List ("My Trips")
router.get("/", isLoggedIn, wrapAsync(bookingController.indexUserBookings));

// Host Reservations Portal
router.get("/host/manage", isLoggedIn, wrapAsync(bookingController.hostReservations));

// Single Booking Confirmation / Invoice
router.get("/:id", isLoggedIn, wrapAsync(bookingController.showBookingInvoice));

// Create Booking for a listing (also mounted under /listings/:id/book in app.js or route)
router.post("/listings/:id/book", isLoggedIn, validateBooking, wrapAsync(bookingController.createBooking));

// Cancel Booking
router.post("/:id/cancel", isLoggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;
