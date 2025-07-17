FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the app
COPY . .

# Build the React app
RUN yarn build

# Install the 'serve' package globally
RUN yarn global add serve

# Run the build on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]
