# # FROM node

# # # Set the working directory
# # WORKDIR /app

# # # Copy package files and install dependencies
# # COPY package.json package-lock.json ./
# # RUN npm install

# # # Copy the rest of the application code
# # COPY . .

# # # Build the React app for production
# # RUN npm run build
# # EXPOSE 3000

# # # Start Nginx in the foreground
# # CMD [ "npm", "start" ] 

# FROM node:22.12.0-alpine AS builder

# # Set the working directory
# WORKDIR /build  

# # Copy package files and install depend encies    
# COPY package.json package-lock.json ./
# RUN npm install

# # Copy the rest of the application code 
# COPY . .

# # Build the React app for production    
# RUN npm run build

# FROM node:22.12.0-alpine AS runner
# WORKDIR /build  
# COPY --from=builder /build/node_modules ./node_modules
# COPY --from=builder /build/package.json ./package.json
# COPY --from=builder /build/package-lock.json ./package-lock.json 
# COPY --from=builder /build/build ./build
# # Expose the port the app runs on
# EXPOSE 3000 
# CMD [ "npm" ,"start" ]


# Build stage
# FROM node:22.12.0-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci --only=production

# COPY . .
# RUN npm run build

# # Production stage
# FROM node:22.12.0-alpine

# WORKDIR /app

# COPY --from=builder /app/build ./build
# COPY --from=builder /app/node_modules ./node_modules
# COPY package.json ./

# # Use a lightweight server to serve static files
# RUN npm install -g serve

# EXPOSE 3000

# CMD ["serve", "-s", "build", "-l", "3000"]


# Stage 1: Build the React application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
