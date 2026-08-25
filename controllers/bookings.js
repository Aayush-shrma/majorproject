const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const { checkIn, checkOut, guestsCount = 1, specialRequests = "", paymentMethod = "Razorpay / UPI" } = req.body.booking;

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
        req.flash("error", "Invalid check-in or check-out dates!");
        return res.redirect(`/listings/${id}`);
    }

    // Calculate nights
    const diffTime = Math.abs(endDate - startDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights < 1) {
        req.flash("error", "Minimum stay is 1 night!");
        return res.redirect(`/listings/${id}`);
    }

    // Check for conflicting confirmed bookings
    const overlapping = await Booking.findOne({
        listing: id,
        status: "confirmed",
        $or: [
            { checkIn: { $lt: endDate, $gte: startDate } },
            { checkOut: { $gt: startDate, $lte: endDate } },
            { checkIn: { $lte: startDate }, checkOut: { $gte: endDate } }
        ]
    });

    if (overlapping) {
        req.flash("error", "These dates are already booked! Please choose different dates.");
        return res.redirect(`/listings/${id}`);
    }

    // Price calculation
    const basePrice = listing.price * nights;
    const cleaningFee = 500;
    const serviceFee = Math.round(basePrice * 0.05);
    const gstAmount = Math.round((basePrice + cleaningFee + serviceFee) * 0.18);
    const totalPrice = basePrice + cleaningFee + serviceFee + gstAmount;

    const newBooking = new Booking({
        listing: id,
        guest: req.user._id,
        checkIn: startDate,
        checkOut: endDate,
        nights,
        guestsCount: Number(guestsCount) || 1,
        basePrice,
        cleaningFee,
        serviceFee,
        gstAmount,
        totalPrice,
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod,
        specialRequests,
    });

    const savedBooking = await newBooking.save();

    req.flash("success", `🎉 Booking confirmed! Reservation Code: ${savedBooking.bookingCode}`);
    res.redirect(`/bookings/${savedBooking._id}`);
};

module.exports.indexUserBookings = async (req, res) => {
    const bookings = await Booking.find({ guest: req.user._id })
        .populate({
            path: "listing",
            populate: { path: "owner" }
        })
        .sort({ createdAt: -1 });

    const upcoming = bookings.filter(b => b.status === "confirmed" && new Date(b.checkOut) >= new Date());
    const past = bookings.filter(b => b.status === "completed" || (b.status === "confirmed" && new Date(b.checkOut) < new Date()));
    const cancelled = bookings.filter(b => b.status === "cancelled");

    res.render("bookings/index.ejs", {
        bookings,
        upcoming,
        past,
        cancelled
    });
};

module.exports.showBookingInvoice = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id)
        .populate({
            path: "listing",
            populate: { path: "owner" }
        })
        .populate("guest");

    if (!booking) {
        req.flash("error", "Reservation not found!");
        return res.redirect("/bookings");
    }

    // Authorize: must be guest or listing owner
    const isGuest = booking.guest && booking.guest._id.equals(req.user._id);
    const isHost = booking.listing && booking.listing.owner && booking.listing.owner._id.equals(req.user._id);

    if (!isGuest && !isHost) {
        req.flash("error", "You do not have permission to view this reservation.");
        return res.redirect("/listings");
    }

    res.render("bookings/show.ejs", { booking });
};

module.exports.cancelBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("listing");

    if (!booking) {
        req.flash("error", "Reservation not found!");
        return res.redirect("/bookings");
    }

    const isGuest = booking.guest.equals(req.user._id);
    const isHost = booking.listing && booking.listing.owner && booking.listing.owner.equals(req.user._id);

    if (!isGuest && !isHost) {
        req.flash("error", "Unauthorized action!");
        return res.redirect("/bookings");
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    await booking.save();

    req.flash("success", "Reservation cancelled successfully. Refund of 100% initiated to original payment source.");
    res.redirect("/bookings");
};

module.exports.hostReservations = async (req, res) => {
    const myListings = await Listing.find({ owner: req.user._id });
    const listingIds = myListings.map(l => l._id);

    const reservations = await Booking.find({ listing: { $in: listingIds } })
        .populate("listing")
        .populate("guest")
        .sort({ createdAt: -1 });

    res.render("host/reservations.ejs", { reservations, myListings });
};
