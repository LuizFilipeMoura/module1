# Dockerfile

# Use node alpine as it's a small node image
FROM node:alpine

# Create the directory on the node image
# where our Next.js app will live
RUN mkdir -p /appNext

# Set /appNext as the working directory
WORKDIR /appNext

# Copy package.json and package-lock.json
# to the /appNext working directory
COPY package*.json /appNext

# Install dependencies in /appNext
RUN npm install

# Copy the rest of our Next.js folder into /appNext
COPY . /appNext

# Ensure port 3000 is accessible to our system
EXPOSE 3000

# Run yarn dev, as we would via the command line
CMD ["npm","run" ,"dev"]
