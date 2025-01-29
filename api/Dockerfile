
# Use a smaller base image for the build stage
FROM node:alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies, including TypeScript
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Use a new, minimal base image for the final stage
FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm install --only=production

# ADD PM2 if required
# Install PM2 globally
# RUN npm install pm2 -g

# Expose the port the app will run on
EXPOSE 4000

# Start the application
CMD ["node", "dist/app.js"]

# # Start the application with PM2
# CMD ["pm2-runtime", "dist/app.js"]
