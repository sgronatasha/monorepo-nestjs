# NestJS Monorepo

This project is a modular NestJS monorepo that consists of two applications: a gateway and an authentication microservice. The gateway exposes a public HTTP REST API, while the authentication service handles user management and communicates with the gateway via TCP.

## Project Structure

```
nestjs-monorepo
├── apps
│   ├── gateway          # Public HTTP REST API
│   └── authentication    # Microservice for user management
├── common               # Shared DTOs, RTOs, and validators
├── core                 # Core services like networking and logging
├── config               # Configuration files for different environments
├── docker-compose.yml   # Docker Compose configuration
├── package.json         # Monorepo dependencies
├── tsconfig.base.json   # Base TypeScript configuration
├── tsconfig.json        # TypeScript configuration for the project
├── nest-cli.json        # NestJS CLI configuration
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── .env.example         # Example environment variable configuration
└── README.md            # Project documentation
```

## Features

- **User Management**: Register and retrieve users through the gateway.
- **JWT Authentication**: Complete login flow with JWT token generation and validation.
- **Password Security**: Bcrypt password hashing for secure storage.
- **Protected Routes**: JWT-based route protection using Passport.js.
- **Microservices Communication**: Internal communication between the gateway and authentication service using TCP.
- **Validation**: Utilizes class-validator for request validation.
- **Database**: MongoDB (Mongoose) is used for data persistence.
- **Swagger Documentation**: API documentation is generated using Swagger.

## Getting Started

1. **Clone the repository**:
   ```
   git clone https://github.com/sgronatasha/monorepo-nestjs.git
   cd nestjs-monorepo
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the applications**:
   - For the gateway:
     ```
     cd apps/gateway
     npm run start
     ```
   - For the authentication service:
     ```
     cd apps/authentication
     npm run start
     ```

4. **Access the API**:
   - The gateway will be available at `http://localhost:3000`.
   - Use tools like Postman or Apidog to interact with the API endpoints.

## API Endpoints

### Authentication
- **POST /auth/register**: Register a new user.
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com", 
    "password": "password123",
    "firstName": "John",     // Optional
    "lastName": "Doe"        // Optional
  }
  ```

- **POST /auth/login**: Login user and get JWT token.
  ```json
  {
    "identifier": "john_doe",  // username or email
    "password": "password123"
  }
  ```
  
  Response:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    }
  }
  ```

- **GET /auth/users**: Retrieve all users (protected - requires JWT token).
  - Header: `Authorization: Bearer <jwt_token>`

### JWT Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Docker

To run the applications in Docker containers, use the provided `docker-compose.yml` file. 

1. **Build and run the containers**:
   ```
   docker-compose up --build
   ```
