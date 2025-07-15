-- Insert the three required chat rooms
INSERT INTO chat_rooms (name, description, member_count, last_activity, created_at, updated_at) 
VALUES 
    ('Goals', 'Share and discuss your financial goals with the community', 0, NOW(), NOW(), NOW()),
    ('Budgets', 'Tips, tricks, and discussions about budgeting strategies', 0, NOW(), NOW(), NOW()),
    ('Investing', 'Investment advice, market discussions, and portfolio sharing', 0, NOW(), NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
