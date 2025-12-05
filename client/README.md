## GitTogether Frontend 🎨

The user interface for GitTogether, built with React, Vite, and Tailwind CSS.

## 🚀 Getting Started

1. Environment Variables

Create a .env file in the client/ directory:

# URL of your Backend API
VITE_API_URL="http://localhost:3000/api" 


Note: When deploying to Vercel, change this to your production backend URL (e.g., https://your-app.onrender.com/api).

2. Install Dependencies
```bash
npm install
```


3. Run Development Server
```bash
npm run dev
```


📦 Project Structure
```
src/
├── components/      # Reusable UI (Buttons, Cards, Inputs)
├── context/         # Global State (AuthContext)
├── pages/           # Route Views (Dashboard, Chat, Login)
├── services/        # Axios API Configuration
└── App.tsx          # Router Setup
```


## 🌐 Deployment (Vercel)

Push code to GitHub.

Import project into Vercel.

Set Root Directory to client.

Add Environment Variable:

VITE_API_URL: https://your-backend-url.onrender.com/api

Deploy.

## 🎨 UI Library

Styling: Tailwind CSS

Icons: Lucide React

HTTP Client: Axios

Real-time: Socket.io Client
