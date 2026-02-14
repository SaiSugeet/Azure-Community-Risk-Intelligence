# PHASE 5 — BACKEND (AZURE FUNCTIONS)

**Project:** Azure Community Risk Intelligence System  
**Phase:** 5 - Backend API Development  
**Date Completed:** February 13, 2026  
**Environment:** Windows 11  

---

## ✅ PHASE 5 SUCCESS SUMMARY

Phase 5 successfully created and deployed a serverless backend API using Azure Functions to connect the frontend with Azure SQL Database.

---

## 🏗️ ARCHITECTURE
```
User/Frontend → Azure Functions (HTTP) → Azure SQL Database
```

**Components:**
- **Azure Function App:** `community-risk-api`
- **Runtime:** Node.js 22 LTS
- **Hosting Plan:** Consumption (Serverless - FREE)
- **Operating System:** Windows
- **Region:** East Asia
- **Resource Group:** RiskIntelligenceRG

---

## 📡 API ENDPOINTS

### 1. GET /api/getReport
**Purpose:** Retrieve all community reports from database  
**Method:** GET  
**URL:** `https://community-risk-api-e2affkacd6b0djc5.eastasia-01.azurewebsites.net/api/getReport`  
**Response:** JSON array with all reports, ordered by date_reported DESC  

**Sample Response:**
```json
{
  "success": true,
  "count": 16,
  "reports": [ /* array of report objects */ ]
}
```

### 2. POST /api/ingestReport
**Purpose:** Insert new community report into database  
**Method:** POST  
**URL:** `https://community-risk-api-e2affkacd6b0djc5.eastasia-01.azurewebsites.net/api/ingestReport`  
**Content-Type:** application/json  

**Required Fields:**
- `date_reported` (DateTime)
- `location` (String)
- `category` (String: Health/Environment/Safety)
- `severity` (String: Low/Medium/High)
- `description` (String)

**Optional Fields:**
- `reporter_type` (String, default: "Anonymous")
- `image_url` (String)

**Sample Request:**
```json
{
  "date_reported": "2025-02-13T10:00:00Z",
  "location": "Manila City",
  "category": "Health",
  "severity": "Medium",
  "reporter_type": "Community Health Worker",
  "description": "Health issue reported in local community."
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Report inserted successfully",
  "report_id": 17
}
```

---

## 🗄️ DATABASE CONNECTION

**Server:** `risk-intel-sql-server.database.windows.net`  
**Database:** `CommunityRiskDB`  
**Authentication:** SQL Authentication  
**Connection Library:** `mssql` (Node.js pure JavaScript - no ODBC drivers)  

**Environment Variables (Configured in Azure):**
- `SQL_SERVER`
- `SQL_DATABASE`
- `SQL_USER`
- `SQL_PASSWORD`

---

## 📦 DEPENDENCIES

**Package:** `mssql`  
**Purpose:** Azure SQL Database connectivity  
**Version:** Latest (installed via npm)  

---

## 🔒 SECURITY CONFIGURATION

### Firewall Rules
- Client IP addresses whitelisted for development
- Azure services enabled for Function App access

### Application Settings
- Database credentials stored securely in Azure Application Settings
- Settings encrypted at rest
- Not exposed in code or GitHub

---

## ✅ TESTING RESULTS

### Local Testing (localhost:7071)
✅ GET endpoint: Retrieved 16 reports successfully  
✅ POST endpoint: Inserted test report (ID: 16)  
✅ Database connection: Successful  
✅ Error handling: Verified  

### Cloud Testing (Azure)
✅ GET endpoint: Retrieved 16 reports successfully  
✅ Function App status: Running  
✅ Performance: <1 second response time  
✅ Scalability: Consumption plan auto-scales  

---

## 📁 PROJECT STRUCTURE
```
Backend/
├── src/
│   └── functions/
│       ├── getReport.js       # GET endpoint
│       ├── ingestReport.js    # POST endpoint
│       └── index.js           # Function exports
├── node_modules/              # Dependencies
├── .gitignore                 # Git ignore rules
├── .funcignore                # Function ignore rules
├── host.json                  # Function host config
├── local.settings.json        # Local env variables (not in Git)
├── package.json               # Node.js dependencies
├── package-lock.json          # Dependency lock file
└── PHASE-5-BACKEND.md         # This documentation
```

---

## 🎯 KEY LEARNINGS

1. **Node.js vs Python:** Windows Azure Functions has better support for Node.js in Consumption plan
2. **Pure JavaScript SQL:** `mssql` package works without ODBC drivers, perfect for serverless
3. **Firewall Configuration:** Essential to whitelist client IPs for database access
4. **Environment Variables:** `local.settings.json` for local, Application Settings for cloud
5. **Deployment:** VS Code Azure Functions extension simplifies deployment process

---

## 🚀 DEPLOYMENT PROCESS

1. Create Function App in Azure Portal (Windows, Node.js, Consumption)
2. Develop functions locally in VS Code
3. Test locally with `func start`
4. Deploy using VS Code Azure Functions extension
5. Configure Application Settings in Azure Portal
6. Configure SQL Server firewall rules
7. Verify deployment with cloud URLs

---

## 📸 VERIFICATION CHECKLIST

- [x] Function App created and running
- [x] Both functions visible in Azure Portal
- [x] GET endpoint returns correct data
- [x] POST endpoint successfully inserts data
- [x] Database connection working
- [x] Application settings configured
- [x] Firewall rules configured
- [x] Local testing successful
- [x] Cloud testing successful
- [x] Free tier confirmed (Consumption plan)

---

## 🔗 IMPORTANT URLS

- **Function App:** https://portal.azure.com (search: community-risk-api)
- **GET Endpoint:** https://community-risk-api-e2affkacd6b0djc5.eastasia-01.azurewebsites.net/api/getReport
- **POST Endpoint:** https://community-risk-api-e2affkacd6b0djc5.eastasia-01.azurewebsites.net/api/ingestReport

---

## ➡️ NEXT PHASE

**Phase 6:** AI Text Analytics Integration  
- Integrate Azure AI Text Analytics
- Analyze report descriptions for keywords and sentiment
- Populate `ai_keywords` and `ai_sentiment` columns

---

## 📝 NOTES

- Backend developed on Windows due to Azure Functions compatibility
- Will be merged with frontend/database from Parrot OS later
- All services remain within Azure free tier
- Functions tested and verified working end-to-end

---

**Phase 5 Status:** ✅ **COMPLETE**  
**Date:** February 13, 2026  
**Duration:** ~2 hours  
**Result:** Fully functional serverless backend API