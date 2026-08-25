# ✈️ WANDERLUST 2.0 — MAJOR PROJECT DOCUMENTATION & VIVA GUIDE

> **Project Title:** Wanderlust 2.0 — Online Property Hosting, Smart Rental & AI Travel Ecosystem  
> **Course:** Bachelor of Technology in Computer Science & Engineering (B.Tech CSE)  
> **Institute:** Parul Institute of Technology, Parul University, Vadodara, Gujarat (India)  
> **Academic Year:** Session 2025–2026 (Major Project Submission)  
> **Submitted By:**
> - **Manoj Kunwar** (Roll No: 2303051051318)
> - **Aayush Sharma** (Roll No: 2303051051264)
> - **Rabin Raule** (Roll No: 2303051051382)  
> **Project Guide:** Ms. Bharti Dubey (Department of Computer Science & Engineering)

---

## 📑 TABLE OF CONTENTS
1. [Executive Summary & Transformation](#1-executive-summary--transformation)
2. [Minor Project vs. Major Project Comparison](#2-minor-project-vs-major-project-comparison)
3. [System Architecture & Technology Stack](#3-system-architecture--technology-stack)
4. [Detailed Feature Modules](#4-detailed-feature-modules)
   - [Module 1: End-to-End Booking & Invoicing Engine](#module-1-end-to-end-booking--invoicing-engine)
   - [Module 2: Persistent Wishlist & Saved Properties](#module-2-persistent-wishlist--saved-properties)
   - [Module 3: WanderBot AI Smart Travel Assistant](#module-3-wanderbot-ai-smart-travel-assistant)
   - [Module 4: Host Performance & Revenue Analytics Dashboard](#module-4-host-performance--revenue-analytics-dashboard)
   - [Module 5: Advanced Multi-Filter & Interactive Map Switcher](#module-5-advanced-multi-filter--interactive-map-switcher)
   - [Module 6: Dark / Light Mode & Luxury UI Design System](#module-6-dark--light-mode--luxury-ui-design-system)
5. [Database Schema & ER Data Models](#5-database-schema--er-data-models)
6. [API & Route Map Reference](#6-api--route-map-reference)
7. [Viva & Demo Presentation Script (How to Present Tomorrow)](#7-viva--demo-presentation-script)

---

## 1. EXECUTIVE SUMMARY & TRANSFORMATION

In the 6th-semester Minor Project, our team developed the foundational proof-of-concept for **Wanderlust**, implementing basic property listings and reviews with authentication.

In this **Major Project Submission**, the platform has undergone a complete architectural and user experience transformation into **Wanderlust 2.0**. We have designed and engineered all planned advanced modules:
- An enterprise-grade **Booking & Reservation engine** with live date-range cost calculation, conflict prevention, and official printable **GST tax invoices**.
- A **WanderBot AI Travel Assistant** providing automated budget-based stay recommendations and custom 3-day travel itinerary generation.
- A **Host Business Analytics Hub** with **Chart.js** data visualizations for monthly earnings and portfolio distributions.
- Real-time **Wishlists** with asynchronous database synchronization.
- An **Advanced Multi-Criteria Search Modal** and interactive **Map View Switcher**.
- Complete **Dark / Light Mode** theme persistence and resilient offline database failovers.

---

## 2. MINOR PROJECT VS. MAJOR PROJECT COMPARISON

| Capability | 6th Sem Minor Project | 7th Sem Major Project (Wanderlust 2.0) |
|---|---|---|
| **Property Bookings** | Static mock placeholder / None | **Full-Cycle Booking Engine** with date conflict checks, dynamic pricing, and booking codes |
| **Billing & Invoicing** | None | **Itemized Tax Invoices** with 18% GST calculation, cleaning fees, and printable PDF receipts |
| **Wishlist & Favorites** | Static HTML heart / No database | **Persistent MongoDB Wishlists Hub** with real-time AJAX toggles and navbar count badges |
| **AI Travel Features** | None | **WanderBot AI Concierge** for recommendations, 3-day itinerary generation, and AI review summarizer |
| **Host Business Portal** | Basic CRUD operations | **Interactive Host Analytics Dashboard** with **Chart.js** graphs and reservation manager |
| **Search & Discovery** | Basic text search | **Advanced Multi-Attribute Modal** (Price slider, amenities checklist) + **Interactive Map Switcher** |
| **UI Aesthetics & Theme** | Plain Bootstrap theme | **Airbnb-grade Luxury Design**, Custom Glassmorphism, and **Dark/Light Mode** theme switcher |
| **Database Resilience** | Cloud-only dependent | **Hybrid MongoDB Fallback** (Auto-connects to local MongoDB or cloud Atlas) |

---

## 3. SYSTEM ARCHITECTURE & TECHNOLOGY STACK

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER (UI)                         │
│  EJS Templates + EJS-Mate · Bootstrap 5.3 · Custom Glassmorphic CSS    │
│  Chart.js 4.4 · Mapbox GL / Leaflet OpenStreetMap · FontAwesome 6      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST / AJAX
┌───────────────────────────────────▼────────────────────────────────────┐
│                         APPLICATION LAYER (MVC)                        │
│  Express.js 4.22 Runtime (Node.js v24+)                                │
│  • Passport.js Session-Based Auth & Access Control                     │
│  • Joi v18 Request Validation & Sanitization Middleware                │
│  • Multer + Cloudinary CDN Image Management                            │
│  • WanderBot AI NLP Search & Itinerary Engine                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Mongoose 9.3 ODM
┌───────────────────────────────────▼────────────────────────────────────┐
│                           DATA LAYER (STORAGE)                         │
│  MongoDB (Users · Listings · Reviews · Bookings · Wishlists)           │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Technologies Used:
- **Backend Runtime:** Node.js v18+ / v24+
- **Framework:** Express.js v4.22
- **Database & ODM:** MongoDB Community Server / Atlas Cloud + Mongoose v9.3
- **Data Validation:** Joi v18.0
- **Authentication & Security:** Passport.js with `passport-local-mongoose` and session hashing
- **Charting & Analytics:** Chart.js v4.4
- **Mapping & Geolocation:** Mapbox SDK + Leaflet.js with OpenStreetMap fallback
- **File Uploads & Storage:** Multer + Cloudinary Storage

---

## 4. DETAILED FEATURE MODULES

### Module 1: End-to-End Booking & Invoicing Engine
- **Files:** `models/booking.js`, `controllers/bookings.js`, `routes/booking.js`, `views/bookings/`
- **Capabilities:**
  - **Sticky Booking Widget:** Positioned on every listing show page (`/listings/:id`), automatically calculating stay duration in nights.
  - **Live Dynamic Price Breakdown:**
    $$\text{Grand Total} = (\text{Price} \times \text{Nights}) + \text{Cleaning Fee} (₹500) + \text{Service Fee} (5\%) + \text{GST} (18\%)$$
  - **Conflict Prevention:** Queries MongoDB for confirmed overlapping reservations before booking.
  - **Official Printable Tax Invoice (`/bookings/:id`):** Formatted with unique reservation codes (`WL-XXXXXX`), billing dates, GST compliance breakdown, and a 1-click **"Print / Save PDF"** button.
  - **My Trips Dashboard (`/bookings`):** Segmented into *Upcoming Trips*, *Past Stays*, and *Cancelled Reservations* with 1-click full refund cancellation.

### Module 2: Persistent Wishlist & Saved Properties
- **Files:** `models/user.js`, `controllers/listing.js`, `views/wishlists/index.ejs`
- **Capabilities:**
  - Integrated heart buttons on listing cards and detail pages.
  - Asynchronous AJAX `POST /listings/:id/wishlist` updates the user document without page reloads.
  - Real-time notification toast (*"❤️ Saved to your Wishlist"*) and navbar counter badge update.
  - Dedicated `/wishlists` portal displaying all saved stays with 1-click direct booking.

### Module 3: WanderBot AI Smart Travel Assistant
- **Files:** `routes/api.js`, `views/includes/ai-assistant.ejs`, `public/js/ai-assistant.js`
- **Capabilities:**
  - Floating AI Assistant accessible on all pages.
  - **Smart NLP Matcher:** Understands natural travel queries such as *"Beach villas in Goa under ₹5,000"* or *"Romantic mountain cabins"*.
  - **3-Day Custom Itinerary Generator:** Generates structured Day 1, Day 2, and Day 3 schedules for any destination with morning, afternoon, and evening activities.
  - **AI Property Summarizer:** On listing pages, analyzes guest reviews and highlights key pros, vibe check, and suitable traveler profiles.

### Module 4: Host Performance & Revenue Analytics Dashboard
- **Files:** `controllers/users.js`, `views/host/dashboard.ejs`, `views/host/reservations.ejs`
- **Capabilities:**
  - Access controlled host analytics portal at `/dashboard`.
  - **4 Live KPI Metrics:** Gross Lifetime Revenue (₹), Total Bookings, Active Listings, and Average Rating (★).
  - **Interactive Chart.js Visualizations:**
    - *Monthly Revenue Trend (Line Chart):* Tracks rental earnings over the last 6 months.
    - *Portfolio Categories (Doughnut Chart):* Breaks down listing distributions across property themes.
  - **Host Reservations Manager (`/bookings/host/manage`):** Table displaying guest contact details, stay dates, payout status, and invoice links.

### Module 5: Advanced Multi-Filter & Interactive Map Switcher
- **Files:** `views/includes/filter-modal.ejs`, `views/listings/index.ejs`, `public/js/map.js`
- **Capabilities:**
  - **Multi-Attribute Filter Modal:** Price range sliders (Min ₹ - Max ₹), room counters (Bedrooms, Guests), and amenities checkboxes.
  - **"+18% GST" Tax Toggle:** Dynamically toggles between base price and total price with taxes across all listing cards.
  - **Interactive Map / Grid View Switcher:** Smoothly switches between property cards and a full-screen interactive Mapbox / Leaflet map displaying custom pinned price tags.

### Module 6: Dark / Light Mode & Luxury UI Design System
- **Files:** `public/css/style.css`, `public/js/script.js`, `views/layouts/boilerplate.ejs`
- **Capabilities:**
  - Modern Airbnb-grade typography using Google Font `Plus Jakarta Sans`.
  - Dark/Light mode theme toggle with persistent state saved in browser `localStorage`.
  - Glassmorphic navigation headers, floating toast alerts, and responsive card layouts.

---

## 5. DATABASE SCHEMA & ER DATA MODELS

### 1. User Model (`models/user.js`)
- `email`: String (Required, Unique)
- `username`: String (Managed via `passport-local-mongoose`)
- `role`: String (Enum: `['guest', 'host', 'admin']`, Default: `'guest'`)
- `phone`: String
- `bio`: String
- `wishlist`: `[{ type: ObjectId, ref: 'Listing' }]`
- `createdAt`: Date

### 2. Listing Model (`models/listing.js`)
- `title`: String (Required)
- `description`: String
- `image`: `{ url: String, filename: String }`
- `price`: Number (Required, Min: 0)
- `location`: String (Required)
- `country`: String (Required)
- `category`: String (Enum: `['trending', 'amazing-pools', 'mountains', 'iconic-cities', 'castles', 'camping', 'farms', 'arctic', 'domes', 'boats', 'luxury']`)
- `amenities`: `[String]` (e.g. Wifi, Pool, AC, Parking, Kitchen, Workspace)
- `bedrooms`: Number, `beds`: Number, `bathrooms`: Number, `maxGuests`: Number
- `geometry`: `{ type: 'Point', coordinates: [Number] }`
- `owner`: `{ type: ObjectId, ref: 'User' }`
- `reviews`: `[{ type: ObjectId, ref: 'Review' }]`
- *Virtual:* `avgRating` (Calculates dynamic 1-5 star average)

### 3. Booking Model (`models/booking.js`)
- `listing`: `{ type: ObjectId, ref: 'Listing', required: true }`
- `guest`: `{ type: ObjectId, ref: 'User', required: true }`
- `checkIn`: Date (Required)
- `checkOut`: Date (Required)
- `nights`: Number (Min: 1)
- `guestsCount`: Number
- `basePrice`: Number
- `cleaningFee`: Number (Default: 500)
- `serviceFee`: Number (5%)
- `gstAmount`: Number (18%)
- `totalPrice`: Number
- `status`: String (Enum: `['confirmed', 'completed', 'cancelled']`)
- `paymentStatus`: String (Enum: `['paid', 'pending', 'refunded']`)
- `paymentMethod`: String (e.g. `'Razorpay (UPI / QR)'`)
- `bookingCode`: String (Unique, e.g. `'WL-982144'`)
- `createdAt`: Date

### 4. Review Model (`models/review.js`)
- `rating`: Number (1 to 5)
- `comment`: String
- `author`: `{ type: ObjectId, ref: 'User' }`
- `createdAt`: Date

---

## 6. API & ROUTE MAP REFERENCE

| HTTP Method | Route Endpoint | Middleware / Auth | Controller Action / Description |
|---|---|---|---|
| `GET` | `/listings` | Public | Display all listings with category, search & multi-filters |
| `POST` | `/listings` | `isLoggedIn`, `upload` | Create a new property listing with Cloudinary image upload |
| `GET` | `/listings/:id` | Public | Show detailed listing page with sticky booking widget & map |
| `PUT` | `/listings/:id` | `isLoggedIn`, `isOwner` | Update property listing attributes and photos |
| `DELETE` | `/listings/:id` | `isLoggedIn`, `isOwner` | Delete listing and cascade delete its reviews |
| `POST` | `/listings/:id/wishlist` | `isLoggedIn` (AJAX) | Toggle listing in/out of user's wishlist |
| `POST` | `/listings/:id/book` | `isLoggedIn`, `validateBooking` | Create booking, verify conflict dates, calculate tax invoice |
| `GET` | `/bookings` | `isLoggedIn` | Display user's upcoming, past, and cancelled reservations |
| `GET` | `/bookings/:id` | `isLoggedIn` | View official booking confirmation & printable tax invoice |
| `POST` | `/bookings/:id/cancel` | `isLoggedIn` | Cancel booking and initiate refund status |
| `GET` | `/dashboard` | `isLoggedIn` | Host Analytics Portal with **Chart.js** revenue graphs |
| `GET` | `/bookings/host/manage`| `isLoggedIn` | Manage incoming guest bookings across host properties |
| `GET` | `/wishlists` | `isLoggedIn` | View all saved wishlist properties |
| `POST` | `/api/ai/chat` | Public (JSON) | WanderBot AI natural language search & itinerary generator |
| `GET` | `/api/ai/summary/:id` | Public (JSON) | AI Review sentiment & highlights summarizer |
| `GET` | `/api/listings/geo` | Public (JSON) | GeoJSON coordinates for interactive map price pins |

---

## 7. VIVA & DEMO PRESENTATION SCRIPT

When presenting your Major Project to the external examiners and professors, follow this structured demo script:

### Step 1: Introduction (30 seconds)
> *"Good morning, respected examiners and faculty. Today we present **Wanderlust 2.0**, an advanced property hosting and smart rental ecosystem. While our 6th-semester minor project laid the basic CRUD foundations, Wanderlust 2.0 introduces a production-ready **Booking & Invoicing Engine**, **WanderBot AI travel assistant**, and a **Host Business Analytics Dashboard**."*

### Step 2: Explore & Discovery Demo (1 minute)
1. Show the **Homepage (`/listings`)**.
2. Click category icons (*Trending, Amazing Pools, Mountains, Castles*).
3. Toggle the **"Display total with taxes"** switch (show the +18% GST price update).
4. Click **"Show Map"** button (demonstrate the interactive map view with live price bubbles across cities).
5. Open the **"Filters"** modal to filter by price range and amenities.

### Step 3: WanderBot AI Assistant Demo (1 minute)
1. Click the floating **"Ask WanderBot AI"** widget at the bottom right.
2. Click a chip or type: *"Plan a 3-day itinerary for Manali"*.
3. Show the generated day-by-day morning, afternoon, and evening travel plan with matching stay recommendations.
4. Type: *"Beach villas in Goa under ₹5,000"* to show intelligent budget parsing.

### Step 4: Booking & Invoicing Demo (1.5 minutes)
1. Open any listing (e.g. *Cozy Beachfront Villa*).
2. Point out the **AI Review Summary** box that automatically synthesizes guest feedback.
3. Select check-in and check-out dates on the sticky booking widget (show live price calculation).
4. Click **"Reserve & Confirm"**.
5. Show the generated **Official Tax Invoice & Receipt** with unique reservation code (`WL-XXXXXX`), GST breakdown, and demonstrate the **"Print / Save PDF"** button.
6. Navigate to **"My Trips & Bookings"** (`/bookings`) to show active and past stays.

### Step 5: Host Revenue & Analytics Dashboard Demo (1 minute)
1. Log in as Host (`aayush` / `admin123`).
2. Navigate to **Host Analytics Dashboard (`/dashboard`)**.
3. Highlight the 4 KPI cards and explain the **Chart.js** 6-month revenue trend line and category distribution doughnut chart.
4. Click **"Manage Reservations"** to showcase the host's reservation management controls.
5. Click the **Dark Mode** toggle in the navbar to show theme switching.

---

### 🔑 Demo Login Accounts:
- **Host / Admin Account:** Username: `aayush` | Password: `admin123`
- **Guest Traveler Account:** Username: `manoj` | Password: `guest123`
