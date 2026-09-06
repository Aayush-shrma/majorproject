const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60"
        },
        filename: {
            type: String,
            default: "listingimage"
        },
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            default: [77.2090, 28.6139], // Default: New Delhi
        },
    },
    category: {
        type: String,
        enum: [
            "trending", "rooms", "iconic-cities", "mountains", "castles",
            "amazing-pools", "camping", "farms", "arctic", "domes", "boats", "luxury"
        ],
        default: "trending",
    },
    amenities: {
        type: [String],
        default: ["Wifi", "Air conditioning", "Free parking", "Dedicated workspace"],
    },
    bedrooms: {
        type: Number,
        default: 1,
        min: 1,
    },
    beds: {
        type: Number,
        default: 1,
        min: 1,
    },
    bathrooms: {
        type: Number,
        default: 1,
        min: 1,
    },
    maxGuests: {
        type: Number,
        default: 2,
        min: 1,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual for calculating average rating
listingSchema.virtual("avgRating").get(function() {
    if (!this.reviews || this.reviews.length === 0) return null;
    const validRatings = this.reviews
        .map(r => (typeof r === "object" && r.rating ? Number(r.rating) : null))
        .filter(r => r !== null && !isNaN(r));
    if (validRatings.length === 0) return null;
    const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
    return (sum / validRatings.length).toFixed(1);
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model("Listing", listingSchema);