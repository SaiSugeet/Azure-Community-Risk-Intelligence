# Phase 6: AI & ML Integration

**Status:** ✅ COMPLETE  
**Date Completed:** February 15, 2026  
**Duration:** ~2 hours (including troubleshooting)

---

## 🎯 Phase Objective

Integrate Azure AI Language service and implement lightweight ML risk scoring to analyze community reports automatically.

---

## 📋 What Was Built

### 1. **Azure AI Language Service**
- **Service Name:** `risk-intel-language`
- **Region:** East Asia
- **Pricing Tier:** Free F0 (5,000 transactions/month)
- **Features Enabled:**
  - Sentiment Analysis
  - Key Phrase Extraction

### 2. **AI/ML Processing Function**
- **Function Name:** `aiMlProcessor`
- **Trigger Type:** HTTP POST
- **Route:** `/api/aiml-process`
- **Runtime:** Node.js 22
- **Dependencies:**
  - `@azure/ai-language-text` - Azure AI SDK
  - `@azure/core-auth` - Authentication
  - `mssql` - Database connectivity

### 3. **Database Schema**
Already prepared with AI/ML columns:
- `ai_keywords` (NVARCHAR(500))
- `ai_sentiment` (NVARCHAR(20))
- `ai_urgency_score` (DECIMAL(3,2))
- `risk_score` (DECIMAL(5,2))
- `predicted_risk_level` (NVARCHAR(20))

---

## 🔄 System Workflow
```
1. HTTP POST /api/aiml-process
   Body: { "report_id": 123 }
        ↓
2. Fetch report from Azure SQL Database
   (description, category, severity, location)
        ↓
3. AI PROCESSING (Azure AI Language)
   ├─ Extract keywords from description
   ├─ Analyze sentiment (positive/negative/neutral/mixed)
   └─ Calculate urgency score (0.00 - 1.00)
        ↓
4. ML PROCESSING (Rule-Based Scoring)
   Input: severity, category, AI urgency, sentiment
   Output: risk_score (0-100), risk_level (Low/Medium/High)
        ↓
5. Update database with AI/ML results
        ↓
6. Return JSON response with results
```

---

## 🧠 AI Processing Logic

### **Key Phrase Extraction**
- Uses Azure AI Language's pre-trained model
- Extracts meaningful phrases from report description
- Example: "dengue fever, stagnant water, urgent fumigation"

### **Sentiment Analysis**
- Detects emotional tone: positive, negative, neutral, mixed
- Returns confidence scores for each sentiment
- Example: "negative" with 0.95 confidence

### **Urgency Calculation**
```javascript
if (sentiment === 'negative') {
    urgency = 0.60 + (negative_confidence * 0.40)  // Range: 0.60-1.00
} else if (sentiment === 'mixed') {
    urgency = 0.40 + (negative_confidence * 0.30)  // Range: 0.40-0.70
} else {
    urgency = 0.20 + (positive_confidence * 0.30)  // Range: 0.20-0.50
}
```

---

## 🤖 ML Risk Scoring Logic

### **Rule-Based Weighted Scoring**
```javascript
Severity Weights:
- High: 40 points
- Medium: 25 points
- Low: 10 points

Category Weights:
- Health: 30 points
- Environmental: 25 points
- Safety: 20 points
- Infrastructure: 15 points
- Social: 10 points

Urgency Contribution:
- AI urgency_score * 30 (contributes 0-30 points)

Sentiment Weights:
- Negative: +10 points
- Mixed: +5 points
- Neutral: 0 points
- Positive: -5 points

TOTAL RISK SCORE = severity + category + urgency + sentiment
(Clamped to 0-100 range)
```

### **Risk Level Thresholds**
- **High:** risk_score ≥ 70
- **Medium:** 40 ≤ risk_score < 70
- **Low:** risk_score < 40

---

## 🔐 Configuration

### **Environment Variables (Azure Function App Settings)**
```
AI_LANGUAGE_ENDPOINT = https://risk-intel-language.cognitiveservices.azure.com/
AI_LANGUAGE_KEY = [64-character API key]
SQL_SERVER = risk-intel-sql-server.database.windows.net
SQL_DATABASE = CommunityRiskDB
SQL_USER = sqladmin
SQL_PASSWORD = [encrypted password]
```

### **Local Settings (local.settings.json)**
Same variables stored locally for development/testing.  
⚠️ File is in `.gitignore` - never committed to GitHub.

---

## 🧪 Testing Results

### **Test Case: Report #1 (Dengue Outbreak)**

**Input:**
```json
{
  "report_id": 1,
  "description": "Outbreak of dengue fever reported. 12 confirmed cases in the last week. Stagnant water observed in multiple locations. Urgent fumigation needed.",
  "category": "Health",
  "severity": "High"
}
```

**AI Results:**
```json
{
  "keywords": "dengue fever, last week, Stagnant water, multiple locations, Urgent fumigation, Outbreak, cases, 12",
  "sentiment": "negative",
  "urgency_score": 0.87
}
```

**ML Results:**
```json
{
  "risk_score": 100.00,
  "predicted_risk_level": "High"
}
```

**Database Update:** ✅ Successful  
**Response Time:** ~3 seconds (cloud), ~1.5 seconds (local)

---

## 🛠️ Troubleshooting Log

### **Issue 1: Package Import Error**
**Error:** `TextAnalyticsClient is not a constructor`  
**Cause:** Wrong import syntax for `@azure/ai-language-text` package  
**Solution:** 
- Changed from `TextAnalyticsClient` to `TextAnalysisClient`
- Separated `AzureKeyCredential` import from `@azure/core-auth`
- Installed `@azure/core-auth` package separately

### **Issue 2: Database Connection Timeout**
**Error:** `Failed to connect to risk-intel-sql-server.database.windows.net:1433 in 15000ms`  
**Cause:** Local IP not in Azure SQL firewall rules  
**Solution:** Added client IP address to SQL Server networking settings

### **Issue 3: AI API Authentication Failed**
**Error:** `Access denied due to invalid subscription key or wrong API endpoint`  
**Cause:** Typo in API key when copying from Azure Portal  
**Solution:** Re-copied KEY 1 from Azure Portal and updated `local.settings.json`

### **Issue 4: Azure CLI Login MFA Issue**
**Error:** `No subscriptions found` with MFA authentication error  
**Cause:** Azure CLI MFA issues on Windows  
**Solution:** Used VS Code Azure Functions extension for deployment instead

---

## 🚀 Deployment Details

### **Deployment Method:** VS Code Azure Functions Extension

**Steps:**
1. Installed Azure Functions extension in VS Code
2. Signed in to Azure (completed MFA in browser)
3. Right-clicked Function App → "Deploy to Function App"
4. Deployment completed in ~45 seconds

### **Production Endpoints**

**Base URL:**
```
https://community-risk-api-e2affkacd6b0djc5.eastasia-01.azurewebsites.net
```

**AI/ML Processor:**
```
POST /api/aiml-process
Content-Type: application/json

{
  "report_id": 1
}
```

**Response:**
```json
{
  "status": "success",
  "report_id": 1,
  "ai_results": {
    "keywords": "extracted phrases here",
    "sentiment": "negative",
    "urgency_score": 0.87
  },
  "ml_results": {
    "risk_score": 85.50,
    "predicted_risk_level": "High"
  }
}
```

---

## ✅ Verification Checklist

- [x] Azure AI Language service created and configured
- [x] API credentials stored in Function App settings
- [x] `aiMlProcessor` function created with complete logic
- [x] AI processing working (keyword extraction + sentiment analysis)
- [x] ML risk scoring implemented and tested
- [x] Database updates successful with AI/ML results
- [x] Local testing passed (all features working)
- [x] Cloud deployment successful
- [x] Production endpoint tested and verified
- [x] Error handling and failover logic implemented
- [x] Documentation completed

---

## 📸 Screenshots to Capture

1. ✅ Azure AI Language service overview page
2. ✅ Keys and Endpoint page (blur sensitive keys)
3. ✅ Function App environment variables showing AI credentials
4. ✅ VS Code with `aiMlProcessor.js` code
5. ✅ Local test results in PowerShell
6. ✅ Database query showing updated AI/ML fields
7. ✅ VS Code deployment success notification
8. ✅ Cloud test results showing production endpoint working

---

## 🎓 Key Concepts Learned

### **Azure AI Language**
- Pre-trained NLP models accessible via REST API
- No training data required - works out of the box
- Free tier sufficient for demo projects (5K transactions/month)
- Regional deployment affects endpoint URL

### **Rule-Based ML**
- Simple weighted scoring can be very effective
- Explainable logic (vs black-box models)
- No training pipeline needed (free-tier friendly)
- Easy to adjust weights based on domain knowledge

### **Failover Strategy**
- AI/ML failures should not block entire process
- Default values allow system to continue functioning
- Logs capture errors for debugging
- Graceful degradation improves reliability

### **Environment Variables**
- Secure way to store credentials
- Different values for local vs cloud
- Never commit secrets to GitHub
- Easy to rotate keys without code changes

---

## 🔄 Integration with Other Phases

**Phase 4 (Database):** Uses existing schema with forward-compatible AI/ML columns  
**Phase 5 (Backend):** Extends existing Node.js Function App  
**Phase 7 (Future):** Could add advanced ML models if needed  
**Phase 8 (Power BI):** Will visualize AI/ML results in dashboards

---

## 💡 Future Enhancements (Optional)

1. **Advanced ML Models:**
   - Train custom model on historical data
   - Use Azure Machine Learning Workspace
   - Implement time-series risk prediction

2. **Additional AI Features:**
   - Entity recognition (extract locations, organizations)
   - Language detection for multilingual support
   - Text classification for automatic categorization

3. **Real-Time Processing:**
   - Trigger AI/ML automatically after ingestReport
   - Use Azure Logic Apps for workflow automation
   - Implement webhook notifications

4. **Batch Processing:**
   - Analyze multiple reports at once
   - Schedule nightly AI/ML runs
   - Generate trend reports

---

## 🎯 Success Metrics

- ✅ **AI Accuracy:** Keywords relevant to report content
- ✅ **Sentiment Accuracy:** Matches human assessment
- ✅ **Risk Score Logic:** High severity + negative sentiment = high risk
- ✅ **Response Time:** <5 seconds for cloud requests
- ✅ **Reliability:** 100% success rate in testing (with failover)
- ✅ **Cost:** $0.00 (Free tier services only)

---

## 📚 Resources Used

**Azure Services:**
- Azure AI Language (Text Analytics)
- Azure Functions (Node.js runtime)
- Azure SQL Database

**NPM Packages:**
- `@azure/ai-language-text@1.1.0`
- `@azure/core-auth@1.5.0`
- `mssql@9.1.1`

**Documentation:**
- https://learn.microsoft.com/en-us/azure/ai-services/language-service/
- https://learn.microsoft.com/en-us/javascript/api/@azure/ai-language-text/

---

## ⏭️ Next Steps

**Phase 7:** Advanced ML (if needed) or skip to Phase 8  
**Phase 8:** Power BI Dashboard + Alerts  
**Phase 9:** Final Documentation & GitHub Finalization

---

**End of Phase 6 Documentation**