-- ============================================
-- Azure Community Risk Intelligence
-- Database Schema - Phase 4
-- ============================================

-- Drop table if exists (for clean reruns)
DROP TABLE IF EXISTS CommunityReports;

-- Create main reports table
CREATE TABLE CommunityReports (
    report_id INT IDENTITY(1,1) PRIMARY KEY,
    date_reported DATETIME NOT NULL DEFAULT GETDATE(),
    location NVARCHAR(200) NOT NULL,
    category NVARCHAR(50) NOT NULL,
    severity NVARCHAR(20) NOT NULL,
    reporter_type NVARCHAR(50) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    image_url NVARCHAR(500) NULL,
    
    -- AI/ML Fields (will be populated in Phase 6 & 7)
    risk_score DECIMAL(5,2) NULL,
    predicted_risk_level NVARCHAR(20) NULL,
    ai_keywords NVARCHAR(500) NULL,
    ai_sentiment NVARCHAR(20) NULL,
    
    -- Metadata
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Create index for common queries
CREATE INDEX idx_category ON CommunityReports(category);
CREATE INDEX idx_severity ON CommunityReports(severity);
CREATE INDEX idx_date ON CommunityReports(date_reported);
CREATE INDEX idx_location ON CommunityReports(location);

-- Display confirmation
SELECT 'Schema created successfully!' AS Status;
