# UnfoldJoy 🎁

UnfoldJoy is a modern, responsive e-commerce platform designed for curated gifting. It features an intuitive customer-facing storefront and a fully integrated Admin Dashboard for managing products and categories.

## ✨ Features
- **Beautiful Storefront**: Discover curated gifts across multiple categories (Teddy Bears, Jewelry, Gift Boxes, etc.).
- **Admin Dashboard**: Securely log in to manage your inventory. Add, edit, or delete categories and products on the fly.
- **WhatsApp Integration**: Streamlined "Order on WhatsApp" functionality for high-conversion sales.
- **Responsive Design**: Looks stunning on both mobile and desktop screens.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## 🚀 Getting Started Locally

1. **Install Dependencies**
   Run this command in the root folder to install dependencies for both the frontend and backend:
   ```bash
   npm run install-all
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   WHATSAPP_NUMBER=your_business_whatsapp_number
   ```

3. **Run Development Servers**
   To start the backend server on port 5000:
   ```bash
   npm start
   ```
   Open a new terminal and start the frontend React app (Vite):
   ```bash
   cd frontend
   npm run dev
   ```

## ☁️ Deployment (Render)

This repository is pre-configured to be deployed as a single Web Service on Render.
1. Connect this GitHub repository to Render and create a **Web Service**.
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. Add all your `.env` variables into Render's Environment Variables tab.

*The backend will automatically build the frontend and serve it in production!*
