# server/Dockerfile

# 1. Use an official lightweight Node.js image
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files first (better caching)
COPY package*.json ./
COPY prisma ./prisma/

# 4. Install dependencies
RUN npm install

# 5. Generate Prisma Client (Crucial for the container to understand the DB)
RUN npx prisma generate

# 6. Copy the rest of the source code
COPY . .

# 7. Build the TypeScript code
RUN npm run build

# 8. Expose the port (Render uses 10000 by default but we map it)
EXPOSE 3000

# 9. Start the server using the compiled JS
CMD ["npm", "start"]