-- PostgreSQL Database Setup for Personal Finance Regulator
-- Run this script as a PostgreSQL superuser (postgres)

-- Create database
CREATE DATABASE personalfinance_db;

-- Create user
CREATE USER personalfinance_user WITH PASSWORD 'personalfinance_pass';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE personalfinance_db TO personalfinance_user;

-- Connect to the database
\c personalfinance_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO personalfinance_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO personalfinance_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO personalfinance_user;

-- Create extension for UUID generation (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Future: You can add initial data here if needed
-- Tables will be created automatically by Spring Boot JPA

COMMENT ON DATABASE personalfinance_db IS 'Personal Finance Regulator Application Database';
