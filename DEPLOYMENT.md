# SmartStock Enterprise - Deployment Guide

## Architecture

```
[Vercel]          [Render]          [Supabase]
Frontend   ──►   Backend API  ──►   PostgreSQL DB
(HTML/JS)        (Spring Boot)      (Cloud)
```

---

## Step 1 — Set Up Supabase (Database)

1. Go to [supabase.com](https://supabase.com) → Create new project → **Smart Stock**
2. Go to **SQL Editor** → Run `backend/src/main/resources/schema.sql`
3. Then run `backend/src/main/resources/data.sql`
4. Go to **Settings → Database → URI** → copy the connection string:
   ```
   postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres
   ```

---

## Step 2 — Deploy Backend to Render

1. Push your code to GitHub (if not already done)
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo → select the `backend/` folder
4. Set these settings:
   - **Runtime**: Java
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/enterprise-0.0.1-SNAPSHOT.jar`
5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `DB_URL` | `jdbc:postgresql://db.xxxx.supabase.co:5432/postgres` |
   | `DB_USER` | `postgres` |
   | `DB_PASSWORD` | your Supabase password |
6. Click **Deploy** → wait ~5 min
7. Copy your Render URL: `https://smartstock-backend.onrender.com`

---

## Step 3 — Update Frontend with Backend URL

Open `frontend_html/index.html` and update line:
```javascript
window.BACKEND_URL = 'https://smartstock-backend.onrender.com';
```

---

## Step 4 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `frontend_html`
4. Click **Deploy**
5. Your app is live at: `https://smartstock-xxx.vercel.app`

---

## Step 5 — Update CORS on Backend

After getting your Vercel URL, update `WebConfig.java`:
```java
.allowedOrigins("https://smartstock-xxx.vercel.app")
```
Then redeploy the backend on Render.

---

## Quick Checklist

- [ ] Supabase project created
- [ ] schema.sql run in Supabase
- [ ] data.sql run in Supabase
- [ ] Backend deployed on Render
- [ ] Environment variables set on Render
- [ ] `window.BACKEND_URL` updated in index.html
- [ ] Frontend deployed on Vercel
- [ ] CORS updated with Vercel URL
- [ ] End-to-end test: login → browse products → add to cart
