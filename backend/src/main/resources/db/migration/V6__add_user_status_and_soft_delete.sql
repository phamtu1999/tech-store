-- Add new columns to users table for enhanced user management
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Update existing users to have ACTIVE status
UPDATE users SET status = 'ACTIVE' WHERE status IS NULL;

-- Update existing users email_verified based on active status
UPDATE users SET email_verified = TRUE WHERE active = TRUE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_deleted ON users(deleted);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Add constraint to ensure status is valid
ALTER TABLE users ADD CONSTRAINT chk_user_status 
    CHECK (status IN ('ACTIVE', 'LOCKED', 'UNVERIFIED'));
