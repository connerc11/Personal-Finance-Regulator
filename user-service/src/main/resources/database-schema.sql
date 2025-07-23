-- Transaction table for user-service
CREATE TABLE IF NOT EXISTS transaction (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    description VARCHAR(255),
    amount DOUBLE PRECISION NOT NULL,
    type VARCHAR(20), -- e.g., 'credit' or 'debit'
    date TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
