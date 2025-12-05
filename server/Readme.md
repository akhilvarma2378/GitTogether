## GitTogether Backend API 🛠️

The REST API and WebSocket server for the GitTogether platform. Built with Node.js, Express, and Prisma.

⚙️ Setup & Installation

1. Environment Variables

Create a .env file in the server/ directory:

# Database Connection (Supabase Transaction Pooler)
```bash
DATABASE_URL="postgresql://postgres.[ref]:[password]@[aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true](https://aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true)"

# Direct Connection (For Migrations)
DIRECT_URL="postgresql://postgres.[ref]:[password]@[aws-0-region.pooler.supabase.com:5432/postgres](https://aws-0-region.pooler.supabase.com:5432/postgres)"

# Security & Config
JWT_SECRET="your_super_secure_secret"
PORT=3000
NODE_ENV="development"

# Frontend URL (For CORS)
CLIENT_URL="http://localhost:5173" 
```

2. Install Dependencies
```bash
npm install
```


3. Database Migration

Push the schema to your PostgreSQL database:
```bash
npx prisma migrate dev --name init
```


4. Run Server
```bash
npm run dev
```


## 🐳 Docker Deployment

This backend is containerized using Docker.

Build Locally:
```bash
docker build -t gittogether-server .
docker run -p 3000:3000 --env-file .env gittogether-server
```


Deploy to Render:

Connect repo to Render.

Set Root Directory to server.

Add Environment Variables from .env.

Render will automatically build using the Dockerfile.

📡 API Endpoints

Auth

POST /api/auth/signup - Register a new user.

POST /api/auth/login - Login and receive JWT.

Projects

GET /api/projects - List all projects (supports ?skills=React,Node).

POST /api/projects - Create a new project (Protected).

Applications

POST /api/applications/project/:id - Apply to a project.

GET /api/applications/project/:id/manage - View applicants (Owner only).

PATCH /api/applications/:id/status - Accept/Reject applicant.

Chat

GET /api/chats - Get list of joined chat groups.

GET /api/chats/:projectId/messages - Get chat history.

## 🔌 Real-Time Sockets

The server listens for WebSocket connections on the same port.

+ Event: join_room (payload: projectId)

+ Event: send_message (payload: { content, projectId })

+ Event: receive_message (Broadcasts message object)
