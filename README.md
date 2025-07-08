# Personal Finance Regulator

A comprehensive personal finance management system built with Java Spring Boot microservices architecture.

## 🏗️ Architecture

This project consists of several microservices:

- **API Gateway** (Port 8080) - Central entry point and routing
- **User Service** (Port 8081) - User management and authentication
- **Transaction Service** (Port 8082) - Financial transaction tracking
- **Budget Service** (Port 8083) - Budget management and tracking
- **Scheduled Purchase Service** (Port 8084) - Future purchase planning

## 🚀 Features

### 📊 Transaction Management

- Track income and expenses
- Categorize transactions (Groceries, Dining, Transportation, etc.)
- Add detailed transaction information (merchant, location, notes)
- View transaction history with pagination
- Generate spending summaries

### 👤 User Management

- User registration and authentication
- JWT-based security
- User profile management
- Role-based access control

### 💰 Budget Management

- Create and manage budgets by category
- Track budget vs actual spending
- Set financial goals
- Budget alerts and notifications

### 📅 Scheduled Purchases

- Plan future purchases
- Set savings goals for big purchases
- Track progress toward purchase goals
- Purchase reminders

## 🛠️ Technology Stack

- **Backend**: Java 17, Spring Boot 3.2.0
- **Database**: H2 (development), configurable for PostgreSQL/MySQL
- **Security**: JWT Authentication
- **API Documentation**: OpenAPI/Swagger
- **Build Tool**: Maven
- **Architecture**: Microservices

## 🏃‍♂️ Getting Started

### Prerequisites

- Java 17+
- Maven 3.6+

### Running the Application

1. **Build all services**

   ```powershell
   mvn clean install
   ```

2. **Start services individually**

   **Start User Service:**

   ```powershell
   cd user-service
   mvn spring-boot:run
   ```

   **Start Transaction Service:**

   ```powershell
   cd transaction-service
   mvn spring-boot:run
   ```

   **Start API Gateway:**

   ```powershell
   cd api-gateway
   mvn spring-boot:run
   ```

3. **Access the application**

   - API Gateway: `http://localhost:8080`
   - User Service: `http://localhost:8081`
   - Transaction Service: `http://localhost:8082`
   - H2 Consoles available at each service's `/h2-console` endpoint

## 📝 API Endpoints

### Authentication (User Service)

- `POST /auth/signup` - Register new user
- `POST /auth/signin` - User login

### Transactions (Transaction Service)

- `POST /transactions` - Create transaction
- `GET /transactions/user/{userId}` - Get user transactions
- `GET /transactions/{id}` - Get specific transaction
- `PUT /transactions/{id}` - Update transaction
- `DELETE /transactions/{id}` - Delete transaction
- `GET /transactions/user/{userId}/summary` - Get transaction summary
- `GET /transactions/user/{userId}/category-expenses` - Get expenses by category

## 🗄️ Database Schema

### Users Table

- id, username, email, password, firstName, lastName, phoneNumber, role, active, createdAt, updatedAt

### Transactions Table

- id, userId, description, amount, type (INCOME/EXPENSE), category, transactionDate, notes, location, merchant, createdAt, updatedAt

## 🔒 Security

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control
- CORS configuration for cross-origin requests

## 🧪 Testing

Run tests for all services:

```powershell
mvn test
```

## 🔧 Configuration

Each service can be configured via `application.yml` files:

- Database connections
- JWT secrets and expiration
- Server ports
- Logging levels
- Actuator endpoints
