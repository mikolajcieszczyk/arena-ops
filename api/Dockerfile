FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose port
EXPOSE 3000

# Make start script executable
RUN chmod +x scripts/start-with-migrations.sh

# Start the application with migrations
CMD ["sh", "scripts/start-with-migrations.sh"]
