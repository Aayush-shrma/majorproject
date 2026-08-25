const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    guest: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    nights: {
        type: Number,
        required: true,
        min: 1,
    },
    guestsCount: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
    basePrice: {
        type: Number,
        required: true,
    },
    cleaningFee: {
        type: Number,
        default: 500,
    },
    serviceFee: {
        type: Number,
        default: 350,
    },
    gstAmount: {
        type: Number,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["confirmed", "completed", "cancelled"],
        default: "confirmed",
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "pending", "refunded"],
        default: "paid",
    },
    paymentMethod: {
        type: String,
        default: "Razorpay / UPI",
    },
    paymentId: {
        type: String,
        default: () => "PAY_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
    bookingCode: {
        type: String,
        unique: true,
        default: () => "WL-" + Math.floor(100000 + Math.random() * 900000),
    },
    specialRequests: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Booking", bookingSchema);
