# Use Node image with Yarn
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy source code
COPY . .

# Build the NestJS app
RUN yarn build


# Run the app
CMD ["node", "dist/main"]
