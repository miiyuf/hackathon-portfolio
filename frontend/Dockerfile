# Use the latest LTS version of Node.js
FROM node:20-bullseye

# Set the working directory inside the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your application files
COPY . .

# Expose the port your app runs on
EXPOSE 5173

# Define the command to run your app
CMD ["npm", "run", "dev"]