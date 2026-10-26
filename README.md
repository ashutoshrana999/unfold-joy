# UnfoldJoy 🎁

UnfoldJoy is a modern, responsive e-commerce platform designed for curated gifting. It features an intuitive customer-facing storefront and a fully integrated Admin Dashboard for managing products, categories, dynamic homepage sections, and WhatsApp ordering.

---

## ✨ Features
- **Curated Storefront**: Handpicked collections across categories (Gift Boxes, Teddy Bears, Jewelry, Keepsakes, etc.).
- **Official Brand Aesthetics**: Integrated UnfoldJoy branding, high-resolution hero imagery, and custom themes.
- **Admin Control Center**: Protected administrative portal for managing categories, products, visibility toggles, and catalog items.
- **WhatsApp Direct Ordering**: Instant checkout via WhatsApp links prefilled with customer item inquiries.
- **Enterprise-Grade Security**: Rate limiting against brute-force attacks, Helmet HTTP headers, strict CORS, and authenticated session management.

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Axios
- **Backend**: Node.js, Express 5, Mongoose, Helmet, Express-Rate-Limit
- **Database**: MongoDB Atlas

---

## 🚀 Local Development

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Environment Variables**
   - In `backend/.env`:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ADMIN_EMAIL=admin@unfoldjoy.com
     ADMIN_PASSWORD=your_strong_admin_password
     WHATSAPP_NUMBER=919693867664
     ```
   - In `frontend/.env`:
     ```env
     VITE_WHATSAPP_NUMBER=919693867664
     VITE_CONTACT_PHONE=+91 96938 67664
     VITE_CONTACT_EMAIL=unfoldjoy.29@gmail.com
     ```

3. **Admin Account Setup & Password Management**
   - Set or reset the admin password directly via CLI without exposing credentials in Git:
     ```bash
     cd backend
     node setAdmin.js admin@unfoldjoy.com mySecurePassword123
     ```
   - Or change it anytime from the web UI by logging into `/admin/dashboard` and clicking **Change Password**.

4. **Start Development**
   - Backend:
     ```bash
     cd backend && npm run dev
     ```
   - Frontend:
     ```bash
     cd frontend && npm run dev
     ```

---

## ☁️ Production Deployment

### 1. Deploy Backend on Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository (`unfold-joy`).
3. Set the following settings:
   - **Name**: `unfoldjoy-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. In the **Environment Variables** section on Render, add:
   - `MONGO_URI`: *Your MongoDB connection string*
   - `JWT_SECRET`: *A secure random string*
   - `WHATSAPP_NUMBER`: `919693867664`
   - `CLIENT_URL`: *Your Vercel frontend URL (e.g. `https://unfoldjoy.vercel.app`)*
5. Click **Create Web Service**. Note down the assigned URL (e.g. `https://unfoldjoy-backend.onrender.com`).

---

### 2. Deploy Frontend on Vercel
1. Go to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Select your `unfold-joy` GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In the **Environment Variables** tab on Vercel, add:
   - `VITE_API_URL`: `https://unfoldjoy-backend.onrender.com` *(Replace with your Render URL)*
   - `VITE_WHATSAPP_NUMBER`: `919693867664`
   - `VITE_CONTACT_PHONE`: `+91 96938 67664`
   - `VITE_CONTACT_EMAIL`: `unfoldjoy.29@gmail.com`
5. Click **Deploy**. Vercel will build the frontend, and [frontend/vercel.json](file:///Users/ashutoshrana/Desktop/all/unfoldjoy/frontend/vercel.json) will ensure clean client-side SPA routing.
