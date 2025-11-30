# GitTogether 🤝

**GitTogether** is a connection platform for developers to find partners for side projects. It facilitates matching based on skills ("I want a project" vs "I want a partner") and enables real-time collaboration through project-based chat groups.

## 🚀 Tech Stack

**Backend:**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Real-time:** Socket.io (Setup complete, logic pending)

**Frontend (Planned):**
* **Framework:** React (Vite)
* **Language:** TypeScript

---

## 📂 Project Structure (Monorepo)

The project follows a monorepo structure to manage client and server in a single repository.

```text
GitTogether/
├── client/              # Frontend React Application (Initialized)
├── server/              # Backend Node/Express Application
│   ├── src/
│   │   ├── config/      # Environment & DB Config
│   │   ├── controllers/ # Business Logic
│   │   ├── middleware/  # Auth & Validation
│   │   ├── routes/      # API Endpoints
│   │   ├── utils/       # Helper functions
│   │   ├── app.ts       # Express App Setup
│   │   └── index.ts     # Server Entry Point
│   ├── prisma/
│   │   └── schema.prisma # Database Schema definition
│   └── package.json
├── .gitignore           # Global git ignore
└── README.md
```

🛠️ Getting Started (Backend)
Follow these steps to set up the backend server locally.

1. Prerequisites
Node.js (v18+)

PostgreSQL installed and running locally.

2. Installation
Navigate to the server directory and install dependencies:

```Bash
cd server
npm install
```

3. Environment Setup
Create a .env file in the server/ directory:

```bash
# server/.env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/gittogether_db?schema=public"
JWT_SECRET="your_super_secret_key"
PORT=3000
```

4. Database Migration
Run the Prisma migration to create the tables in your local PostgreSQL database:

```Bash

npx prisma migrate dev --name init_schema
```

5. Running the Server
Start the development server (uses nodemon and ts-node):

```Bash

npm run dev
```

You should see:
```bash
✅ Database Connected Successfully 🚀 Server running on http://localhost:3000
```

🔜 Next Steps
[ ] Auth API: Implement Signup/Login (JWT & Bcrypt).

[ ] Project API: Routes to Create and Get projects (with filters).

[ ] Frontend: Initialize React Client.
