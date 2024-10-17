# Stage 1: Build the application
FROM node:22 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the app files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the application
FROM nginx:stable-alpine

# Copy built files from previous stage to Nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]