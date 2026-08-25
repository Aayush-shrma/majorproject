if (process.env.NODE_ENV != "production") {
    require('dotenv').config({ path: '../.env' });
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");

const MONGO_URL = process.env.ATLASDB_URL || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB for initialization");
}

const sampleReviews = [
    { rating: 5, comment: "Absolutely breathtaking views and world-class hospitality! The host was super friendly and communicative." },
    { rating: 5, comment: "Spotless cleanliness, super fast wifi, and the location could not be better. Will definitely come back again!" },
    { rating: 4, comment: "Wonderful stay! The aesthetic and interiors are gorgeous. Highly recommended for couples and remote work." }
];

const initDB = async () => {
    try {
        await main();

        // 1. Create or Find Demo Admin / Host User
        let demoHost = await User.findOne({ username: "aayush" });
        if (!demoHost) {
            const hostUser = new User({
                username: "aayush",
                email: "aayush@wanderlust.com",
                role: "host",
                bio: "Superhost & Travel Enthusiast based in Vadodara, Gujarat."
            });
            demoHost = await User.register(hostUser, "admin123");
            console.log("Created demo host user: aayush (password: admin123)");
        }

        let demoGuest = await User.findOne({ username: "manoj" });
        if (!demoGuest) {
            const guestUser = new User({
                username: "manoj",
                email: "manoj@wanderlust.com",
                role: "guest",
                bio: "Passionate globetrotter exploring the finest retreats."
            });
            demoGuest = await User.register(guestUser, "guest123");
            console.log("Created demo guest user: manoj (password: guest123)");
        }

        // 2. Clear old listings, reviews, bookings
        await Listing.deleteMany({});
        await Review.deleteMany({});
        await Booking.deleteMany({});

        // 3. Seed Reviews & Listings
        const reviewDocs = [];
        for (let rev of sampleReviews) {
            const r = new Review({
                ...rev,
                author: demoGuest._id,
                createdAt: new Date()
            });
            const savedRev = await r.save();
            reviewDocs.push(savedRev._id);
        }

        const enrichedListings = initData.data.map((obj, idx) => ({
            ...obj,
            owner: demoHost._id,
            reviews: [reviewDocs[idx % reviewDocs.length]],
            createdAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000)
        }));

        const insertedListings = await Listing.insertMany(enrichedListings);
        console.log(`✅ Seeded ${insertedListings.length} premium listings with reviews`);

        // 4. Seed 2 demo bookings for host dashboard
        if (insertedListings.length >= 2) {
            const checkIn1 = new Date();
            checkIn1.setDate(checkIn1.getDate() + 3);
            const checkOut1 = new Date();
            checkOut1.setDate(checkOut1.getDate() + 7);

            const booking1 = new Booking({
                listing: insertedListings[0]._id,
                guest: demoGuest._id,
                checkIn: checkIn1,
                checkOut: checkOut1,
                nights: 4,
                guestsCount: 2,
                basePrice: insertedListings[0].price * 4,
                cleaningFee: 500,
                serviceFee: Math.round(insertedListings[0].price * 4 * 0.05),
                gstAmount: Math.round((insertedListings[0].price * 4 + 500) * 0.18),
                totalPrice: insertedListings[0].price * 4 + 500 + Math.round((insertedListings[0].price * 4 + 500) * 0.18),
                status: "confirmed",
                paymentStatus: "paid",
                paymentMethod: "Razorpay (UPI)",
                bookingCode: "WL-982144"
            });
            await booking1.save();
            console.log("✅ Seeded demo booking for Dashboard");
        }

        console.log("🎉 Database initialization completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Initialization failed:", err);
        process.exit(1);
    }
};

initDB();
