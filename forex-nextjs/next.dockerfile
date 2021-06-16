# Dockerfile

# Use node alpine as it's a small node image
FROM node:alpine

# Create the directory on the node image 
# where our Next.js app will live
RUN mkdir -p /app/nextjs

# Set /app/nextjs as the working directory
WORKDIR /app/nextjs

# Copy package.json and package-lock.json
# to the /app/nextjs working directory
COPY package*.json /app/nextjs

# Install dependencies in /app/nextjs
RUN apk update && apk add --virtual build-dependencies build-base gcc wget git

RUN apk add --update --no-cache curl py-pip

RUN npm install

# Copy the rest of our Next.js folder into /app/nextjs
COPY . /app/nextjs

# Ensure port 3000 is accessible to our system
EXPOSE 3000

# Run yarn dev, as we would via the command line 
CMD ["npm","run", "dev"]
