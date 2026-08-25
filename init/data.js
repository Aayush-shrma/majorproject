const sampleListings = [
  {
    title: "Cozy Beachfront Villa with Private Pool",
    description: "Escape to this charming beachfront villa with direct access to golden sands and breathtaking sunset views over the Arabian Sea. Features private infinity pool, outdoor lounge, and chef's kitchen.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80"
    },
    price: 4500,
    location: "Anjuna, Goa",
    country: "India",
    category: "trending",
    amenities: ["Wifi", "Swimming Pool", "Air conditioning", "Free parking", "Kitchen", "Beach access", "Dedicated workspace"],
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    maxGuests: 6,
    geometry: { type: "Point", coordinates: [73.7431, 15.5816] }
  },
  {
    title: "Modern Glasshouse Loft in Downtown",
    description: "Stay in the heart of Manhattan in this architect-designed loft with floor-to-ceiling panoramic glass windows, designer furniture, and high-speed fiber internet for remote professionals.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    },
    price: 3200,
    location: "New York City",
    country: "United States",
    category: "iconic-cities",
    amenities: ["Wifi", "Air conditioning", "Dedicated workspace", "Elevator", "Kitchen", "Gym access"],
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    geometry: { type: "Point", coordinates: [-74.0060, 40.7128] }
  },
  {
    title: "Snowview Cedar Chalet & Pine Cabin",
    description: "Unplug and unwind in this authentic cedarwood alpine cabin nestled in the snow-dusted pine forests. Includes indoor stone fireplace, private cedar hot tub, and panoramic mountain deck.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80"
    },
    price: 2800,
    location: "Manali, Himachal Pradesh",
    country: "India",
    category: "mountains",
    amenities: ["Wifi", "Indoor Fireplace", "Mountain view", "Free parking", "Bonfire pit", "Heating"],
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    maxGuests: 5,
    geometry: { type: "Point", coordinates: [77.1887, 32.2396] }
  },
  {
    title: "Historic Medieval Castle on Rolling Hills",
    description: "Step into royal heritage in this meticulously restored 16th-century Tuscan castle estate surrounded by vineyards, olive groves, and historic Renaissance architecture.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?auto=format&fit=crop&w=1200&q=80"
    },
    price: 8500,
    location: "Florence",
    country: "Italy",
    category: "castles",
    amenities: ["Wifi", "Swimming Pool", "Historic garden", "Wine cellar", "Free parking", "Air conditioning"],
    bedrooms: 5,
    beds: 6,
    bathrooms: 5,
    maxGuests: 10,
    geometry: { type: "Point", coordinates: [11.2558, 43.7696] }
  },
  {
    title: "Luxury Cliffside Dome with Infinity Pool",
    description: "Experience ultimate luxury in this geodesic dome perched high on the cliffs of Bali. Features a private heated infinity pool, unobstructed ocean sunsets, and outdoor sunken bath.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    },
    price: 5200,
    location: "Uluwatu, Bali",
    country: "Indonesia",
    category: "amazing-pools",
    amenities: ["Wifi", "Swimming Pool", "Ocean view", "Air conditioning", "Free breakfast", "Outdoor bath"],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    geometry: { type: "Point", coordinates: [115.0884, -8.8291] }
  },
  {
    title: "Wilderness Stargazing Geodesic Dome",
    description: "Fall asleep under millions of stars through the crystal clear panoramic ceiling. Fully solar-powered glamping sanctuary equipped with plush king bed and artisan stove.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80"
    },
    price: 1900,
    location: "Jaisalmer, Rajasthan",
    country: "India",
    category: "domes",
    amenities: ["Free parking", "Desert safari", "Stargazing deck", "Bonfire", "Authentic Rajasthani meals"],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    geometry: { type: "Point", coordinates: [70.9083, 26.9157] }
  },
  {
    title: "Luxury Houseboat on Dal Lake",
    description: "Handcrafted carved walnut wood floating palace on the tranquil waters of Dal Lake. Enjoy authentic Kashmiri hospitality, Shikara rides, and Himalayan reflections.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80"
    },
    price: 3600,
    location: "Srinagar, Kashmir",
    country: "India",
    category: "boats",
    amenities: ["Wifi", "Heating", "Lake view", "Shikara transfer", "Authentic meals", "Balcony"],
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    maxGuests: 6,
    geometry: { type: "Point", coordinates: [74.8723, 34.1167] }
  },
  {
    title: "Scandinavian Nordic Cabin in the Arctic",
    description: "Direct view of the Aurora Borealis / Northern Lights from your warm, heated designer wooden cabin in the Finnish wilderness with traditional wood-fired sauna.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80"
    },
    price: 6800,
    location: "Tromso",
    country: "Norway",
    category: "arctic",
    amenities: ["Wifi", "Sauna", "Aurora viewing glass", "Heating", "Fireplace", "Free parking"],
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    maxGuests: 4,
    geometry: { type: "Point", coordinates: [18.9553, 69.6492] }
  },
  {
    title: "Organic Farmstay & Orchard Cottage",
    description: "Rejuvenate in this tranquil farmstead surrounded by organic apple orchards and spice plantations. Farm-to-table breakfast, animal encounters, and fresh country air.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=80"
    },
    price: 1500,
    location: "Wayanad, Kerala",
    country: "India",
    category: "farms",
    amenities: ["Wifi", "Organic farm tour", "Free breakfast", "Nature trails", "Pet friendly", "Free parking"],
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    geometry: { type: "Point", coordinates: [76.1320, 11.6854] }
  },
  {
    title: "Eco Forest Treehouse & Canopy Suite",
    description: "Elevated 35 feet above the rainforest canopy. Wake up to the soothing chorus of tropical birds and gentle mountain breezes in this sustainable bamboo marvel.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"
    },
    price: 2400,
    location: "Munnar, Kerala",
    country: "India",
    category: "camping",
    amenities: ["Wifi", "Rainforest view", "Balcony", "Free breakfast", "Birdwatching gear"],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    geometry: { type: "Point", coordinates: [77.0595, 10.0889] }
  },
  {
    title: "Ultra-Luxury Penthouse with Skyline View",
    description: "Opulent high-rise penthouse featuring private rooftop hot tub, designer marble interiors, bespoke cocktail bar, and 360-degree city skyline vistas.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=1200&q=80"
    },
    price: 9500,
    location: "Marine Drive, Mumbai",
    country: "India",
    category: "luxury",
    amenities: ["Wifi", "Jacuzzi", "Skyline view", "Air conditioning", "Elevator", "Dedicated workspace", "Gym access"],
    bedrooms: 3,
    beds: 3,
    bathrooms: 4,
    maxGuests: 6,
    geometry: { type: "Point", coordinates: [72.8223, 18.9432] }
  },
  {
    title: "Heritage Haveli with Royal Courtyard",
    description: "Immerse yourself in authentic royal luxury with hand-painted fresco walls, marble jharokhas, traditional musical evenings, and swimming pool inside royal arched courtyard.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
    },
    price: 3800,
    location: "Udaipur, Rajasthan",
    country: "India",
    category: "castles",
    amenities: ["Wifi", "Swimming Pool", "Heritage courtyard", "Air conditioning", "Free breakfast", "Restaurant on-site"],
    bedrooms: 4,
    beds: 4,
    bathrooms: 4,
    maxGuests: 8,
    geometry: { type: "Point", coordinates: [73.6844, 24.5854] }
  }
];

module.exports = { data: sampleListings };