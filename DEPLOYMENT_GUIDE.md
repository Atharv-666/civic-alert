# 🚀 CivicAlert Complete Deployment Guide

This guide provides step-by-step instructions to deploy **CivicAlert** (React + Express + MongoDB + Gemini AI + Cloudinary) to free cloud hosting (**Render** for Node.js Backend & **Vercel** for React Frontend).

---

## 🛠️ Prerequisites & Required Accounts

Before starting, create free accounts on:
1. [GitHub](https://github.com/) (to host your code repository)
2. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud Database)
3. [Cloudinary](https://cloudinary.com/) (Photo upload CDN)
4. [Google AI Studio](https://aistudio.google.com/) (Gemini API Key)
5. [Render](https://render.com/) (Backend hosting)
6. [Vercel](https://vercel.com/) (Frontend hosting)

---

## Step 1: Set Up Cloud Database & Services

### 1. MongoDB Atlas Database
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a **Free (M0) Cluster**.
2. Go to **Database Access** $\rightarrow$ **Add New Database User** (Username & Password).
3. Go to **Network Access** $\rightarrow$ **Add IP Address** $\rightarrow$ Click **Allow Access from Anywhere (`0.0.0.0/0`)**.
4. Click **Database** $\rightarrow$ **Connect** $\rightarrow$ **Drivers** $\rightarrow$ Copy your connection string:
   ```env
   mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/civic_alert?retryWrites=true&w=majority
   ```

### 2. Cloudinary Credentials
1. Log in to [Cloudinary Dashboard](https://console.cloudinary.com/).
2. Copy your **Cloud Name**, **API Key**, and **API Secret**.

### 3. Google Gemini AI API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key** and copy your key.

---

## Step 2: Push Your Code to GitHub

Open terminal in the project directory `C:\Users\ATHARV\.gemini\antigravity\scratch\civic-alert`:

```bash
git init
git add .
git commit -m "Deploy: CivicAlert with Dual Auth, AI, & Resolution Proofs"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/civic-alert.git
git push -u origin main
```

---

## Step 3: Deploy Backend to Render (Node.js API)

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** $\rightarrow$ Select **Web Service**.
3. Connect your GitHub repository `civic-alert`.
4. Fill in the service configuration:
   - **Name**: `civic-alert-backend`
   - **Region**: Oregon (US) or Singapore
   - **Root Directory**: Leave blank (Root)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Scroll down to **Environment Variables** and add:

   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/civic_alert` |
   | `JWT_SECRET` | `your_random_super_secret_jwt_key_12345` |
   | `GEMINI_API_KEY` | `your_gemini_api_key_here` |
   | `CLOUDINARY_CLOUD_NAME` | `your_cloudinary_cloud_name` |
   | `CLOUDINARY_API_KEY` | `your_cloudinary_api_key` |
   | `CLOUDINARY_API_SECRET` | `your_cloudinary_api_secret` |
   | `ADMIN_EMAIL` | `admin@salokhenagar.org` |
   | `ADMIN_PASSWORD` | `Admin@12345` |

6. Click **Create Web Service**.
7. Copy your backend URL once deployed (e.g. `https://civic-alert-backend.onrender.com`).

---

## Step 4: Seed Initial Admin User

Run the admin seeding script against your production MongoDB URI:

```bash
# In your local terminal with MONGODB_URI set
node seedAdmin.js
```

This creates the initial admin account (`admin@salokhenagar.org` / `Admin@12345`).

---

## Step 5: Deploy Frontend to Vercel (React App)

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository `civic-alert`.
4. Configure Project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click Edit $\rightarrow$ Select **`client`**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:

   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://civic-alert-backend.onrender.com/api` |

6. Click **Deploy**.
7. Vercel will generate your live production URL (e.g. `https://civic-alert.vercel.app`).

---

## Step 6: Update CORS & Final Verification

1. Go back to your Render backend service $\rightarrow$ **Environment Variables**.
2. Add/Update:
   - `CLIENT_URL`: `https://civic-alert.vercel.app`
3. Click **Save Changes** (Render will automatically redeploy).

---

## 🎯 Verification Checklist

- [x] **Public Citizen Site**: Visit `https://civic-alert.vercel.app` $\rightarrow$ Test Registration & AI Auto-Fill Report form.
- [x] **Isolated Admin Portal**: Visit `https://civic-alert.vercel.app/admin/login` $\rightarrow$ Log in with `admin@salokhenagar.org` / `Admin@12345`.
- [x] **Resolution Proof**: In Admin Dashboard, click **Resolve & Add Proof** $\rightarrow$ Upload photo $\rightarrow$ Verify Before/After comparison on public feed!
