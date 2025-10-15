# Stage 1: Build React app
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build React app into 'dist' folder
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the 'dist' folder from the build stage to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
