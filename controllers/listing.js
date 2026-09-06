const Listing = require("../models/listing");
const User = require("../models/user");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN || "";
let geocodingClient = null;
if (mapToken) {
    try {
        geocodingClient = mbxGeocoding({ accessToken: mapToken });
    } catch (e) {
        console.log("Mapbox client init error:", e.message);
    }
}

module.exports.index = async (req, res) => {
    const { category, search, minPrice, maxPrice, guests, bedrooms, amenities, sort } = req.query;
    let filter = {};

    // Category filter
    if (category && category !== "all") {
        filter.category = category;
    }

    // Text search filter
    if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
            { title: regex },
            { location: regex },
            { country: regex },
            { description: regex },
        ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice && !isNaN(Number(minPrice))) filter.price.$gte = Number(minPrice);
        if (maxPrice && !isNaN(Number(maxPrice))) filter.price.$lte = Number(maxPrice);
    }

    // Guests filter
    if (guests && !isNaN(Number(guests))) {
        filter.maxGuests = { $gte: Number(guests) };
    }

    // Bedrooms filter
    if (bedrooms && !isNaN(Number(bedrooms))) {
        filter.bedrooms = { $gte: Number(bedrooms) };
    }

    // Amenities filter
    if (amenities) {
        const amenitiesList = Array.isArray(amenities) ? amenities : [amenities];
        if (amenitiesList.length > 0) {
            filter.amenities = { $all: amenitiesList };
        }
    }

    // Sorting
    let sortQuery = { createdAt: -1 };
    if (sort === "price_asc") sortQuery = { price: 1 };
    else if (sort === "price_desc") sortQuery = { price: -1 };
    else if (sort === "newest") sortQuery = { createdAt: -1 };

    let allListings = await Listing.find(filter).populate("reviews").sort(sortQuery);

    // If sorting by rating
    if (sort === "rating") {
        allListings = allListings.sort((a, b) => {
            const rA = Number(a.avgRating) || 0;
            const rB = Number(b.avgRating) || 0;
            return rB - rA;
        });
    }

    // User's wishlist listing IDs as string set for quick lookup
    let userWishlistIds = [];
    if (req.user) {
        const fullUser = await User.findById(req.user._id);
        if (fullUser && fullUser.wishlist) {
            userWishlistIds = fullUser.wishlist.map(id => id.toString());
        }
    }

    res.render("listings/index", {
        allListings,
        category: category || null,
        search: search || '',
        query: req.query,
        userWishlistIds,
        mapToken: process.env.MAP_TOKEN || ""
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    // Check if in user's wishlist
    let isWishlisted = false;
    if (req.user) {
        const fullUser = await User.findById(req.user._id);
        if (fullUser && fullUser.wishlist) {
            isWishlisted = fullUser.wishlist.some(wId => wId.toString() === listing._id.toString());
        }
    }

    res.render("listings/show", {
        listing,
        isWishlisted,
        mapToken: process.env.MAP_TOKEN || ""
    });
};

module.exports.createListing = async (req, res, next) => {
    let geometry = { type: "Point", coordinates: [77.2090, 28.6139] }; // Default coordinates

    if (geocodingClient && req.body.listing && req.body.listing.location) {
        try {
            let response = await geocodingClient.forwardGeocode({
                query: `${req.body.listing.location}, ${req.body.listing.country || ''}`,
                limit: 1
            }).send();

            if (response && response.body && response.body.features && response.body.features.length > 0) {
                geometry = response.body.features[0].geometry;
            }
        } catch (err) {
            console.log("Geocoding notice (using fallback):", err.message);
        }
    }

    let url = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60";
    let filename = "listingimage";

    if (req.file && req.file.path) {
        url = req.file.path;
        filename = req.file.filename || "listingimage";
    } else if (req.body.listing && req.body.listing.imageUrl && req.body.listing.imageUrl.trim()) {
        url = req.body.listing.imageUrl.trim();
        filename = "custom_url";
    }

    const listingData = { ...req.body.listing };
    delete listingData.imageUrl;

    // Format amenities
    if (listingData.amenities && typeof listingData.amenities === "string") {
        listingData.amenities = listingData.amenities.split(",").map(a => a.trim()).filter(Boolean);
    }

    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = geometry;

    let savedListing = await newListing.save();

    req.flash("success", "✨ New Listing Created Successfully!");
    res.redirect(`/listings/${savedListing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    if (originalImageUrl.includes("/upload")) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    }
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listingData = { ...req.body.listing };
    const customUrl = listingData.imageUrl && listingData.imageUrl.trim();
    delete listingData.imageUrl;

    // Format amenities
    if (listingData.amenities && typeof listingData.amenities === "string") {
        listingData.amenities = listingData.amenities.split(",").map(a => a.trim()).filter(Boolean);
    }

    let listing = await Listing.findByIdAndUpdate(id, listingData, { new: true });

    if (typeof req.file !== "undefined" && req.file && req.file.path) {
        let url = req.file.path;
        let filename = req.file.filename || "listingimage";
        listing.image = { url, filename };
        await listing.save();
    } else if (customUrl) {
        listing.image = { url: customUrl, filename: "custom_url" };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

// Wishlist AJAX Toggle
module.exports.toggleWishlist = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: "Please log in to save to wishlist" });
    }

    const { id } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const index = user.wishlist.indexOf(id);
    let saved = false;

    if (index > -1) {
        user.wishlist.splice(index, 1);
        saved = false;
    } else {
        user.wishlist.push(id);
        saved = true;
    }

    await user.save();

    return res.json({
        success: true,
        saved,
        count: user.wishlist.length,
        message: saved ? "Added to wishlist" : "Removed from wishlist"
    });
};