if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const Booking = require("./models/booking.js");

// Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");
const apiRouter = require("./routes/api.js");
const pagesRouter = require("./routes/pages.js");

const isProduction = process.env.NODE_ENV === "production";
const isVercel = Boolean(process.env.VERCEL);
const PORT = process.env.PORT || 3000;
const LOCAL_DB_URL = "mongodb://127.0.0.1:27017/wanderlust";

let dbUrl = getDatabaseUrl();
let sessionSecret = getSessionSecret();

function getDatabaseUrl() {
    const raw = process.env.ATLASDB_URL || process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL;

    if (!raw) {
        if (isProduction && !isVercel) {
            throw new Error("Missing ATLASDB_URL. Add your MongoDB Atlas connection string in Environment Variables.");
        }
        return LOCAL_DB_URL;
    }

    let url = raw.trim();
    // Auto-fix: Ensure the database name is "wanderlust" if not specified in Atlas connection string
    if (url.includes(".mongodb.net/") && url.includes(".mongodb.net/?")) {
        url = url.replace(".mongodb.net/?", ".mongodb.net/wanderlust?");
    } else if (url.includes(".mongodb.net") && !url.includes(".mongodb.net/")) {
        url = url.replace(".mongodb.net", ".mongodb.net/wanderlust?retryWrites=true&w=majority");
    }

    validateMongoUrl(url);
    return url;
}

function validateMongoUrl(url) {
    const lowerUrl = url.toLowerCase();
    const placeholderValues = ["<username>", "<password>", "xxxxx", "your_"];

    if (placeholderValues.some((placeholder) => lowerUrl.includes(placeholder))) {
        throw new Error("ATLASDB_URL still contains example placeholder text. Use the real MongoDB Atlas connection string.");
    }

    try {
        const parsed = new URL(url);
        if (!["mongodb:", "mongodb+srv:"].includes(parsed.protocol)) {
            throw new Error("Invalid protocol");
        }
    } catch (err) {
        throw new Error("ATLASDB_URL is not a valid MongoDB connection string. If your password has special characters, URL-encode them.");
    }
}

function getSessionSecret() {
    return process.env.SESSION_SECRET || "wanderlustmajorsupersecret2026";
}

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

if (isProduction || isVercel) {
    app.set("trust proxy", 1);
}

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session store setup
let sessionStore;
try {
    sessionStore = MongoStore.create({
        mongoUrl: dbUrl,
        crypto: {
            secret: sessionSecret,
        },
        touchAfter: 24 * 3600,
    });
    sessionStore.on("error", (err) => {
        console.error("Mongo session store error:", err.message);
    });
} catch (err) {
    console.error("Session store initialization error:", err.message);
}

const sessionOptions = {
    store: sessionStore,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction && !isVercel ? true : false, // Allows cookies to work smoothly on Vercel preview/production domains
        sameSite: "lax",
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Auto-seed function to ensure listings exist on any deployed instance
let seedInProgress = false;
async function ensureSeedData() {
    if (seedInProgress) return;
    seedInProgress = true;
    try {
        const Listing = require("./models/listing.js");
        const count = await Listing.countDocuments();
        if (count === 0) {
            console.log("No listings found in database. Automatically initializing seed data...");
            const initData = require("./init/data.js");
            const Review = require("./models/review.js");

            let demoHost = await User.findOne({ username: "aayush" });
            if (!demoHost) {
                const hostUser = new User({
                    username: "aayush",
                    email: "aayush@wanderlust.com",
                    role: "host",
                    bio: "Superhost & Travel Enthusiast based in Vadodara, Gujarat."
                });
                demoHost = await User.register(hostUser, "admin123");
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
            }

            const sampleReviews = [
                { rating: 5, comment: "Absolutely breathtaking views and world-class hospitality! The host was super friendly and communicative." },
                { rating: 5, comment: "Spotless cleanliness, super fast wifi, and the location could not be better. Will definitely come back again!" },
                { rating: 4, comment: "Wonderful stay! The aesthetic and interiors are gorgeous. Highly recommended for couples and remote work." }
            ];

            const reviewDocs = [];
            for (let rev of sampleReviews) {
                const r = new Review({ ...rev, author: demoGuest._id, createdAt: new Date() });
                const savedRev = await r.save();
                reviewDocs.push(savedRev._id);
            }

            const enrichedListings = initData.data.map((obj, idx) => ({
                ...obj,
                owner: demoHost._id,
                reviews: [reviewDocs[idx % reviewDocs.length]],
                createdAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000)
            }));

            await Listing.insertMany(enrichedListings);
            console.log(`Auto-seeded ${enrichedListings.length} listings successfully!`);
        }
    } catch (err) {
        console.warn("Auto-seed notice:", err.message);
    } finally {
        seedInProgress = false;
    }
}

// Database Connection Manager (Cached & Serverless-Safe)
let dbConnectionPromise = null;

async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!dbConnectionPromise) {
        dbConnectionPromise = mongoose.connect(dbUrl, {
            serverSelectionTimeoutMS: 10000,
        }).then(async (conn) => {
            console.log("Connected to MongoDB database successfully");
            await ensureSeedData();
            return conn;
        }).catch((err) => {
            dbConnectionPromise = null;
            console.error("MongoDB connection failed:", err.message);
            throw err;
        });
    }

    return dbConnectionPromise;
}

// Middleware to ensure DB connection before handling any request (critical for serverless / Vercel)
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        next(new ExpressError(500, "Database connection failed. Please verify your ATLASDB_URL in environment settings."));
    }
});

// Global template variables middleware
app.use(async (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.search = req.query.search || "";
    res.locals.mapToken = process.env.MAP_TOKEN || "";

    // User wishlist count for navbar badge
    res.locals.wishlistCount = 0;
    if (req.user) {
        try {
            const u = await User.findById(req.user._id);
            if (u && u.wishlist) {
                res.locals.wishlistCount = u.wishlist.length;
            }
        } catch (e) {
            res.locals.wishlistCount = 0;
        }
    }
    next();
});

// Homepage redirect
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Route Mounts
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/bookings", bookingRouter);
app.use("/api", apiRouter);
app.use("/", userRouter);
app.use("/", pagesRouter);

// 404 Handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    console.error("Server error:", err.message || err);
    res.locals.currUser = res.locals.currUser || req.user || null;
    res.locals.success = res.locals.success || [];
    res.locals.error = res.locals.error || [];
    res.locals.wishlistCount = res.locals.wishlistCount || 0;
    res.locals.search = res.locals.search || "";
    res.locals.mapToken = res.locals.mapToken || process.env.MAP_TOKEN || "";
    try {
        res.status(statusCode).render("error.ejs", { message: err.message || message });
    } catch (renderError) {
        console.error("Failed to render error.ejs:", renderError.message);
        res.status(statusCode).send(`<h2>Error ${statusCode}</h2><p>${err.message || message}</p><p><a href="/listings">Return to Listings</a></p>`);
    }
});

// Start server if executed directly (Render, local, VPS)
if (require.main === module) {
    connectToDatabase()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Wanderlust 2.0 server running on port ${PORT}`);
            });
        })
        .catch((err) => {
            console.error("Server startup failed:", err.message);
            process.exit(1);
        });
}

module.exports = app;
