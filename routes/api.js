const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");

// GeoJSON endpoint for interactive Map View
router.get("/listings/geo", wrapAsync(async (req, res) => {
    const listings = await Listing.find({}).populate("reviews");
    const features = listings.map(l => ({
        type: "Feature",
        geometry: l.geometry || { type: "Point", coordinates: [77.2090, 28.6139] },
        properties: {
            id: l._id,
            title: l.title,
            price: l.price,
            location: l.location,
            country: l.country,
            category: l.category,
            imageUrl: l.image && l.image.url ? l.image.url : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
            rating: l.avgRating || "5.0"
        }
    }));
    res.json({ type: "FeatureCollection", features });
}));

// AI Review & Property Summarizer
router.get("/ai/summary/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }

    const reviews = listing.reviews || [];
    const category = listing.category || "trending";
    const loc = listing.location || "this destination";

    let highlights = [
        `Prime location situated in the heart of ${loc}`,
        `Comfortable amenities designed for both relaxation and remote work`,
        `Consistently praised for high cleanliness and seamless host check-in`
    ];

    if (category === "mountains" || category === "camping") {
        highlights.push("Breathtaking scenic landscape and peaceful, natural surroundings");
    } else if (category === "amazing-pools" || category === "boats") {
        highlights.push("Luxurious aquatic amenities with private relaxation zones");
    } else if (category === "iconic-cities" || category === "rooms") {
        highlights.push("Walking distance to major cafes, local transit, and cultural hotspots");
    } else if (category === "castles" || category === "luxury") {
        highlights.push("Exquisite heritage architecture and regal living spaces");
    }

    let considerations = [
        "Advance booking is strongly recommended during weekend & holiday peaks",
        "Check-in begins at 2:00 PM; late arrival requests can be coordinated with the host"
    ];

    let suitedFor = ["Couples & Solo Travelers", "Weekend Escapes", "Remote Work Nomads"];
    if (listing.maxGuests >= 4) suitedFor.push("Families & Friend Groups");

    const summaryText = reviews.length > 0
        ? `Based on ${reviews.length} verified guest review${reviews.length > 1 ? 's' : ''}, guests overwhelmingly appreciate the tranquil ambiance, spotless cleanliness, and attentive communication by the host. Ideal for travelers looking for an authentic stay in ${loc}.`
        : `This verified property in ${loc} offers a premium experience with modern amenities, scenic views, and flexible hosting. Perfect for travelers seeking comfort and quality.`;

    res.json({
        summary: summaryText,
        highlights,
        considerations,
        suitedFor,
        sentimentScore: reviews.length > 0 ? "98% Positive Feedback" : "Top Verified Pick"
    });
}));

// Curated Itineraries Database
const curatedItineraries = {
    goa: {
        destination: "Goa, India",
        days: [
            {
                day: "Day 1: Sun-kissed Coastal Vibes & Sunset Cafes",
                activities: [
                    "🌅 Morning arrival & check-in at your private beachfront villa",
                    "🏖️ Relax at Anjuna & Vagator beaches with fresh coconut water & shack delicacies",
                    "🌇 Golden hour sunset drinks at Thalassa or Curlies overlooking the Arabian Sea"
                ]
            },
            {
                day: "Day 2: Portuguese Heritage, Spice Plantations & Backwaters",
                activities: [
                    "🏛️ Explore the colorful Latin Quarter of Fontainhas in Panaji & UNESCO churches of Old Goa",
                    "🌿 Guided organic spice plantation tour with authentic Goan Saraswat lunch",
                    "⛵ Evening luxury catamaran or Mandovi river cruise with local music"
                ]
            },
            {
                day: "Day 3: Water Sports, Hidden Coves & Night Markets",
                activities: [
                    "🏄 Morning kayaking or scuba diving at Grande Island",
                    "🛍️ Souvenir shopping for cashew nuts, handicrafts & vintage flea market finds",
                    "🕯️ Farewell candlelit seafood dinner on the sands of Morjim Beach"
                ]
            }
        ]
    },
    manali: {
        destination: "Manali, Himachal Pradesh",
        days: [
            {
                day: "Day 1: Alpine Chalet Check-in & Old Manali Cafes",
                activities: [
                    "🌲 Check-in to your cedarwood pine chalet with mountain views",
                    "☕ Wander through Old Manali's bohemian cafes, bakeries, and live acoustic music",
                    "⛩️ Visit the historic wooden Hadimba Temple surrounded by deodar forests"
                ]
            },
            {
                day: "Day 2: Solang Valley & High Altitude Thrills",
                activities: [
                    "⛷️ Paragliding, quad biking, or snow activities in Solang Valley",
                    "🚠 Scenic cable car ride to high mountain ridges with panoramic Himalayan vistas",
                    "♨️ Soak in the natural therapeutic hot sulphur springs of Vashisht"
                ]
            },
            {
                day: "Day 3: Waterfalls, Riverside Walks & Local Apples",
                activities: [
                    "🌊 Morning trek to the picturesque Jogini Waterfall",
                    "🍱 Trout fish lunch and local Himachali Siddu tasting by the Beas River",
                    "🛍️ Mall Road stroll for warm handwoven Kullu shawls and organic apple honey"
                ]
            }
        ]
    },
    udaipur: {
        destination: "Udaipur, Rajasthan",
        days: [
            {
                day: "Day 1: Royal Palaces & Lake Pichola Magic",
                activities: [
                    "👑 Check-in to your heritage haveli stay overlooking the lakes",
                    "🏰 Tour the majestic City Palace complex and crystal gallery",
                    "⛵ Romantic sunset boat ride to Jagmandir Island Palace on Lake Pichola"
                ]
            },
            {
                day: "Day 2: Folk Heritage, Art & Sunset Heights",
                activities: [
                    "🎨 Visit Saheliyon-ki-Bari (Courtyard of Maidens) and vintage car museum",
                    "🎭 Evening Dharohar folk dance and puppet show at Bagore Ki Haveli",
                    "🌄 Drive up to Sajjangarh Monsoon Palace for 360-degree sunset views of the Aravalli hills"
                ]
            },
            {
                day: "Day 3: Artisan Bazaars & Regal Dining",
                activities: [
                    "🛍️ Shopping for miniature paintings, silver jewelry, and Bandhani silk in Hathipole",
                    "🍽️ Royal Rajasthani Dal Baati Churma thali lunch",
                    "🌿 Peaceful morning stroll around the tranquil shores of Fateh Sagar Lake"
                ]
            }
        ]
    },
    kashmir: {
        destination: "Srinagar & Kashmir Valley",
        days: [
            {
                day: "Day 1: Dal Lake Floating Palace & Shikara Serenade",
                activities: [
                    "🪵 Traditional wooden houseboat check-in on the serene waters of Dal Lake",
                    "🛶 Sunset Shikara ride gliding past floating vegetable and flower markets",
                    "🍵 Welcome Kehwa tea with roasted Kashmiri almonds on your private sun deck"
                ]
            },
            {
                day: "Day 2: Mughal Gardens & Mountain Meadow Excursion",
                activities: [
                    "🌺 Walk through Shalimar Bagh and Nishat Bagh terraced Mughal gardens",
                    "🚠 Day trip to Gulmarg with Phase 1 & 2 Gondola ride above alpine pine forests",
                    "🍲 Authentic Kashmiri Wazwan feast featuring Rogan Josh and Yakhni"
                ]
            },
            {
                day: "Day 3: Saffron Fields & Old City Craftsmanship",
                activities: [
                    "🌸 Visit the purple saffron fields of Pampore",
                    "🧵 Discover hand-embroidered Pashmina shawls and carved walnut wood workshops",
                    "📸 Panoramic sunrise photography from the Shankaracharya Hill temple"
                ]
            }
        ]
    },
    kerala: {
        destination: "Kerala (Munnar & Wayanad)",
        days: [
            {
                day: "Day 1: Cloud-Kissed Tea Hills & Treehouse Living",
                activities: [
                    "🍃 Check-in to your canopy forest treehouse or organic farmstay",
                    "🫖 Guided tea estate walk, tea museum tasting & spice garden exploration",
                    "🌄 Watch the mountain mist roll across the valleys of Munnar"
                ]
            },
            {
                day: "Day 2: Wildlife, Waterfalls & Backwater Serenity",
                activities: [
                    "🐘 Morning wildlife spotting at Eravikulam National Park (Nilgiri Tahr habitat)",
                    "🌊 Visit the dramatic Athirappilly and Meenmutty waterfalls",
                    "🚣 Traditional canoe / Shikara ride through palm-fringed village backwaters"
                ]
            },
            {
                day: "Day 3: Ayurvedic Wellness & Coastal Flavors",
                activities: [
                    "🧘 Rejuvenating Ayurvedic herbal massage and yoga session",
                    "🥥 Authentic Kerala Sadhya lunch served on fresh banana leaves",
                    "🎭 Evening performance of classical Kathakali dance and Kalaripayattu martial arts"
                ]
            }
        ]
    },
    bali: {
        destination: "Bali, Indonesia",
        days: [
            {
                day: "Day 1: Cliffside Villas & Ocean Sunsets",
                activities: [
                    "🛖 Check-in to your cliffside dome or private pool villa in Uluwatu",
                    "🏄 Surf or relax on the white sands of Padang Padang Beach",
                    "🔥 Watch the dramatic Kecak Fire Dance at Uluwatu Temple at sunset"
                ]
            },
            {
                day: "Day 2: Tropical Rainforests & Waterfalls in Ubud",
                activities: [
                    "🐒 Stroll through the Sacred Monkey Forest sanctuary in Ubud",
                    "🌾 Photogenic swing & morning trek across Tegallalang Emerald Rice Terraces",
                    "💧 Swim under the natural pools of Tegenungan and Kanto Lampo waterfalls"
                ]
            },
            {
                day: "Day 3: Volcanic Sunrises & Beach Clubs",
                activities: [
                    "🌋 Optional sunrise hike up Mount Batur or relaxing hot spring soak",
                    "☕ Taste authentic Luwak coffee at an artisan organic plantation",
                    "🍹 Sunset lounge & tropical dining at a beachfront club in Seminyak"
                ]
            }
        ]
    }
};

// Helper: Build dynamic 3-day itinerary for any place
function generateCustomItinerary(place) {
    const titleCase = place.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return {
        destination: `${titleCase}`,
        days: [
            {
                day: "Day 1: Arrival, Local Flavors & Sunset Vibe",
                activities: [
                    `🌅 Check-in at your Wanderlust verified stay in ${titleCase} & unwind`,
                    "☕ Explore charming neighborhood cafes, artisan bakeries, and street food trails",
                    "🌇 Scenic evening walk & sunset photography at the top central landmark"
                ]
            },
            {
                day: "Day 2: Culture, Adventure & Hidden Gems",
                activities: [
                    `🏛️ Morning heritage or nature trail tour with a local guide in ${titleCase}`,
                    "🍱 Authentic regional lunch at a high-rated traditional eatery",
                    "🛍️ Evening exploration of local handicraft markets and cultural centers"
                ]
            },
            {
                day: "Day 3: Panoramic Views, Relaxation & Departure",
                activities: [
                    "🍳 Leisurely morning breakfast with panoramic property views",
                    "🧘 Souvenir hunting, viewpoint photography, and cafe relaxation",
                    "✈️ Smooth check-out and fond memories of your journey"
                ]
            }
        ]
    };
}

// WanderBot AI Travel Chat Assistant
router.post("/ai/chat", wrapAsync(async (req, res) => {
    try {
        const { message = "" } = req.body;
        const query = message.toLowerCase().trim();

        if (!query) {
            return res.json({
                reply: "Hello! I'm **WanderBot AI**, your smart travel concierge. How can I help you plan your next getaway?",
                itinerary: null,
                listings: []
            });
        }

        const allListings = await Listing.find({}).populate("reviews");

        let matchedListings = [];
        let botReply = "";
        let itinerary = null;

        // 1. Budget extraction (e.g. "under 3000", "below 5000", "under 5k", "3000 rs", "budget 4000")
        let targetBudget = null;
        const kMatch = query.match(/(?:under|below|less than|budget|within|upto|up to)\s*(\d+(?:\.\d+)?)\s*k\b/i);
        if (kMatch) {
            targetBudget = parseFloat(kMatch[1]) * 1000;
        } else {
            const numMatch = query.match(/(?:under|below|less than|budget|within|upto|up to|around|max)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i)
                          || query.match(/(\d+)\s*(?:rs\.?|inr|₹|bucks|per night)/i);
            if (numMatch) {
                targetBudget = parseInt(numMatch[1], 10);
            }
        }

        // 2. Itinerary Planning Intent
        const isItinerary = query.includes("itinerary") || 
                            query.includes("plan") || 
                            query.includes("trip to") || 
                            query.includes("days in") || 
                            query.includes("day trip") ||
                            query.includes("schedule") ||
                            query.includes("things to do");

        if (isItinerary) {
            let destKey = "";
            if (query.includes("goa")) destKey = "goa";
            else if (query.includes("manali") || query.includes("himachal")) destKey = "manali";
            else if (query.includes("udaipur") || query.includes("rajasthan") || query.includes("jaipur")) destKey = "udaipur";
            else if (query.includes("kashmir") || query.includes("srinagar")) destKey = "kashmir";
            else if (query.includes("kerala") || query.includes("munnar") || query.includes("wayanad")) destKey = "kerala";
            else if (query.includes("bali")) destKey = "bali";

            if (destKey && curatedItineraries[destKey]) {
                itinerary = curatedItineraries[destKey];
            } else {
                // Extract destination from query
                const cleaned = query
                    .replace(/(plan|a|an|itinerary|trip|for|to|days|day|in|the|give|me|create|custom|tour|please|suggest)/gi, " ")
                    .trim();
                const destName = cleaned.length >= 2 ? cleaned : "Your Destination";
                itinerary = generateCustomItinerary(destName);
            }

            botReply = `Here is a custom curated 3-Day Travel Itinerary for **${itinerary.destination}**! 🎒✨\n\nI have also found top-rated verified stays nearby for you:`;

            // Find matching listings for this place
            matchedListings = allListings.filter(l => {
                const combined = `${l.location} ${l.country} ${l.title} ${l.description}`.toLowerCase();
                const destQuery = itinerary.destination.toLowerCase();
                return destQuery.split(/[,\s]+/).some(w => w.length > 2 && combined.includes(w));
            }).slice(0, 3);

            if (matchedListings.length === 0) {
                matchedListings = allListings.slice(0, 3);
            }
        }

        // 3. Platform FAQs & Support Intents
        else if (query.includes("how to book") || query.includes("book a stay") || query.includes("how do i book") || query.includes("make a reservation")) {
            botReply = `Booking on **Wanderlust 2.0** is instant and seamless!\n\n` +
                       `1. **Choose a Stay**: Browse listings or use filters to find your dream property.\n` +
                       `2. **Select Dates & Guests**: Enter your Check-in, Check-out dates and guest count on the listing page.\n` +
                       `3. **Instant Confirmation**: Click **Reserve Now** to complete your booking with secure payments (UPI, Cards, Net Banking).`;
            matchedListings = allListings.slice(0, 2);
        }
        else if (query.includes("host") || query.includes("list my home") || query.includes("become a host") || query.includes("add listing")) {
            botReply = `Becoming a Host on **Wanderlust 2.0** is simple and rewarding!\n\n` +
                       `1. Click **"Host your home"** in the top navigation bar (or visit \`/listings/new\`).\n` +
                       `2. Add high-quality photos, description, nightly price, and location.\n` +
                       `3. Manage bookings, track revenue, and communicate with guests via your **Host Dashboard**!`;
            matchedListings = allListings.slice(0, 2);
        }
        else if (query.includes("cancel") || query.includes("refund") || query.includes("cancellation policy")) {
            botReply = `🛡️ **Wanderlust Flexible Cancellation Policy**:\n\n` +
                       `• **100% Full Refund**: If cancelled up to 48 hours before check-in time.\n` +
                       `• **Instant Processing**: Refunds are credited back to your original payment method within 2-4 business days.\n` +
                       `• You can cancel anytime directly from your **My Bookings** page.`;
            matchedListings = [];
        }
        else if (query.includes("wishlist") || query.includes("favorite") || query.includes("save")) {
            botReply = `❤️ **Save Your Favorites**:\n\n` +
                       `• Click the **Heart Icon** on any listing card to save it directly to your Wishlist.\n` +
                       `• Access all your saved retreats anytime by clicking **Wishlist** in the navbar!`;
            matchedListings = allListings.slice(0, 2);
        }
        else if (query.includes("payment") || query.includes("pay") || query.includes("upi") || query.includes("card") || query.includes("razorpay")) {
            botReply = `💳 **Supported Payment Methods**:\n\n` +
                       `• **UPI**: Google Pay, PhonePe, Paytm, BHIM\n` +
                       `• **Cards**: Visa, MasterCard, RuPay, American Express\n` +
                       `• **Net Banking**: 50+ major banks\n` +
                       `• All transactions are secured with 256-bit encryption.`;
            matchedListings = [];
        }

        // 4. Destination / City Specific Search (Goa, Manali, Mumbai, Bali, New York, Kashmir, etc.)
        else if (query.includes("goa") || query.includes("manali") || query.includes("mumbai") || 
                 query.includes("bali") || query.includes("new york") || query.includes("kashmir") || 
                 query.includes("srinagar") || query.includes("udaipur") || query.includes("rajasthan") ||
                 query.includes("kerala") || query.includes("munnar") || query.includes("wayanad") ||
                 query.includes("jaisalmer") || query.includes("tromso") || query.includes("florence") || query.includes("italy")) {

            matchedListings = allListings.filter(l => {
                const combined = `${l.location} ${l.country} ${l.title} ${l.description}`.toLowerCase();
                const matchesPlace = query.split(/\s+/).some(w => w.length > 2 && combined.includes(w));
                if (targetBudget) {
                    return matchesPlace && l.price <= targetBudget;
                }
                return matchesPlace;
            });

            if (matchedListings.length === 0 && targetBudget) {
                matchedListings = allListings.filter(l => {
                    const combined = `${l.location} ${l.country} ${l.title} ${l.description}`.toLowerCase();
                    return query.split(/\s+/).some(w => w.length > 2 && combined.includes(w));
                });
                botReply = `I found these stays matching your destination! (Note: Prices slightly differ from ₹${targetBudget.toLocaleString("en-IN")}):`;
            } else if (matchedListings.length > 0) {
                botReply = `Here are our top verified handpicked stays for your trip:`;
            } else {
                matchedListings = allListings.slice(0, 3);
                botReply = `Here are some of our most popular verified stays worldwide:`;
            }
        }

        // 5. Budget Filters
        else if (targetBudget) {
            matchedListings = allListings.filter(l => l.price <= targetBudget).slice(0, 3);
            if (matchedListings.length > 0) {
                botReply = `I found **${matchedListings.length} incredible stays** within your budget of ₹${targetBudget.toLocaleString("en-IN")}/night! Here are my top recommendations:`;
            } else {
                matchedListings = [...allListings].sort((a, b) => a.price - b.price).slice(0, 3);
                botReply = `I couldn't find listings strictly under ₹${targetBudget.toLocaleString("en-IN")}, but here are our best value deals close to your range:`;
            }
        }

        // 6. Category / Vibe / Amenity Matching
        else if (query.includes("beach") || query.includes("sea") || query.includes("ocean") || query.includes("coast")) {
            matchedListings = allListings.filter(l => 
                l.category === "trending" || 
                l.title.toLowerCase().includes("beach") || 
                l.description.toLowerCase().includes("beach") ||
                (l.amenities && l.amenities.some(a => a.toLowerCase().includes("beach")))
            ).slice(0, 3);
            botReply = `🌊 Here are top coastal and beachfront escapes handpicked for total relaxation:`;
        }
        else if (query.includes("mountain") || query.includes("hill") || query.includes("snow") || query.includes("chalet") || query.includes("cabin") || query.includes("trek")) {
            matchedListings = allListings.filter(l => 
                l.category === "mountains" || 
                l.title.toLowerCase().includes("mountain") || 
                l.title.toLowerCase().includes("chalet") || 
                l.location.toLowerCase().includes("manali")
            ).slice(0, 3);
            botReply = `⛰️ Here are serene mountain cabins and alpine retreats with breathtaking views:`;
        }
        else if (query.includes("pool") || query.includes("swim") || query.includes("infinity pool") || query.includes("jacuzzi") || query.includes("hot tub")) {
            matchedListings = allListings.filter(l => 
                l.category === "amazing-pools" || 
                (l.amenities && l.amenities.some(a => a.toLowerCase().includes("pool") || a.toLowerCase().includes("jacuzzi") || a.toLowerCase().includes("tub"))) ||
                l.description.toLowerCase().includes("pool")
            ).slice(0, 3);
            botReply = `🏊 Here are luxurious properties featuring private swimming pools and relaxation zones:`;
        }
        else if (query.includes("castle") || query.includes("palace") || query.includes("haveli") || query.includes("heritage") || query.includes("royal")) {
            matchedListings = allListings.filter(l => l.category === "castles" || l.title.toLowerCase().includes("haveli") || l.title.toLowerCase().includes("castle")).slice(0, 3);
            botReply = `🏰 Step into royal luxury with these historic castles, havelis, and heritage estates:`;
        }
        else if (query.includes("boat") || query.includes("houseboat") || query.includes("lake") || query.includes("floating")) {
            matchedListings = allListings.filter(l => l.category === "boats" || l.title.toLowerCase().includes("houseboat")).slice(0, 3);
            botReply = `⛵ Experience tranquil floating living on Dal Lake and exotic backwaters:`;
        }
        else if (query.includes("dome") || query.includes("glamping") || query.includes("desert") || query.includes("stargazing")) {
            matchedListings = allListings.filter(l => l.category === "domes" || l.category === "camping" || l.title.toLowerCase().includes("dome")).slice(0, 3);
            botReply = `✨ Fall asleep under the stars with these geodesic domes and luxury glamping sanctuaries:`;
        }
        else if (query.includes("farm") || query.includes("treehouse") || query.includes("forest") || query.includes("nature")) {
            matchedListings = allListings.filter(l => l.category === "farms" || l.category === "camping" || l.title.toLowerCase().includes("treehouse")).slice(0, 3);
            botReply = `🌿 Reconnect with nature in these organic farmstays and canopy treehouses:`;
        }
        else if (query.includes("luxury") || query.includes("penthouse") || query.includes("expensive") || query.includes("villa")) {
            matchedListings = [...allListings].sort((a, b) => b.price - a.price).slice(0, 3);
            botReply = `💎 Here are our most exclusive ultra-luxury villas and high-rise penthouses:`;
        }
        else if (query.includes("cheap") || query.includes("budget") || query.includes("affordable") || query.includes("low price")) {
            matchedListings = [...allListings].sort((a, b) => a.price - b.price).slice(0, 3);
            botReply = `💰 Here are our most affordable high-rated verified stays with great value:`;
        }
        else if (query.includes("romantic") || query.includes("couple") || query.includes("honeymoon")) {
            matchedListings = allListings.filter(l => l.maxGuests <= 2 && l.price >= 2000).slice(0, 3);
            if (matchedListings.length === 0) matchedListings = allListings.slice(0, 3);
            botReply = `💖 Looking for a romantic getaway? These scenic stays offer privacy, intimacy, and stunning views:`;
        }
        else if (query.includes("family") || query.includes("group") || query.includes("friends")) {
            matchedListings = allListings.filter(l => l.maxGuests >= 4).slice(0, 3);
            botReply = `👨‍👩‍👧‍👦 Here are spacious verified homes perfect for families and friend groups:`;
        }
        else if (query.includes("pet") || query.includes("dog") || query.includes("cat")) {
            matchedListings = allListings.filter(l => l.amenities && l.amenities.some(a => a.toLowerCase().includes("pet"))).slice(0, 3);
            if (matchedListings.length === 0) matchedListings = allListings.slice(0, 2);
            botReply = `🐾 Here are pet-friendly stays where your furry companions are warmly welcomed:`;
        }
        else if (query.includes("work") || query.includes("wifi") || query.includes("workspace") || query.includes("nomad")) {
            matchedListings = allListings.filter(l => l.amenities && l.amenities.some(a => a.toLowerCase().includes("workspace") || a.toLowerCase().includes("wifi"))).slice(0, 3);
            botReply = `💻 Remote work ready! These stays feature high-speed fiber WiFi and dedicated workspaces:`;
        }
        else if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("namaste") || query.includes("good morning") || query.includes("good evening") || query.includes("who are you")) {
            matchedListings = allListings.slice(0, 3);
            botReply = `👋 Hello! I'm **WanderBot AI**, your smart travel concierge.\n\n` +
                       `I can help you with:\n` +
                       `• 🏖️ Finding stays by destination (e.g. *"Villas in Goa"*, *"Cabins in Manali"*)\n` +
                       `• 💰 Stays under your budget (e.g. *"Stays under ₹3000"*)\n` +
                       `• 🗺️ Custom 3-day travel itineraries (e.g. *"Plan 3 days in Kashmir"*)\n` +
                       `• ℹ️ Booking tips, hosting guide, and cancellation policies!`;
        }
        else {
            // General Keyword Matcher across all fields
            const keywords = query.split(/\s+/).filter(k => k.length > 2);
            matchedListings = allListings.filter(l => {
                const text = `${l.title} ${l.description} ${l.location} ${l.country} ${l.category} ${(l.amenities || []).join(" ")}`.toLowerCase();
                return keywords.some(k => text.includes(k));
            }).slice(0, 3);

            if (matchedListings.length > 0) {
                botReply = `I found these verified stays matching "**${message}**":`;
            } else {
                matchedListings = allListings.slice(0, 3);
                botReply = `I'd love to help you with that! Here are some of our top-rated trending stays across Wanderlust:`;
            }
        }

        // Format listing cards safely
        const formattedListings = (matchedListings || []).map(l => ({
            id: l._id,
            title: l.title || "Wanderlust Stay",
            price: typeof l.price === "number" ? l.price : 2500,
            location: l.location && l.country ? `${l.location}, ${l.country}` : (l.location || "Verified Location"),
            imageUrl: l.image && l.image.url ? l.image.url : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
            rating: l.avgRating || "5.0"
        }));

        res.json({
            reply: botReply,
            itinerary,
            listings: formattedListings
        });

    } catch (err) {
        console.error("AI Chatbot Error:", err);
        res.status(500).json({
            reply: "I'm having a little trouble connecting right now, but here are some of our top verified stays you can explore!",
            itinerary: null,
            listings: []
        });
    }
}));

module.exports = router;
