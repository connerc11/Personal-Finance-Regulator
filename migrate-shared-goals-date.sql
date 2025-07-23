-- Update shared_goals table columns to DATE type
ALTER TABLE shared_goals ALTER COLUMN target_date TYPE DATE USING target_date::date;
ALTER TABLE shared_goals ALTER COLUMN created_at TYPE DATE USING created_at::date;
ALTER TABLE shared_goals ALTER COLUMN updated_at TYPE DATE USING updated_at::date;
