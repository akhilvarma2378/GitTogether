GitTogether 🤝

GitTogether is a full-stack collaboration platform designed to help developers find partners for side projects. It facilitates matching based on skills ("I want a project" vs. "I want a partner") and enables real-time collaboration through project-based chat groups.

🚀 Live Demo

Frontend (Vercel): https://git-together-client.vercel.app/login

Backend (Render): https://git-together-backend.onrender.com

🏗️ Architecture

This project follows a Monorepo structure separating the client and server logic.
```
GitTogether/
├── client/              # Frontend (React + Vite)
│   ├── src/             # UI Components & Pages
│   └── ...
└── server/              # Backend (Node.js + Express)
    ├── prisma/          # Database Schema
    ├── src/             # API Controllers & Socket Logic
    └── Dockerfile       # Deployment Config
```

Tech Stack

|Layer |Technologies|

| -------- | -------- |

|Frontend |

React, Vite, TypeScript, Tailwind CSS, Lucide Icons|

|Backend|

Node.js, Express.js, Socket.io (WebSockets)|

|Database|

PostgreSQL (Hosted on Supabase), Prisma ORM|

|Authentication|

JWT (JSON Web Tokens), Bcrypt|

|DevOps|

Docker, Render (Backend), Vercel (Frontend)|

|Deployment|

Vercel (Client), Render (Server via Docker)|

🛠️ Quick Start (Local Development)

To run the entire stack locally, you need two terminals.

1. Start the Backend
```bash
cd server
npm install
# Ensure .env is set up (see server/README.md)
npx prisma migrate dev
npm run dev
```


2. Start the Frontend
```bash
cd client
npm install
# Ensure .env is set up (see client/README.md)
npm run dev
```


The app will be available at http://localhost:5173.

✨ Key Features

Identity: Secure Authentication (Signup/Login) with hashed passwords.

Marketplace: Post projects with skill requirements or filter existing projects.

Smart Matching: Apply to projects; Owners can Accept/Reject applicants.

Real-time Chat: Accepted applicants are automatically added to a private Socket.io chat room with the owner.
