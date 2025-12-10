# Development Dockerfile for Next.js Frontend
# Uses development server with hot reload and runtime environment variables

FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Copy .env.local for development environment variables
COPY .env.local .env.local

EXPOSE 3000

# Run development server
CMD ["npm", "run", "dev"]
