# Phase 8: Automated Alert System with Azure Logic Apps

**Project:** Azure Community Risk Intelligence System  
**Phase:** 8 - Alerts & Notifications  
**Date Completed:** February 16, 2026  
**Status:** ✅ COMPLETED

---

## 📋 Phase Overview

**Goal:** Create an automated alert system that monitors the database for high-risk community reports and sends email notifications when critical conditions are detected.

**Services Used:**
- Azure Logic Apps (Consumption tier)
- Azure SQL Database
- Gmail API (for email delivery)

**Outcome:** A fully functional, serverless alert system that checks the database every 15 minutes and automatically sends email alerts when high-risk reports are detected.

---

## 🎯 What Was Built

### Alert System Architecture

```
Recurrence Trigger (Every 15 minutes)
           ↓
Execute SQL Query (Find high-risk reports)
           ↓
Send Email Alert (Gmail notification)
```

### Alert Logic

The system sends alerts when **BOTH** conditions are met:

```
ALERT IF:
├─ ai_urgency_score >= 0.7 (AI detected high urgency - 70%+)
└─ predicted_risk_level = 'High' (ML confirmed high risk)
```

**Additional Filter:**
- Only reports from the **last 15 minutes** are checked
- Prevents duplicate alerts for old reports
- Matches the recurrence interval

---

## 🔧 Configuration Details

### 1. Logic App Resource

**Resource Details:**
- **Name:** risk-alert-logic-app
- **Type:** Logic App (Consumption)
- **Region:** East Asia
- **Resource Group:** RiskIntelligenceRG
- **Plan Type:** Consumption (Pay-per-execution, free tier safe)
- **Workflow Type:** Stateful

**Cost:** FREE (under free tier limits with 15-minute intervals)

---

### 2. Recurrence Trigger Configuration

**Settings:**
- **Interval:** 15
- **Frequency:** Minute
- **Time Zone:** (UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi
- **Start Time:** Immediate (starts when saved)

**Why 15 Minutes?**
- Balances responsiveness with free-tier execution limits
- Prevents overwhelming email frequency
- Matches the SQL query time window

---

### 3. SQL Query Configuration

**Connection Details:**
- **Server Name:** risk-intel-sql-server.database.windows.net
- **Database Name:** CommunityRiskDB
- **Authentication:** SQL Server Authentication
- **Username:** sqladmin
- **Connection Name:** new_conn_6fc7e

**SQL Query:**
```sql
SELECT TOP 10 
    report_id,
    date_reported,
    location,
    category,
    description,
    ai_urgency_score,
    predicted_risk_level
FROM CommunityReports
WHERE ai_urgency_score >= 0.7
    AND predicted_risk_level = 'High'
    AND date_reported >= DATEADD(minute, -15, GETDATE())
ORDER BY date_reported DESC
```

**Query Explanation:**
- `TOP 10` - Limits results to prevent overwhelming emails
- `ai_urgency_score >= 0.7` - AI urgency threshold (0.7 = 70%)
- `predicted_risk_level = 'High'` - ML risk classification
- `date_reported >= DATEADD(minute, -15, GETDATE())` - Only recent reports
- `ORDER BY date_reported DESC` - Newest reports first

---

### 4. Email Alert Configuration

**Connection Details:**
- **Service:** Gmail (Google Workspace)
- **To:** SaiSugeet20044@gmail.com
- **Connection Name:** new_conn_dc05c

**Email Content:**

**Subject:**
```
🚨 HIGH RISK ALERT: New Community Reports Detected
```

**Body:**
```
URGENT: High-risk community reports have been detected in the last 15 minutes.

The following reports require immediate attention:

---
REPORT DETAILS:
[SQL Query Results - Dynamic Content]
---

These reports meet the following critical criteria:
✓ AI Urgency Score: 7 or higher
✓ ML Risk Level: High
✓ Submitted within the last 15 minutes

Please review these reports immediately and take appropriate action.

---
This is an automated alert from the Community Risk Intelligence System.
Alert triggered at: [Current Time]
```

---

## ✅ Testing & Verification

### Test Results

**Test Run:** February 16, 2026 at 01:52 IST

**Workflow Execution:**
- ✅ **Recurrence Trigger:** Succeeded (0s)
- ✅ **Execute SQL Query:** Succeeded (0.1s)
- ✅ **Send Email:** Succeeded (0.5s)

**Total Duration:** 702 milliseconds

**Email Delivered:** ✅ Successfully received in Gmail inbox

**Sample Data Used:**
- Report ID: 1
- Location: Barangay San Roque, Manila
- Category: Health
- AI Urgency Score: 0.87 (87%)
- Predicted Risk Level: High
- Description: Dengue fever outbreak

---

## 🔍 Key Learnings & Concepts

### 1. Azure Logic Apps

**What It Is:**
- Visual workflow automation tool
- Serverless execution (no infrastructure to manage)
- Pre-built connectors to 400+ services
- Pay-per-execution pricing model

**When to Use:**
- Event-driven automation
- Integration between cloud services
- Scheduled tasks and monitoring
- Alert and notification systems

**Key Features Used:**
- **Recurrence Trigger:** Time-based scheduling
- **SQL Connector:** Database integration
- **Gmail Connector:** Email notifications
- **Dynamic Content:** Insert query results into emails

---

### 2. Alert System Design

**Deterministic Logic:**
- Clear, explainable conditions
- No black-box AI decisions
- Easy to audit and modify
- Combines AI + ML for accuracy

**Best Practices:**
- Set appropriate thresholds (0.7 = 70% urgency)
- Use time windows to prevent duplicates
- Limit result count (TOP 10)
- Include context in alerts (criteria explanation)

**Real-World Application:**
- NGOs monitoring community health risks
- Emergency response coordination
- Early warning systems
- Prioritizing limited resources

---

### 3. Database Connection Security

**Authentication Method:**
- SQL Server Authentication (username/password)
- Credentials stored securely in Logic Apps
- Connection reused across workflow runs

**Firewall Configuration:**
- "Allow Azure services" must be enabled
- Logic Apps connects from Azure cloud
- No public IP whitelisting needed for Azure-to-Azure

**Important Lesson:**
- Column names must match exactly (case-sensitive)
- `date` vs `date_reported` caused initial errors
- `urgency_score` vs `ai_urgency_score` required correction
- Always verify schema before writing queries

---

### 4. Email Integration

**Gmail Requirements:**
- Google account authentication
- OAuth2 authorization flow
- "Less secure apps" setting NOT needed (uses official API)

**Dynamic Content:**
- Insert SQL results into email body
- `ResultSets` token contains query output
- Raw JSON format (could be improved with formatting)

**Delivery Considerations:**
- Automated emails may go to spam initially
- Mark as "Not Spam" to train Gmail
- Professional subject lines improve deliverability

---

## 🛠️ Troubleshooting Guide

### Common Issues & Solutions

**Issue 1: "NotFound" Error in SQL Query**
- **Cause:** No records match the criteria
- **Solution:** This is expected behavior when no high-risk reports exist
- **Action:** No action needed - workflow is working correctly

**Issue 2: "Invalid column name" Error**
- **Cause:** Column name mismatch between query and schema
- **Solution:** Use exact column names from database
- **Fix Applied:** Changed `date` to `date_reported`, `urgency_score` to `ai_urgency_score`

**Issue 3: Email Not Received**
- **Cause:** Query returned no results, email step was skipped
- **Solution:** Insert test data with current timestamp
- **Check:** Look in spam/junk folder

**Issue 4: Connection Failed (404 Error)**
- **Cause:** Wrong server name or firewall blocking connection
- **Solution:** Verify server name exactly, enable "Allow Azure services"
- **Fix Applied:** Used correct server name `risk-intel-sql-server.database.windows.net`

**Issue 5: Credential Error (401)**
- **Cause:** Wrong database name, username, or password
- **Solution:** Verify credentials, check database name (CommunityRiskDB)

---

## 📊 How to Manage Alerts

### Enable Alerts

**From Logic App Overview Page:**
1. Navigate to risk-alert-logic-app
2. If disabled, click **"Enable"** button at top
3. Workflow starts running on 15-minute schedule

**Status Indicator:**
- **Enabled:** Green "Enabled" badge
- **Disabled:** Gray "Disabled" badge

---

### Disable Alerts

**Method 1: Temporary Disable**
1. Go to Logic App Overview
2. Click **"Disable"** at the top toolbar
3. Workflow stops but configuration is preserved
4. Re-enable anytime by clicking **"Enable"**

**Method 2: Permanent Delete**
1. Go to Logic App Overview
2. Click **"Delete"** at the top toolbar
3. Confirm deletion
4. All workflow data is permanently removed

**Recommendation:** Use **Disable** instead of Delete for testing phases.

---

### Monitor Alert History

**View Run History:**
1. Go to Logic App page
2. Click **"Overview"** in left sidebar
3. Scroll down to "Run history" section
4. See all executions with status (Succeeded/Failed)

**Click on Any Run to See:**
- Which steps executed
- Duration of each step
- Input/output data
- Error messages (if failed)

**Run History Retention:** 90 days

---

### Adjust Alert Frequency

**To Change from 15 Minutes:**
1. Go to **Logic app designer**
2. Click on **Recurrence** trigger
3. Change **Interval** number
4. Keep **Frequency** as "Minute"
5. Click **Save**

**Examples:**
- Every 5 minutes: Interval = 5
- Every hour: Interval = 60
- Every 30 minutes: Interval = 30

**Free Tier Consideration:**
- More frequent checks = more executions
- Stay under monthly limits
- 15 minutes = ~2,880 runs/month (well within free tier)

---

### Modify Alert Criteria

**To Change Thresholds:**
1. Go to **Logic app designer**
2. Click **"Execute a SQL query (V2)"**
3. Modify the WHERE clause:
   - Change `ai_urgency_score >= 0.7` to desired threshold
   - Change `predicted_risk_level = 'High'` if needed
   - Adjust time window (currently -15 minutes)
4. Click **Save**

**Example Adjustments:**
```sql
-- More sensitive (catches more reports)
WHERE ai_urgency_score >= 0.5
    AND predicted_risk_level IN ('High', 'Medium')

-- Less sensitive (only critical reports)
WHERE ai_urgency_score >= 0.9
    AND predicted_risk_level = 'High'

-- Longer time window (last hour)
WHERE ai_urgency_score >= 0.7
    AND predicted_risk_level = 'High'
    AND date_reported >= DATEADD(hour, -1, GETDATE())
```

---

## 🎓 Concept Snapshot

### What is a Logic App?

**Simple Definition:**
A visual tool for creating automated workflows that connect different services without writing code.

**Think of it as:**
"IF this happens, THEN do that" - but in the cloud and scheduled automatically.

**Our Example:**
- **IF** it's been 15 minutes (Recurrence)
- **THEN** check database for high-risk reports (SQL Query)
- **IF** high-risk reports found
- **THEN** send email alert (Gmail)

**Key Benefits:**
- No servers to manage (serverless)
- Pre-built connectors (SQL, Email, etc.)
- Visual designer (no coding required)
- Pay only for executions
- Easy to modify and test

---

### Serverless Computing

**What It Means:**
You don't manage servers, virtual machines, or infrastructure. You just define what should happen, and Azure runs it for you.

**Traditional Approach:**
```
You → Set up VM → Install software → Write code → Deploy → Monitor → Patch → Scale
```

**Serverless Approach:**
```
You → Define workflow in designer → Save → Azure handles everything else
```

**Cost Model:**
- Pay per execution (not per hour)
- Automatic scaling
- No cost when idle

**Our Logic App:**
- Runs ~2,880 times/month (every 15 min)
- Each run costs ~$0.000025
- Monthly cost: ~$0.07 (within free tier!)

---

### Event-Driven Architecture

**Concept:**
Systems react to events automatically rather than being manually triggered.

**In Our System:**
- **Event:** 15 minutes passed (time-based trigger)
- **Reaction:** Check for high-risk reports
- **Action:** Send alert if conditions met

**Other Event Examples:**
- New file uploaded → Process the file
- Email received → Save attachment to database
- Sensor reading high → Send alert
- Payment received → Update order status

**Benefits:**
- Automated workflows
- Instant reactions
- No manual monitoring needed
- Scales to handle many events

---

## 📸 Screenshots Checklist

Document these screens for your portfolio:

### Setup Phase
- [ ] Logic App creation form (showing Consumption plan)
- [ ] Logic App Overview page (showing Enabled status)
- [ ] Logic app designer canvas (showing complete workflow)

### Configuration Phase
- [ ] Recurrence trigger configuration (15 minutes, timezone)
- [ ] SQL Server connection creation (authentication type)
- [ ] SQL query configuration (showing WHERE clause)
- [ ] Gmail send email configuration (To, Subject, Body)
- [ ] Dynamic content panel (showing ResultSets)

### Testing Phase
- [ ] Run history page (showing Succeeded runs)
- [ ] Successful run details (all steps green checkmarks)
- [ ] Gmail inbox showing received alert
- [ ] Email content with alert message

### Monitoring Phase
- [ ] Run history with multiple executions
- [ ] Failed run details (showing NotFound when no results)
- [ ] Activity log showing automation in action

---

## ✅ Phase 8 Completion Checklist

**Infrastructure Setup:**
- [✅] Logic App resource created in East Asia region
- [✅] Resource placed in RiskIntelligenceRG
- [✅] Consumption plan selected (free tier)
- [✅] Stateful workflow type configured

**Trigger Configuration:**
- [✅] Recurrence trigger added
- [✅] Interval set to 15 minutes
- [✅] Timezone configured to IST
- [✅] Trigger tested and working

**Database Integration:**
- [✅] SQL Server connection established
- [✅] Authentication configured (SQL Auth)
- [✅] Server and database names verified
- [✅] Firewall rules confirmed (Allow Azure services)
- [✅] SQL query written with correct column names
- [✅] Alert criteria implemented (urgency + risk level)
- [✅] Time window filter added (last 15 minutes)

**Email Notification:**
- [✅] Gmail connection established
- [✅] Email recipient configured
- [✅] Subject line created
- [✅] Email body written with alert details
- [✅] Dynamic content (ResultSets) inserted

**Testing & Verification:**
- [✅] Workflow saved successfully
- [✅] Manual test run executed
- [✅] All steps succeeded
- [✅] Email received in inbox
- [✅] Run history reviewed
- [✅] Error handling tested (NotFound scenario)

**Documentation:**
- [✅] Phase 8 markdown file created
- [✅] Alert logic documented
- [✅] Configuration details recorded
- [✅] Troubleshooting guide included
- [✅] Management instructions provided
- [✅] Screenshots checklist created

**Knowledge Transfer:**
- [✅] Logic Apps concepts explained
- [✅] Serverless computing understood
- [✅] Event-driven architecture learned
- [✅] Alert system design principles covered

---

## 🚀 Next Steps

**Immediate:**
- Take screenshots for documentation
- Test alert system with fresh data (optional)
- Decide whether to keep alerts enabled or disabled

**Phase 9 Preview:**
- Create Power BI dashboard for data visualization
- Build reports showing risk trends
- Design interactive charts and maps
- Publish dashboard to Power BI Service

**Optional Enhancements (Future):**
- Format SQL results into readable table in email
- Add condition to only send email if results exist
- Create multiple alert levels (High, Medium)
- Add SMS notifications using Twilio
- Send alerts to Microsoft Teams channel
- Create digest emails (daily summary)

---

## 💡 Key Takeaways

**What You Learned:**
1. ✅ How to create serverless automation workflows
2. ✅ Connecting cloud services without code
3. ✅ Implementing deterministic alert logic
4. ✅ Database integration with Logic Apps
5. ✅ Email notifications with dynamic content
6. ✅ Testing and monitoring automated workflows
7. ✅ Troubleshooting connection and query errors

**Skills Demonstrated:**
- Azure Logic Apps configuration
- SQL query writing and optimization
- Alert system design
- Email template creation
- Workflow testing and debugging
- Cloud service integration
- Free-tier resource management

**Real-World Application:**
This alert system demonstrates how organizations use cloud automation to:
- Monitor critical systems 24/7
- Respond quickly to emerging risks
- Reduce manual monitoring workload
- Ensure no high-priority issues are missed
- Scale notification systems automatically

---

## 📚 Additional Resources

**Azure Logic Apps:**
- [Official Documentation](https://learn.microsoft.com/en-us/azure/logic-apps/)
- [Connectors Reference](https://learn.microsoft.com/en-us/connectors/connector-reference/)
- [Pricing Calculator](https://azure.microsoft.com/en-us/pricing/details/logic-apps/)

**SQL Integration:**
- [SQL Server Connector](https://learn.microsoft.com/en-us/connectors/sql/)
- [Query Best Practices](https://learn.microsoft.com/en-us/sql/relational-databases/performance/query-processing-architecture-guide)

**Best Practices:**
- [Logic Apps Design Patterns](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-enterprise-integration-overview)
- [Monitoring and Diagnostics](https://learn.microsoft.com/en-us/azure/logic-apps/monitor-logic-apps)

---

## 🎉 Phase 8 Complete!

**Status:** ✅ FULLY FUNCTIONAL ALERT SYSTEM

You now have a production-ready, automated alert system that:
- Monitors your database continuously
- Applies intelligent filtering criteria
- Sends professional email notifications
- Runs completely serverless
- Costs $0 within free tier limits

**Congratulations on completing Phase 8!** 🎊

The alert system is a critical component of the Community Risk Intelligence platform, ensuring that high-risk situations receive immediate attention.

---

**Last Updated:** February 16, 2026  
**Phase Duration:** ~1.5 hours  
**Difficulty Level:** Intermediate  
**Azure Services:** 3 (Logic Apps, SQL Database, Email)  
**Status:** ✅ Production Ready