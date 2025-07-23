-- Migration: Add category column to goals table
ALTER TABLE goals ADD COLUMN category VARCHAR(100);
