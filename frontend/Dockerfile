# Use the latest LTS version of Node.js
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of your application files
COPY . .

# Install dependencies
RUN npm install

# Expose the port your app runs on
EXPOSE 5173

# Define the command to run your app
CMD ["npm", "run", "dev"]