# ✈️ Wanderlust 2.0 — Online Property Hosting & Smart Rental Ecosystem

> **Major Project Submission — Department of Computer Science & Engineering, Parul Institute of Technology (Session: 2025–2026)**
> **Developed by:** Manoj Kunwar, Aayush Sharma, Rabin Raule  
> **Under Guidance of:** Ms. Bharti Dubey

---

## 📖 Project Overview
**Wanderlust 2.0** is an enterprise-grade full-stack accommodation and property rental marketplace built on the MVC pattern with Node.js, Express, MongoDB, and Bootstrap 5.3.

### 🌟 Key Highlights & Major Project Features:
1. **🏨 End-to-End Booking Engine**: Interactive check-in/out datepicker, nightly fee calculation, 18% GST tax computation, and booking reference generation.
2. **🧾 Official Printable Invoices**: Instant tax invoice receipts with itemized pricing, host info, and QR metadata.
3. **💖 Persistent Wishlists**: AJAX-powered heart toggle synced with MongoDB user profiles.
4. **🤖 "WanderBot AI" Smart Travel Concierge**: Floating AI chatbot with destination matcher, custom 3-day itinerary generation, and automated review summarizer.
5. **📊 Host Revenue & Analytics Dashboard**: Real-time KPI summary cards and **Chart.js** 6-month earnings & category distribution graphs.
6. **🔍 Advanced Multi-Criteria Filter**: Price sliders, room & bed counts, 10+ amenities checklist, and interactive Map/Grid switcher with price bubbles.
7. **🌓 Dark / Light Mode**: Theme toggle with instant persistence in `localStorage`.

---

## ⚙️ Quick Start (Run Locally)

### 1. Prerequisites
- [Node.js (v18+)](https://nodejs.org)
- [MongoDB (Community Server or MongoDB Atlas Cloud)](https://www.mongodb.com/try/download/community)

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables (`.env`)
Create a `.env` file in the root folder with:
```env
ATLASDB_URL=mongodb://127.0.0.1:27017/wanderlust
SESSION_SECRET=wanderlust_major_secret_key_2026
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
MAP_TOKEN=your_mapbox_token
PORT=8080
```
*(Note: If `ATLASDB_URL` is omitted, it automatically falls back to local MongoDB `mongodb://127.0.0.1:27017/wanderlust`)*

### 4. Seed Demo Listings, Users & Reviews
```bash
npm run seed
```

### 5. Launch the Server
```bash
npm start
```
Open your browser at **`http://localhost:8080`**.

---

## 🔑 Demo Login Accounts
- **Host / Admin Account**:
  - **Username**: `aayush`
  - **Password**: `admin123`
- **Guest Account**:
  - **Username**: `manoj`
  - **Password**: `guest123`

---

## 🌐 Deploy Online for Free (Step-by-Step)

### Option A: Free Deployment on Render.com (Recommended)
1. Push your code to your GitHub repository: `https://github.com/manoj-kunwar/Project`.
2. Go to [Render.com](https://render.com) and log in with GitHub.
3. Click **New +** ➔ **Web Service**.
4. Connect your `Project` repository.
5. Configure:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
6. In **Environment Variables**, add:
   - `ATLASDB_URL` = Your MongoDB Atlas Connection String
   - `SESSION_SECRET` = `wanderlust_major_secret_key_2026`
   - `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`
   - `MAP_TOKEN`
7. Click **Deploy Web Service**. You will get a live URL (e.g. `https://wanderlust-app.onrender.com`).
