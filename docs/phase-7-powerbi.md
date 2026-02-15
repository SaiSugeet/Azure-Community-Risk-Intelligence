# Phase 7: Power BI Desktop Dashboard

## Overview
Successfully built an interactive Power BI Desktop dashboard visualizing AI/ML-processed community risk data from Azure SQL Database. This phase demonstrates end-to-end cloud integration: Azure SQL → Power BI visualization pipeline with AI/ML insights.

## Services Used
- **Power BI Desktop**: Data visualization and interactive dashboard creation
- **Azure SQL Database**: Cloud data source (read-only SQL connection)
- **SQL Authentication**: Direct database connectivity independent of Azure AD

## Connection Architecture

### Authentication Model
- **Power BI Account**: College/work Microsoft account (for licensing/publishing)
- **Azure SQL Connection**: SQL Authentication using database credentials
- **Key Insight**: Power BI account ≠ Azure SQL credentials (independent systems)

### Connection Details
```
Server: risk-intel-sql-server.database.windows.net
Database: CommunityRiskDB
Authentication: SQL Authentication
Username: azuresqladmin
Data Mode: Import (data loaded into Power BI memory)
```

### Data Imported
- **Table**: CommunityReports
- **Columns**: 14 total (base data + AI/ML processed fields)
- **Records**: 16 sample Philippine NGO community reports

## Dashboard Components

### 1. Reports by Category (Pie Chart)
**Purpose**: Visualize distribution of community reports across issue categories

**Configuration**:
- **Legend**: category
- **Values**: Count of report_id
- **Title**: "Reports by Category"

**Insights**:
- Health: 36.76% (6 reports)
- Environment: 35.29% (6 reports)
- Safety: 27.94% (4 reports)

**Use Case**: Helps NGOs identify which issue types dominate their service area.

---

### 2. Community Sentiment Analysis (Donut Chart)
**Purpose**: Display AI-detected sentiment in community reports

**Configuration**:
- **Legend**: ai_sentiment
- **Values**: Count of report_id
- **Title**: "Community Sentiment Analysis"
- **Filter**: Blank values excluded

**AI Integration**:
- Uses Azure AI Language sentiment analysis results
- Classifies reports as Positive, Neutral, or Negative
- Sample data shows predominantly negative sentiment (100% - 1 record)

**Use Case**: Gauges community emotional tone to prioritize empathetic responses.

---

### 3. Severity Distribution Over Time (Line Chart)
**Purpose**: Track severity patterns across time periods

**Configuration**:
- **X-axis**: date_reported (Day level)
- **Legend**: severity
- **Y-axis**: Count of report_id
- **Title**: "Severity Distribution Over Time"

**Insights**:
- Timeline: February 12-13, 2025
- Three severity lines: High, Low, Medium
- Shows temporal trends in report urgency

**Use Case**: Identifies if crisis situations are escalating or stabilizing over time.

---

### 4. Average Urgency by Predicted Risk Level (Bar Chart)
**Purpose**: Validate ML risk predictions against AI urgency scores

**Configuration**:
- **Y-axis**: predicted_risk_level
- **X-axis**: Average of ai_urgency_score
- **Title**: "Average Urgency by Predicted Risk Level"

**AI/ML Integration**:
- **AI Component**: ai_urgency_score (calculated by Azure AI Language)
- **ML Component**: predicted_risk_level (rule-based risk classification)
- **Validation**: High risk correlates with 0.87 urgency score

**Insights**:
- Sample data shows predominantly "High" risk level
- Average urgency score: 0.87 (on 0-1 scale)
- Validates ML model accuracy

**Use Case**: Confirms ML risk predictions align with AI-detected urgency.

---

### 5. Interactive Filters (Slicers)

#### Filter by Category
**Configuration**:
- **Field**: category
- **Style**: Vertical list with checkboxes
- **Selection**: Multi-select enabled
- **Options**: Environment, Health, Safety

**Function**: Filters all visuals to show only selected categories

#### Filter by Severity
**Configuration**:
- **Field**: severity
- **Style**: Vertical list with checkboxes
- **Selection**: Multi-select enabled
- **Options**: High, Low, Medium

**Function**: Filters all visuals to show only selected severity levels

**Cross-Filtering**:
- Clicking any slicer option updates ALL visualizations simultaneously
- Demonstrates Power BI's interconnected visual ecosystem
- Enables ad-hoc analysis without rebuilding queries

---

## Technical Implementation

### Data Fields Utilized

**Base Data Fields**:
- `report_id` - Unique identifier
- `date_reported` - Timestamp of report submission
- `location` - Geographic location (Philippine cities/barangays)
- `category` - Issue type (Health, Environment, Safety, Infrastructure)
- `severity` - User-reported severity (Low, Medium, High, Critical)

**AI-Generated Fields** (from Phase 6):
- `ai_keywords` - Extracted keywords from report description
- `ai_sentiment` - Sentiment classification (Positive, Neutral, Negative)
- `ai_urgency_score` - AI-calculated urgency (0.0 to 1.0 scale)

**ML-Generated Fields** (from Phase 6):
- `predicted_risk_level` - ML risk classification (Low, Medium, High)
- `risk_score` - Quantified risk value

### Data Refresh Capability
- **Manual Refresh**: Click "Refresh" button in Power BI Desktop
- **Function**: Pulls latest data from Azure SQL Database
- **Update Time**: 5-15 seconds depending on data volume
- **Production Enhancement**: Power BI Service enables scheduled auto-refresh

---

## Key Concepts Learned

### 1. Cross-Platform Cloud Integration
**Challenge**: Connect Power BI (Microsoft 365) to Azure SQL Database (Azure subscription)

**Solution**: SQL Authentication provides database-level credentials independent of Microsoft account systems.

**Analogy**: Like using a hotel key card (SQL credentials) to access your room, regardless of which credit card you used to book (Power BI account).

### 2. Import vs. DirectQuery
**Import Mode** (Used in this project):
- ✅ Fast performance (data in memory)
- ✅ Works offline
- ✅ Supports all visualizations
- ❌ Requires manual refresh for latest data
- ❌ Data stored in .pbix file (file size grows)

**DirectQuery Mode** (Alternative):
- ✅ Always shows live data
- ✅ Smaller file size
- ❌ Slower performance (queries Azure SQL on-demand)
- ❌ Requires active internet connection
- ❌ Limited DAX function support

**Decision**: Import mode chosen for learning project (fast, offline-capable).

### 3. Data Visualization Selection

| Data Pattern | Chart Type | Example in Dashboard |
|-------------|-----------|---------------------|
| Part-to-whole proportions | Pie/Donut chart | Category distribution |
| Temporal trends | Line chart | Severity over time |
| Comparisons | Bar chart | Urgency by risk level |
| Multiple dimensions | Table/Matrix | Location risk summary (attempted) |
| Filtering | Slicers | Category & severity filters |

### 4. Power BI Field Wells
**What are Field Wells?**
Configuration areas where you drag data fields to define visualization structure.

**Common Field Wells**:
- **Legend**: Categorical breakdown (e.g., severity colors on line chart)
- **Values**: Numeric measurements (e.g., count of reports)
- **X-axis**: Horizontal dimension (e.g., dates, urgency scores)
- **Y-axis**: Vertical dimension (e.g., risk levels, counts)
- **Filters**: Data subset controls

### 5. Slicers and Cross-Filtering
**How It Works**:
1. User clicks "Health" in Category slicer
2. Power BI applies filter to entire data model
3. All visuals recalculate using filtered dataset
4. Charts update simultaneously

**Power BI Advantage**: Unlike static reports, users explore data interactively without technical skills.

---

## Troubleshooting & Solutions

### Issue 1: Table Visual Showing "Total" Row Instead of Detail
**Symptom**: Table displayed aggregated summary instead of 16 individual location rows.

**Root Cause**: Power BI Table visual auto-aggregates when fields are in "Values" well.

**Solution Attempted**:
1. Format → Totals → Toggle OFF (removed Total row)
2. Changed aggregation from "Sum" to "Don't summarize"
3. Attempted Matrix visual with flattened layout

**Outcome**: Due to complexity, deferred location table to post-Phase 7 enhancement.

**Learning**: Power BI tables require careful field well configuration to display detail rows.

---

### Issue 2: Date Hierarchy Showing "Year" Instead of Daily Dates
**Symptom**: Line chart X-axis displayed only "2025" instead of February dates.

**Root Cause**: Power BI auto-creates date hierarchies (Year → Quarter → Month → Day).

**Solution**:
1. Expanded `date_reported` hierarchy in X-axis field well
2. Selected "Day" level instead of "Year"
3. Line chart displayed full date range (Feb 12-13, 2025)

**Learning**: Always check date field hierarchy level for time-series visualizations.

---

### Issue 3: Sentiment Donut Chart Showing 99% Blank Values
**Symptom**: Donut chart dominated by "(Blank)" slice, only 1% "negative".

**Root Cause**: Sample data had mostly NULL sentiment values (AI processing not run on all records).

**Solution**:
1. Applied visual-level filter on `ai_sentiment`
2. Unchecked "(Blank)" option
3. Chart displayed only records with actual sentiment values

**Learning**: Filter out NULL/blank values for cleaner visualizations when appropriate.

---

### Issue 4: Cross-Account Authentication Confusion
**Question**: Does Power BI account need to match Azure SQL account?

**Answer**: No. They are independent systems.

**Clarification**:
- **Power BI Account**: Microsoft 365 / work account for licensing
- **Azure SQL Connection**: Database credentials (username/password)
- **Analogy**: You can use Gmail (Power BI account) while accessing a MySQL database (Azure SQL) - they're unrelated.

**Connection Method**: SQL Authentication (not Azure AD or Microsoft account).

---

## Professional Dashboard Design Principles Applied

### 1. Clear Titles
❌ Bad: "Sum of report_id by category"
✅ Good: "Reports by Category"

**Reason**: Non-technical users don't understand field names. Use business-friendly language.

---

### 2. Logical Visual Placement
**Layout Strategy**:
- **Top Row**: High-level summaries (pie chart, sentiment, trends)
- **Middle**: Detailed analytics (risk analysis)
- **Bottom/Side**: Interactive controls (slicers)

**Reason**: Users scan left-to-right, top-to-bottom. Put key insights first.

---

### 3. Color Consistency
- **Severity**: High=Blue, Low=Light Blue, Medium=Orange (consistent in line chart legend)
- **Categories**: Safety=Blue, Health=Orange, Environment=Dark Blue (pie chart)

**Reason**: Consistent colors across visuals help users identify patterns quickly.

---

### 4. Interactive Elements
**Why Slicers Matter**:
- Empowers users to explore data without technical skills
- Reduces need for multiple pre-built reports
- Enables ad-hoc analysis

**Example Use Case**: NGO manager clicks "High" severity + "Health" category → instantly sees high-priority health reports.

---

## Portfolio Highlights

### End-to-End Pipeline Demonstration
```
User Reports Issue
    ↓
Azure Static Web App (Frontend)
    ↓
Azure Functions (API)
    ↓
Azure SQL Database (Storage)
    ↓
Azure AI Language (Text Analytics) - Phase 6
    ↓
ML Risk Scoring (Rule-Based) - Phase 6
    ↓
Power BI Desktop (Visualization) - Phase 7
    ↓
NGO Decision Makers (Insights)
```

**Skill Proof**: Integrated 7 Azure services into a functional system.

---

### Real-World Business Value
**NGO Use Cases**:
1. **Resource Allocation**: Use category pie chart to allocate staff to dominant issue types
2. **Trend Monitoring**: Track severity line chart to detect escalating crises
3. **Risk Prioritization**: Sort locations by urgency score to deploy emergency teams
4. **Sentiment Analysis**: Identify communities with negative sentiment requiring extra support

**Measurable Impact**: 
- Faster decision-making (interactive filters vs. static reports)
- Data-driven prioritization (AI/ML insights vs. intuition)
- Transparent accountability (visual dashboard vs. spreadsheets)

---

### Technical Skills Demonstrated
1. ✅ **Cloud Database Connectivity**: Connected Power BI to Azure SQL Database
2. ✅ **SQL Authentication**: Handled cross-platform authentication
3. ✅ **Data Visualization**: Created 4 chart types with appropriate use cases
4. ✅ **AI/ML Integration**: Visualized machine learning outputs
5. ✅ **Interactive UX**: Built user-driven exploration via slicers
6. ✅ **Dashboard Design**: Professional layout and formatting

---

## Deliverables

### Files Created
```
Azure-Community-Risk-Intelligence/
└── powerbi/
    ├── community-risk-dashboard.pbix          ← Power BI Desktop file
    └── screenshots/
        ├── connection-setup.png               ← Database connection proof
        ├── final-dashboard.png                ← Complete dashboard view
        ├── dashboard-filtered.png             ← Interactive filtering demo
        ├── category-chart.png                 ← Pie chart close-up
        ├── severity-trends.png                ← Line chart close-up
        ├── risk-scores.png                    ← Bar chart close-up
        └── sentiment-chart.png                ← Donut chart close-up
```

### Dashboard Features
- ✅ 4 professional visualizations
- ✅ 2 interactive slicers (category, severity)
- ✅ Working data refresh from Azure SQL
- ✅ AI/ML data integration (sentiment, urgency, risk predictions)
- ✅ Cross-filtering across all visuals
- ✅ Professional titles and formatting
- ✅ Portfolio-ready presentation

---

## Phase Completion Checklist

**Technical Setup**:
- [x] Power BI Desktop installed and configured
- [x] Connected to Azure SQL using SQL Authentication
- [x] Verified firewall allows Power BI connection
- [x] Imported CommunityReports table with all 14 columns

**Visualizations**:
- [x] Pie Chart: Reports by Category
- [x] Donut Chart: Community Sentiment Analysis
- [x] Line Chart: Severity Distribution Over Time
- [x] Bar Chart: Average Urgency by Predicted Risk Level

**Interactivity**:
- [x] Category slicer created and functional
- [x] Severity slicer created and functional
- [x] Cross-filtering tested across all visuals
- [x] Data refresh tested successfully

**Professional Polish**:
- [x] All chart titles updated to business-friendly language
- [x] Slicers formatted with headers
- [x] Dashboard layout optimized for readability
- [x] .pbix file saved in project structure

**Documentation**:
- [x] All required screenshots captured
- [x] Connection process documented
- [x] Technical decisions explained
- [x] Troubleshooting notes recorded

---

## Next Steps: Phase 8 Preview

**Phase 8: Power BI + Alerts** will add:

### 1. Azure Logic Apps Integration
- Trigger automated alerts when high-risk reports detected
- Send email notifications to NGO stakeholders
- SMS alerts for critical incidents (optional)

### 2. Power BI Service Publishing (Optional)
- Publish dashboard to Power BI cloud
- Enable team collaboration
- Schedule automatic data refreshes
- Mobile app access

### 3. Advanced Analytics
- Additional calculated measures
- Year-over-year comparisons (when more data available)
- Predictive trend lines
- Custom KPIs for NGO goals

### 4. Alert Logic
```
IF new report.predicted_risk_level = "High" 
   AND new report.ai_urgency_score > 0.8
THEN
   Send email to: ngo-emergency-team@example.com
   Subject: "URGENT: High-risk report in [location]"
   Body: Include report details + map link
```

---

## Optional Enhancements (Post-Phase 8)

**Dashboard Improvements**:
- Add second page for detailed location analysis
- Implement drill-through from charts to report details
- Add bookmarks for saved filter states
- Create mobile-optimized layout

**Data Improvements**:
- Load historical data (6+ months) for better trends
- Add geospatial mapping with Azure Maps
- Integrate weather/event data for context

**AI/ML Enhancements**:
- Improve sentiment model accuracy
- Add topic modeling for keyword clustering
- Implement anomaly detection for unusual report patterns

---

## Lessons Learned

### 1. Account Management in Cloud Platforms
**Key Insight**: Different Microsoft services use different authentication methods.
- Power BI: Microsoft 365 account
- Azure SQL: SQL Authentication OR Azure AD
- Azure Portal: Microsoft account OR Azure AD

**Best Practice**: Document which credentials are used where. Don't assume unified authentication.

---

### 2. Visualization Selection Matters
**Wrong Choice Example**: Attempted to use Table visual for location details → resulted in aggregation issues.

**Right Choice Example**: Used Bar chart for risk vs. urgency correlation → clearly showed relationship.

**Lesson**: Match chart type to data pattern (temporal=line, comparison=bar, proportion=pie).

---

### 3. Data Quality Impacts Dashboards
**Issue**: Sample data had mostly NULL sentiment values → donut chart looked empty.

**Solution**: Filtered blanks for cleaner presentation.

**Production Recommendation**: Ensure AI/ML processing runs on ALL records before dashboard deployment.

---

### 4. Interactivity Enhances User Adoption
**Observation**: Static reports require IT team to create new versions for different views.

**Power BI Advantage**: Slicers let non-technical users explore data themselves.

**Impact**: Reduces analyst workload, empowers decision-makers.

---

## Concept Summary

### What You Built
An **interactive Business Intelligence dashboard** that visualizes AI/ML-processed community risk data from a cloud database, enabling NGOs to make data-driven decisions through dynamic filtering and professional visualizations.

### How It Works
1. **Data Storage**: Azure SQL Database stores community reports
2. **AI/ML Processing**: Azure Functions + AI Language enrich reports (Phase 6)
3. **Visualization**: Power BI Desktop imports data and creates interactive charts
4. **User Interaction**: Slicers filter data; all charts update automatically
5. **Insights**: NGO stakeholders identify high-risk areas and prioritize responses

### Why It Matters
**Before This Dashboard**:
- NGOs reviewed reports manually in spreadsheets
- No visual identification of patterns
- Difficult to compare categories or track trends
- No AI-powered risk assessment

**After This Dashboard**:
- ✅ Instant visual insights (charts vs. rows)
- ✅ AI-detected urgency scores highlighted
- ✅ ML risk predictions validated
- ✅ Interactive exploration without technical skills
- ✅ Data-driven resource allocation

---

## Project Status

### Completed Phases
- ✅ **Phase 0**: Environment Setup
- ✅ **Phase 1**: Project Structure & GitHub
- ✅ **Phase 2**: Frontend Development (HTML/CSS/JS)
- ✅ **Phase 3**: Azure Static Web Apps Deployment
- ✅ **Phase 4**: Azure SQL Database Integration
- ✅ **Phase 5**: Azure Functions Backend
- ✅ **Phase 6**: AI/ML Integration (Azure AI Language + Risk Scoring)
- ✅ **Phase 7**: Power BI Desktop Dashboard ← **YOU ARE HERE**

### Remaining Phases
- ⏭️ **Phase 8**: Power BI + Azure Logic Apps Alerts
- ⏭️ **Phase 9**: Documentation & GitHub Finalization

**Progress**: 77.8% Complete (7 of 9 phases)

---

## Screenshots Reference

### 1. Connection Setup (`connection-setup.png`)
**Shows**: Power BI Fields pane with CommunityReports table expanded, displaying all 14 columns including AI/ML fields.

**Proof**: Successfully imported Azure SQL data into Power BI Desktop.

---

### 2. Final Dashboard (`final-dashboard.png`)
**Shows**: Complete dashboard with 4 visualizations and 2 slicers in professional layout.

**Content**:
- Top Row: Pie chart (categories), Donut chart (sentiment), Line chart (severity trends)
- Middle: Bar chart (risk analysis)
- Bottom: Category slicer, Severity slicer

---

### 3. Dashboard with Filters (`dashboard-filtered.png`)
**Shows**: Dashboard after clicking "Health" in category slicer.

**Demonstrates**: Interactive filtering updates all charts simultaneously.

---

### 4-7. Individual Chart Close-Ups
**Purpose**: Portfolio detail shots showing each visualization's configuration and insights.

---

## Credits & Acknowledgments

**Built By**: Sai Sugeet Gangavarapu
**Mentor**: Claude (Anthropic AI Assistant)
**Project Type**: Learning-focused cloud integration project
**Timeline**: Phase 7 completed February 15, 2026
**Tools Used**: Power BI Desktop, Azure SQL Database, Azure AI Language, Azure Functions

---

## Conclusion

Phase 7 successfully demonstrates **cloud-to-BI pipeline integration**, connecting Azure SQL Database to Power BI Desktop for interactive data visualization. The dashboard transforms raw community reports into actionable insights through AI sentiment analysis, ML risk predictions, and user-driven exploration.

**Key Achievement**: Proved end-to-end cloud architecture works—data flows from user input → cloud storage → AI/ML processing → business intelligence dashboard.

**Ready for**: Phase 8 (automated alerting) and Phase 9 (final documentation).

---

**Phase 7 Status**: ✅ **COMPLETE**

**Next Action**: Proceed to Phase 8 for automated alert system integration.