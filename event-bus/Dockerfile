FROM node:alpine

# Dir in the Container
WORKDIR /app
# Copy package to root of container path /app
COPY package.json ./
# run npm install
RUN npm install
# Copy everything from here, except whats in dockerignore, to the root of container path /app
COPY ./ ./

# run startup command
CMD ["npm", "start"]