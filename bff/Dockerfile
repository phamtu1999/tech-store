# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for NestJS build)
RUN npm install --include=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose port (Railway will inject PORT environment variable)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
