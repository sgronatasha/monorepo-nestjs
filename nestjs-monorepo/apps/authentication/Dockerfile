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

# Copy authentication app
COPY apps/authentication/ ./apps/authentication/

# Install dependencies and build
RUN npm install
RUN npm run build:auth

# Expose port
EXPOSE 3001

# Start the authentication service
CMD ["npm", "run", "start:auth"]
