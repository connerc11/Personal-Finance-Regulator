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

## 📋 Project Status

### ✅ Recent Updates (January 2025)

- **Java 17 Migration Completed**: Upgraded from Java 8 to Java 17
- **Spring Boot 3.1.12**: Updated to latest stable Spring Boot version
- **Build System**: Maven compiler updated to support Java 17
- **Environment Setup**: Automated setup scripts created for easy development
- **Build Verification**: All services compile and package successfully

### 🔧 Development Environment

The project now includes:
- **Embedded Java 17**: OpenJDK 17.0.13 (Eclipse Temurin) included in project
- **Embedded Maven**: Apache Maven 3.9.5 included in project
- **Setup Scripts**: Automated PowerShell scripts for environment configuration
- **Build Scripts**: One-click build and deployment scripts

### 🚀 Next Steps

- Run the frontend React application
- Set up database configurations
- Deploy to cloud infrastructure
- Add comprehensive testing

## 🤝 Contributing

1. Ensure Java 17 is set up using `.\setup-java17.ps1`
2. Build the project with `mvn clean install`
3. Run tests with `mvn test`
4. Follow standard Git workflow for contributions

## 🏃‍♂️ Getting Started

### Prerequisites

- Java 17+ (OpenJDK included in project)
- Maven 3.9+ (included in project)
- Windows PowerShell (for automation scripts)

### Quick Setup

**Option 1: Complete Automated Setup**

```powershell
.\setup-complete.ps1
```

This script will:
- Configure Java 17 environment
- Set up Maven
- Build the entire project
- Verify everything is working

**Option 2: Manual Setup**

1. **Set up Java 17 environment**

   ```powershell
   .\setup-java17.ps1
   ```

2. **Build all services**

   ```powershell
   mvn clean install
   ```

### Running the Application

**Option 1: Start all services at once**

```powershell
.\start-services.ps1
```

**Option 2: Start services individually**

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
