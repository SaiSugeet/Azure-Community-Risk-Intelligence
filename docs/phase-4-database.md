# Phase 4: Database Integration

**Project**: Azure Community Risk Intelligence System  
**Phase**: 4 of 9  
**Date Completed**: February 2025  
**Status**: ✅ Completed

---

## 📋 Phase Objectives

**Primary Goal**: Create and populate Azure SQL Database with schema and realistic sample data for community risk reporting system.

**Key Deliverables**:
- SQL database schema matching data model
- Sample dataset with 15 realistic NGO-style reports
- Database connectivity established
- SQL scripts committed to GitHub

---

## 🏗️ What Was Built

### 1. Database Schema (`schema.sql`)

**File Location**: `database/schema.sql`

**Table Structure**: `CommunityReports`

| Column Name | Data Type | Purpose |
|-------------|-----------|---------|
| `report_id` | INT IDENTITY(1,1) PRIMARY KEY | Auto-incrementing unique identifier |
| `date_reported` | DATETIME | Timestamp of report submission |
| `location` | NVARCHAR(200) | Geographic location of issue |
| `category` | NVARCHAR(50) | Issue type (Health/Environment/Safety) |
| `severity` | NVARCHAR(20) | Risk level (High/Medium/Low) |
| `reporter_type` | NVARCHAR(50) | Role of person reporting |
| `description` | NVARCHAR(MAX) | Detailed issue description |
| `image_url` | NVARCHAR(500) NULL | Optional photo evidence |
| `risk_score` | DECIMAL(5,2) NULL | ML-generated score (Phase 7) |
| `predicted_risk_level` | NVARCHAR(20) NULL | ML prediction (Phase 7) |
| `ai_keywords` | NVARCHAR(500) NULL | AI-extracted keywords (Phase 6) |
| `ai_sentiment` | NVARCHAR(20) NULL | AI sentiment analysis (Phase 6) |
| `created_at` | DATETIME | Record creation timestamp |
| `updated_at` | DATETIME | Record modification timestamp |

**Indexes Created**:
- `idx_category` - Speeds up category-based queries
- `idx_severity` - Optimizes severity filtering
- `idx_date` - Improves date range searches
- `idx_location` - Accelerates location lookups

### 2. Sample Data (`sample-data.sql`)

**File Location**: `database/sample-data.sql`

**Dataset Characteristics**:
- **Total Records**: 15 community reports
- **Categories**: Health (5), Environment (6), Safety (4)
- **Severity Distribution**: High (5), Medium (6), Low (4)
- **Reporter Types**: NGO Field Officer, Community Health Worker, Local Government Unit, Individual Citizen, Community Leader, Environmental NGO
- **Geographic Context**: Metro Manila and surrounding Philippine provinces
- **Date Range**: February 6-12, 2025 (recent dates for demo relevance)
- **Realistic Scenarios**: Dengue outbreak, illegal dumping, traffic safety, water pollution, flood warnings, etc.

**Sample Report Examples**:
```
Category: Health | Severity: High
Location: Barangay San Roque, Manila
Description: "Outbreak of dengue fever reported. 12 confirmed cases in the last week..."

Category: Environment | Severity: High  
Location: Pasig River Bank, Mandaluyong
Description: "Illegal waste dumping observed. Approximately 2 tons of industrial waste..."

Category: Safety | Severity: High
Location: Highway 54, Bulacan
Description: "Major pothole causing motorcycle accidents. 3 injuries reported this week..."
```

---

## ☁️ Azure Services Used

### 1. Azure SQL Database
- **Service Name**: `CommunityRiskDB`
- **Server**: `risk-intel-sql-server.database.windows.net`
- **Tier**: Basic (Free-tier compatible)
- **Region**: East Asia
- **Purpose**: Central data storage for all community reports

### 2. Azure SQL Server
- **Resource Name**: `risk-intel-sql-server`
- **Authentication**: SQL Authentication
- **Firewall Configuration**: 
  - Client IP address allowed
  - Azure services access enabled
- **Purpose**: Host for SQL Database

---

## 🔧 Tools & Technologies

### Azure Data Studio
- **Purpose**: Database management GUI
- **Installation Method**: `.deb` package on Parrot OS
- **Key Features Used**:
  - SQL query execution
  - Database schema visualization
  - Connection management
  - Results analysis

### SQL Language Features
- `CREATE TABLE` with IDENTITY columns
- `CREATE INDEX` for query optimization
- `INSERT INTO` with multiple values
- `SELECT` with aggregations and grouping
- `DROP TABLE IF EXISTS` for idempotent scripts

---

## 📚 Key Concepts Learned

### 1. Database Design
**Concept**: Structuring data for efficiency and future AI/ML integration

**Key Principles**:
- Primary keys with auto-increment (IDENTITY)
- Appropriate data types (NVARCHAR for Unicode support)
- NULL vs NOT NULL constraints
- Indexing strategy for common query patterns
- Forward-compatible schema (AI/ML columns prepared but unused)

**Why It Matters**: Good schema design prevents costly migrations and ensures application performance at scale.

---

### 2. Azure SQL Security
**Concept**: Multi-layered database access control

**Security Layers**:
1. **Network Level**: Server firewall rules
2. **Authentication**: SQL Login credentials
3. **Authorization**: Database user permissions (future)
4. **Encryption**: TLS/SSL for data in transit

**Why It Matters**: Cloud databases are internet-accessible by default—firewall rules are the first line of defense.

---

### 3. Sample Data Strategy
**Concept**: Creating realistic test data for demo readiness

**Characteristics of Good Sample Data**:
- Represents diverse real-world scenarios
- Matches production data distribution
- Includes edge cases (NULL values, long text)
- Uses realistic naming and locations
- Provides enough volume for meaningful queries

**Why It Matters**: Quality sample data enables stakeholder demos without manual data entry and helps identify schema issues early.

---

### 4. SQL Indexes
**Concept**: Database optimization structures

**How Indexes Work**:
- Create sorted data structures for specific columns
- Trade storage space for query speed
- Most beneficial for columns used in WHERE, JOIN, ORDER BY

**Index Strategy**:
```sql
-- Indexed columns in our schema
category     → Frequently filtered (Health/Environment/Safety)
severity     → Often used in priority queries
date_reported → Time-range searches
location     → Geographic filtering
```

**Why It Matters**: Without indexes, queries scan entire tables. With indexes, databases jump directly to relevant rows.

---

### 5. Idempotent Scripts
**Concept**: Scripts that can run multiple times safely

**Implementation**:
```sql
DROP TABLE IF EXISTS CommunityReports;  -- Safe cleanup
CREATE TABLE CommunityReports (...);     -- Fresh start
```

**Why It Matters**: Enables testing, development iteration, and recovery without manual cleanup.

---

## 🔐 Security Considerations

### Firewall Configuration
- **Client IP Rule**: Allows development machine access
- **Azure Services Rule**: Enables Azure Functions (Phase 5) to connect
- **Default Deny**: All other traffic blocked

### Credential Management
- ✅ SQL password stored locally (not in Git)
- ✅ Connection strings use environment variables (Phase 5)
- ⚠️ Admin account used (should create app-specific user in production)

### Best Practices Applied
- Mandatory TLS encryption for connections
- No public internet access without firewall rules
- Principle of least privilege (to be implemented in Phase 5)

---

## 📸 Visual Evidence to Capture

### Screenshot Checklist

1. **Azure Portal - SQL Database Overview**
   - Shows `CommunityRiskDB` resource
   - Displays server name and region
   - Confirms active status

2. **Azure Portal - Firewall Rules**
   - Client IP address rule visible
   - Azure services toggle enabled
   - Save confirmation message

3. **Azure Data Studio - Connection**
   - Green connection indicator
   - Database tree showing `CommunityRiskDB`
   - Tables folder expanded with `dbo.CommunityReports`

4. **Azure Data Studio - Schema Verification**
   - Columns list showing all fields
   - Indexes folder showing 4 indexes
   - Primary key indicator on `report_id`

5. **Azure Data Studio - Data Verification**
   - Query results showing 15 rows
   - Category/severity breakdown
   - Sample report details

6. **Terminal - Git Commit**
   - `git log` showing Phase 4 commit
   - Files added: `schema.sql`, `sample-data.sql`

---

## ✅ Phase Completion Checklist

**Database Infrastructure**:
- [x] Azure SQL Database created and accessible
- [x] Firewall rules configured for client access
- [x] Firewall rules configured for Azure services
- [x] Azure Data Studio installed on Parrot OS
- [x] Successful connection to CommunityRiskDB

**Schema & Data**:
- [x] `schema.sql` created with complete table structure
- [x] All 14 columns defined with correct data types
- [x] 4 indexes created for query optimization
- [x] `sample-data.sql` created with 15 realistic reports
- [x] Sample data inserted successfully
- [x] Data distribution verified (3 categories, 3 severity levels)

**Verification**:
- [x] Test queries executed successfully
- [x] Record count matches expected (15 rows)
- [x] Category breakdown confirmed
- [x] Table visible in Azure Data Studio object explorer

**Documentation & Version Control**:
- [x] Both SQL files saved in `database/` folder
- [x] Files added to Git repository
- [x] Commit message follows convention
- [x] Phase 4 documentation created

**Screenshots Captured**:
- [x] Azure Portal firewall configuration
- [x] Azure Data Studio connection
- [x] Database schema structure
- [x] Sample data query results
- [x] Git commit confirmation

---

## 🧪 Testing & Verification

### Verification Queries Run
```sql
-- 1. Confirm table structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'CommunityReports';

-- 2. Verify data insertion
SELECT COUNT(*) AS TotalReports FROM CommunityReports;

-- 3. Check category distribution
SELECT category, COUNT(*) AS count
FROM CommunityReports
GROUP BY category;

-- 4. Confirm severity levels
SELECT severity, COUNT(*) AS count
FROM CommunityReports
GROUP BY severity;

-- 5. Sample data preview
SELECT TOP 5 
    report_id, 
    location, 
    category, 
    severity,
    LEFT(description, 60) + '...' AS preview
FROM CommunityReports
ORDER BY date_reported DESC;
```

**Expected Results**:
- 14 columns in table structure
- 15 total reports
- 3 categories (Health: 5, Environment: 6, Safety: 4)
- 3 severity levels (High: 5, Medium: 6, Low: 4)

---

## 🚨 Common Issues & Solutions

### Issue 1: Cannot Connect to Database
**Error**: "A network-related or instance-specific error occurred"

**Causes**:
- Firewall rule not applied
- Incorrect server name
- Network connectivity issues

**Solutions**:
1. Verify firewall rule exists in Azure Portal
2. Wait 2-3 minutes for rule propagation
3. Confirm server name: `risk-intel-sql-server.database.windows.net`
4. Test connection with `ping` or `nslookup`

---

### Issue 2: Login Failed
**Error**: "Login failed for user 'sqladmin'"

**Causes**:
- Incorrect password
- Wrong username
- Authentication type mismatch

**Solutions**:
1. Verify credentials in Azure Portal → SQL Server → Properties
2. Ensure "SQL Authentication" selected (not Azure AD)
3. Reset password if necessary via Azure Portal

---

### Issue 3: Database Not Found
**Error**: "Cannot open database 'CommunityRiskDB' requested by the login"

**Causes**:
- Typo in database name
- Connected to wrong server
- Database not fully provisioned

**Solutions**:
1. Confirm exact name in Azure Portal (case-sensitive)
2. Verify server and database match
3. Check database status is "Online" in portal

---

### Issue 4: Table Already Exists
**Error**: "There is already an object named 'CommunityReports'"

**Cause**: Schema script run multiple times without DROP statement

**Solution**: 
```sql
-- Script includes this by design - no action needed
DROP TABLE IF EXISTS CommunityReports;
```

---

### Issue 5: Azure Data Studio Installation Fails
**Error**: Dependency issues during `.deb` install

**Solution**:
```bash
sudo apt-get update
sudo apt-get install -f  # Fix broken dependencies
sudo dpkg -i azuredatastudio.deb
```

---

## 📊 Sample Data Breakdown

### Geographic Distribution
- **Metro Manila**: 10 reports (Tondo, San Roque, Quezon City, Pasig, etc.)
- **Nearby Provinces**: 5 reports (Bulacan, Rizal, Cavite, Laguna, Las Piñas)

### Reporter Type Distribution
| Reporter Type | Count |
|---------------|-------|
| NGO Field Officer | 4 |
| Community Health Worker | 4 |
| Individual Citizen | 4 |
| Local Government Unit | 2 |
| Community Leader | 1 |
| Environmental NGO | 2 |

### Timestamp Pattern
- **Date Range**: February 6-12, 2025 (7 days)
- **Time Distribution**: Spread across business hours (7 AM - 10 PM)
- **Recent Bias**: More reports from Feb 10-12 for "current events" feel

---

## 🔄 Rollback Procedure

**To completely reset Phase 4**:
```sql
-- In Azure Data Studio, execute:
DROP TABLE IF EXISTS CommunityReports;
```

**To remove sample data but keep schema**:
```sql
DELETE FROM CommunityReports;
```

**To delete database resource** (nuclear option):
```bash
# In terminal with Azure CLI
az sql db delete \
  --resource-group RiskIntelligenceRG \
  --server risk-intel-sql-server \
  --name CommunityRiskDB \
  --yes
```

---

## 🎯 Success Metrics

**Quantitative**:
- ✅ 1 database table created
- ✅ 14 columns defined
- ✅ 4 indexes implemented
- ✅ 15 sample records inserted
- ✅ 100% data insertion success rate
- ✅ 0 schema errors

**Qualitative**:
- ✅ Schema supports future AI/ML integration
- ✅ Sample data represents realistic NGO scenarios
- ✅ Database accessible from development environment
- ✅ Security best practices followed (firewall, encryption)
- ✅ Idempotent scripts enable safe re-runs

---

## 🔗 Integration Points

### Upstream Dependencies (Completed)
- **Phase 3**: Azure SQL Database resource provisioned
- **Phase 3**: SQL Server resource created
- **Phase 3**: Resource Group established

### Downstream Consumers (Future Phases)
- **Phase 5**: Azure Functions will INSERT new reports
- **Phase 5**: API will SELECT reports for frontend display
- **Phase 6**: AI Text Analytics will UPDATE ai_keywords and ai_sentiment
- **Phase 7**: ML will UPDATE risk_score and predicted_risk_level
- **Phase 8**: Power BI will read all columns for dashboards

---

## 📖 SQL Scripts Reference

### schema.sql Key Sections
```sql
-- Primary structure
CREATE TABLE CommunityReports (
    report_id INT IDENTITY(1,1) PRIMARY KEY,
    -- User-submitted fields
    date_reported DATETIME NOT NULL DEFAULT GETDATE(),
    location NVARCHAR(200) NOT NULL,
    category NVARCHAR(50) NOT NULL,
    severity NVARCHAR(20) NOT NULL,
    reporter_type NVARCHAR(50) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    image_url NVARCHAR(500) NULL,
    
    -- AI/ML enrichment fields (populated later)
    risk_score DECIMAL(5,2) NULL,
    predicted_risk_level NVARCHAR(20) NULL,
    ai_keywords NVARCHAR(500) NULL,
    ai_sentiment NVARCHAR(20) NULL,
    
    -- Metadata
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Performance optimization
CREATE INDEX idx_category ON CommunityReports(category);
CREATE INDEX idx_severity ON CommunityReports(severity);
CREATE INDEX idx_date ON CommunityReports(date_reported);
CREATE INDEX idx_location ON CommunityReports(location);
```

### sample-data.sql Pattern
```sql
INSERT INTO CommunityReports 
(date_reported, location, category, severity, reporter_type, description, image_url)
VALUES
('2025-02-10 09:15:00', 'Barangay San Roque, Manila', 'Health', 'High', 
 'Community Health Worker', 
 'Outbreak of dengue fever reported. 12 confirmed cases...', 
 'https://example.com/dengue-site.jpg'),
-- ... 14 more records
```

---

## 🎓 Learning Outcomes

### Technical Skills Acquired
1. **Azure SQL Database management** via Azure Portal
2. **Firewall configuration** for cloud database security
3. **Azure Data Studio** installation and usage on Linux
4. **SQL DDL** (CREATE TABLE, CREATE INDEX, DROP TABLE)
5. **SQL DML** (INSERT, SELECT with aggregations)
6. **Schema design** with future extensibility
7. **Index strategy** for query optimization

### Cloud Concepts Mastered
- Managed database services vs. self-hosted
- Cloud database security (network, authentication)
- Free-tier resource planning
- Azure service integration patterns

### Best Practices Internalized
- Idempotent infrastructure scripts
- Sample data for demo readiness
- Documentation-driven development
- Git commits at logical checkpoints

---

## ➡️ Next Steps

**Phase 5 Preview**: Azure Functions Backend

**What's Coming**:
1. Create Azure Functions project locally
2. Implement POST endpoint to insert reports
3. Implement GET endpoint to retrieve reports
4. Connect frontend form to backend API
5. Deploy Functions to Azure
6. Test end-to-end data flow

**Prerequisites Completed** ✅:
- Database schema ready
- Sample data available for testing
- Firewall configured for Azure services
- Connection string known

---

## 📝 Additional Notes

### Why This Schema Design?

**Forward Compatibility**: AI/ML columns (`risk_score`, `ai_keywords`, etc.) defined now but remain NULL until Phases 6-7. This avoids schema migrations later.

**Unicode Support**: `NVARCHAR` instead of `VARCHAR` accommodates international characters in location names and descriptions.

**Unlimited Text**: `NVARCHAR(MAX)` for descriptions handles detailed incident reports without truncation.

**Audit Trail**: `created_at` and `updated_at` timestamps track data lifecycle.

### Production Considerations (Future)

**Currently Skipped** (appropriate for learning project):
- Application-specific SQL user (using admin account)
- Row-level security
- Data encryption at rest
- Backup configuration
- High availability setup
- Connection pooling

**When to Implement**: Production deployment or enterprise demo

---

## 🔍 Verification Commands
```bash
# Check Azure Data Studio installation
azuredatastudio --version

# Verify SQL files exist
ls -lh ~/Azure-Community-Risk-Intelligence/database/

# Check Git status
cd ~/Azure-Community-Risk-Intelligence
git log --oneline | grep "Phase 4"

# View file contents
cat database/schema.sql | head -20
```

---

## 🎉 Phase 4 Summary

**Status**: ✅ **COMPLETED**

**Achievements**:
- Production-ready database schema deployed to Azure SQL
- 15 realistic community reports available for testing
- Secure database access configured
- Professional database management workflow established
- Foundation ready for API integration in Phase 5

**Time Investment**: ~45 minutes
**Difficulty Level**: Beginner-Intermediate
**Key Milestone**: Data layer complete ✅

---

**End of Phase 4 Documentation**

---

*Generated for: Azure Community Risk Intelligence System*  
*Phase: 4 of 9*  
*Last Updated: February 2025*  
*Maintainer: Sai Sugeet*