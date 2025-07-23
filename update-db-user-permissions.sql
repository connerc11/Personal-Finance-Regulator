-- Update permissions for the app user on the transaction table
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE transaction TO personalfinance_user;
