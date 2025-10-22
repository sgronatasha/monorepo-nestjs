FROM node:18-alpine

WORKDIR /app

# Copy root package.json and workspace files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copy common, core, and config directories
COPY common/ ./common/
COPY core/ ./core/
COPY config/ ./config/

# Copy gateway app
COPY apps/gateway/ ./apps/gateway/

# Install dependencies and build
RUN npm install
RUN npm run build:gateway

# Expose port
EXPOSE 3000

# Start the gateway
CMD ["npm", "run", "start:gateway"]
