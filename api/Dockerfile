FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps && \
    npm cache clean --force && \
    chown -R node:node /app/node_modules

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Make start script executable
RUN chmod +x scripts/start-with-migrations.sh

# Start the application with migrations
CMD ["sh", "scripts/start-with-migrations.sh"]
