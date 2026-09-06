const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow("", null),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().allow("", null),
        imageUrl: Joi.string().allow("", null),
        category: Joi.string().allow("", null),
        amenities: Joi.array().items(Joi.string()).allow(null),
        bedrooms: Joi.number().min(1).allow(null),
        beds: Joi.number().min(1).allow(null),
        bathrooms: Joi.number().min(1).allow(null),
        maxGuests: Joi.number().min(1).allow(null),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required(),
});

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        checkIn: Joi.date().iso().required(),
        checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
        guestsCount: Joi.number().min(1).max(20).required(),
        specialRequests: Joi.string().allow("", null),
        paymentMethod: Joi.string().allow("", null),
    }).required(),
});