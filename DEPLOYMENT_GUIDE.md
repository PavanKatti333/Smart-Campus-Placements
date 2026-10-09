# 🚀 Deployment Guide: Smart Campus Placement

This guide outlines how to deploy both the **React Frontend** and the **Spring Boot (Java 23) + MySQL Backend**.

---

## ⚠️ Important Note About Vercel & Java Spring Boot

* **Frontend (React + Vite)**: **100% Native on Vercel**. Vercel is the recommended and fastest platform for hosting the frontend.
* **Backend (Spring Boot + MySQL)**: Vercel is a serverless platform designed for Node.js, Python, and edge functions. It does **not** natively host long-running Java/JVM services or MySQL databases.
* **The Recommended Production Architecture**:
  * **Frontend**: Deploy on **Vercel** (Free, instant global CDN)
  * **Backend**: Deploy on **Render** or **Railway** (Free/low cost, native Java & Docker support)
  * **Database**: Hosted **MySQL** on **Railway**, **Aiven**, or **TiDB Serverless** (Free tiers available)

---

## 🌐 Part 1: Deploying the Frontend to Vercel

### Step 1: Push your code to GitHub
Make sure your changes are pushed to your GitHub repository.

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** ➔ **"Project"**.
3. Import your `Smart-Campus-Placements` repository.

### Step 3: Configure Project Settings on Vercel
* **Framework Preset**: `Vite`
* **Root Directory**: Click *Edit* and select `frontend` (or leave as root, since root `vercel.json` is also configured).
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Environment Variables**:
  * `VITE_API_BASE_URL`: Enter your deployed backend URL (e.g., `https://smart-campus-backend.up.railway.app` or `https://smart-campus-backend.onrender.com`).
    *(For initial testing before backend deployment, you can leave it blank or point to localhost).*

### Step 4: Click "Deploy"
Vercel will build and assign you a URL like `https://smart-campus-placement.vercel.app`.

---

## ☕ Part 2: Deploying Backend & MySQL (Railway or Render)

### Option A: Railway (Easiest - MySQL + Spring Boot in 1 Project)

1. Sign up at [Railway.app](https://railway.app).
2. Click **"New Project"** ➔ **"Provision MySQL"**.
3. In the same project, click **"New"** ➔ **"GitHub Repo"** ➔ Select your repository.
4. Set the **Root Directory** to `backend`. Railway will automatically detect `backend/Dockerfile`.
5. Under your Backend Service ➔ **Variables**, add:
   * `DB_HOST`: `${{MySQL.MYSQLHOST}}`
   * `DB_PORT`: `${{MySQL.MYSQLPORT}}`
   * `DB_NAME`: `${{MySQL.MYSQLDATABASE}}`
   * `DB_USERNAME`: `${{MySQL.MYSQLUSER}}`
   * `DB_PASSWORD`: `${{MySQL.MYSQLPASSWORD}}`
   * `CORS_ALLOWED_ORIGINS`: `https://*.vercel.app,http://localhost:5173`
6. Click **Generate Domain** under Settings ➔ Networking to get your public backend URL (e.g., `https://smart-campus-backend.up.railway.app`).

---

### Option B: Render

1. Sign up at [Render.com](https://render.com).
2. Get a free cloud MySQL database from [Aiven](https://aiven.io) or [TiDB Serverless](https://tidbcloud.com) (instant setup).
3. In Render, click **"New Web Service"** ➔ Connect GitHub repo.
4. Set:
   * **Root Directory**: `backend`
   * **Runtime**: `Docker`
5. Under **Environment Variables**:
   * `DB_URL`: Your cloud MySQL JDBC URL
   * `DB_USERNAME`: Database user
   * `DB_PASSWORD`: Database password
   * `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app,https://*.vercel.app`
6. Render builds via `backend/Dockerfile` and gives you a live URL.

---

## 🔗 Part 3: Connecting Frontend to Backend

Once your backend is live:
1. Go to your **Vercel Dashboard** ➔ Select your frontend project.
2. Go to **Settings** ➔ **Environment Variables**.
3. Add / Update:
   * **Key**: `VITE_API_BASE_URL`
   * **Value**: Your live backend URL (e.g. `https://smart-campus-backend.up.railway.app`)
4. Redeploy the latest commit on Vercel.
5. Your full-stack platform is now live!
