-- Save Spotlight Database Schema Creation Script

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    member_count INTEGER DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    username VARCHAR(50) NOT NULL,
    chat_room_id BIGINT NOT NULL,
    reply_to_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (reply_to_id) REFERENCES chat_messages(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create shared_goals table
CREATE TABLE IF NOT EXISTS shared_goals (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) DEFAULT 0,
    deadline DATE,
    category VARCHAR(50),
    user_id BIGINT NOT NULL,
    username VARCHAR(50) NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create goal_comments table
CREATE TABLE IF NOT EXISTS goal_comments (
    id BIGSERIAL PRIMARY KEY,
    comment TEXT NOT NULL,
    shared_goal_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    username VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shared_goal_id) REFERENCES shared_goals(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create goal_likes table
CREATE TABLE IF NOT EXISTS goal_likes (
    id BIGSERIAL PRIMARY KEY,
    shared_goal_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shared_goal_id) REFERENCES shared_goals(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(shared_goal_id, user_id)
);

-- Insert initial chat rooms
INSERT INTO chat_rooms (name, description, member_count, last_activity, created_at, updated_at) 
VALUES 
    ('Goals', 'Share and discuss your financial goals with the community', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Budgets', 'Tips, tricks, and discussions about budgeting strategies', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Investing', 'Investment advice, market discussions, and portfolio sharing', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_goals_user_id ON shared_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_goals_public ON shared_goals(is_public);
CREATE INDEX IF NOT EXISTS idx_goal_comments_goal_id ON goal_comments(shared_goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_likes_goal_id ON goal_likes(shared_goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_likes_user_id ON goal_likes(user_id);
