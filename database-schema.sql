-- Personal Finance Database Schema
-- This will be automatically created by Spring Boot JPA, but having it here for reference

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- INCOME, EXPENSE
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    description VARCHAR(500) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- INCOME, EXPENSE
    category VARCHAR(255),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    period VARCHAR(50) NOT NULL, -- WEEKLY, MONTHLY, YEARLY
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial Goals table
CREATE TABLE IF NOT EXISTS financial_goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) DEFAULT 0,
    target_date DATE,
    category VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample user for testing
INSERT INTO users (id, username, email, password, first_name, last_name) 
VALUES 
    (1, 'demo', 'demo@example.com', '2a10TKh9yE9J7Jv9YrJ5J8Z7K.rJ5J8Z7K.rJ5J8Z7K.rJ5J8Z7K.rJ5J8', 'Demo', 'User'),
    (2, 'user', 'user@example.com', '2a10TKh9yE9J7Jv9YrJ5J8Z7K.rJ5J8Z7K.rJ5J8Z7K.rJ5J8Z7K.rJ5J8', 'Test', 'User')
ON CONFLICT (id) DO NOTHING;

-- Insert sample data
INSERT INTO transactions (user_id, description, amount, type, category, date) 
VALUES 
    (2, 'Grocery Shopping', 75.50, 'EXPENSE', 'GROCERIES', CURRENT_DATE - INTERVAL '1 day'),
    (2, 'Salary Payment', 3000.00, 'INCOME', 'SALARY', CURRENT_DATE - INTERVAL '3 days'),
    (2, 'Gas Station', 45.00, 'EXPENSE', 'TRANSPORTATION', CURRENT_DATE - INTERVAL '2 days'),
    (2, 'Restaurant', 28.75, 'EXPENSE', 'DINING', CURRENT_DATE - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

INSERT INTO budgets (user_id, name, category, amount, period, start_date, end_date) 
VALUES 
    (2, 'Monthly Groceries', 'GROCERIES', 800.00, 'MONTHLY', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'),
    (2, 'Transportation', 'TRANSPORTATION', 200.00, 'MONTHLY', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Reset sequence to ensure proper ID generation
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval('transactions_id_seq', COALESCE((SELECT MAX(id) FROM transactions), 1));
SELECT setval('budgets_id_seq', COALESCE((SELECT MAX(id) FROM budgets), 1));

SELECT 'Database schema and sample data created successfully!' as message;
