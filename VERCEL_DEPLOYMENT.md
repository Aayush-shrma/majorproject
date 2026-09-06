# 🚀 Vercel Deployment Guide for Wanderlust

Your project is now fully configured and optimized for Vercel Serverless deployment!

---

## 1. Environment Variables in Vercel

When importing your GitHub repository to Vercel (or in **Vercel Dashboard** -> **Your Project** -> **Settings** -> **Environment Variables**), add the following environment variables:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `ATLASDB_URL` | `mongodb+srv://aayushsh8888:9139@aayush.hqzcf.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=aayush` | MongoDB Atlas database URL |
| `SESSION_SECRET` | `wanderlust_major_secret_key_2026` | Express session security |
| `CLOUD_NAME` | `gkdwtkoh` | Cloudinary for image uploads |
| `CLOUD_API_KEY` | `554736461434243` | Cloudinary API Key |
| `CLOUD_API_SECRET` | `K6t0wdGMfNiUBbSd96nvj8ywOdI` | Cloudinary API Secret |
| `NODE_ENV` | `production` | Production mode |

*(Optional)* `MAP_TOKEN`: Your Mapbox access token if you use Mapbox (Leaflet OpenStreetMap automatically works as fallback if not provided).

---

## 2. MongoDB Atlas Network Access (Crucial)

To allow Vercel's serverless functions to connect to your Atlas cluster:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the left sidebar, click **Network Access** (under Security).
3. Click **Add IP Address**.
4. Click **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Confirm**.

> 💡 *Why is this necessary?* Vercel uses dynamic serverless IP addresses from cloud providers (AWS Lambda), so `0.0.0.0/0` ensures Vercel's functions can always connect.

---

## 3. How to Deploy to GitHub & Vercel

Run the following commands in your terminal to commit and push the changes to GitHub:

```bash
git add .
git commit -m "Configure Vercel serverless deployment, auto-seed fallback, and robust image uploads"
git push origin main
```

Once pushed, Vercel will automatically trigger a new deployment and your site will be live with all listings!

---

## 4. What Was Fixed

1. **Atlas Database Populated & Auto-Seeded**:
   - Seeded your Atlas cluster database (`wanderlust`) with all 12 listings, reviews, bookings, and demo accounts (`aayush` / `admin123` and `manoj` / `guest123`).
   - Added automatic seeding logic on server startup: if your database is ever empty, Wanderlust automatically self-heals and seeds initial listings!

2. **Vercel Serverless Function & Routing**:
   - Created `vercel.json` with `includeFiles: "views/**"` and rewrites to `/api/index.js`.
   - Created `api/index.js` exporting the Express `app`.
   - Updated `app.js` with serverless-safe Mongoose connection caching so serverless lambdas never freeze or drop queries.

3. **Robust Image Uploading**:
   - Fixed typo `allowerdformat` -> `allowed_formats` in `cloudConfig.js` (`png`, `jpg`, `jpeg`, `webp`).
   - Added dual upload support: users can either upload a photo file to Cloudinary **OR** paste any image URL directly.
   - Added safe upload error handling: if an image upload fails, Wanderlust continues smoothly and uses a high-definition fallback property photo instead of crashing with a 500 error.
