if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");
const apiRouter = require("./routes/api.js");
const pagesRouter = require("./routes/pages.js");

// DB URL with safe local MongoDB fallback
const dbUrl = process.env.ATLASDB_URL || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
const sessionSecret = process.env.SESSION_SECRET || "wanderlustmajorsupersecret2026";

// Connect DB
main()
    .then(() => console.log("🚀 Connected to MongoDB Database successfully"))
    .catch(err => {
        console.log("MongoDB connection error:", err.message);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

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
        console.log("Mongo session store warning (falling back to memory):", err.message);
    });
} catch (e) {
    console.log("Session store initialization fallback");
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

// Global template variables middleware
app.use(async (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.search = req.query.search || '';
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
    res.status(statusCode).render("error.ejs", { message });
});

// Server listener
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🌟 Wanderlust 2.0 Server running smoothly on http://localhost:${PORT}`);
});