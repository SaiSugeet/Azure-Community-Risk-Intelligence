# Azure Machine Learning Workspace - Detailed Documentation

## Overview
The Azure ML Workspace (risk-ml-workspace) was successfully deployed on February 11, 2026, via Azure Portal. This workspace enables lightweight machine learning capabilities for community risk prediction and trend analysis.

---

## Deployment Information

| Property | Value |
|----------|-------|
| **Workspace Name** | risk-ml-workspace |
| **Resource Group** | RiskIntelligenceRG |
| **Region** | East Asia |
| **Deployment Method** | Azure Portal (GUI) |
| **Deployment Date** | February 11, 2026, 21:29:32 UTC |
| **Correlation ID** | 9e13b024-fadf-4332-984c-85e7dba737c7 |
| **Subscription** | Azure subscription 1 |
| **Status** | ✅ Active and Operational |

---

## Auto-Created Supporting Resources

When the ML Workspace was created, Azure automatically provisioned three additional resources:

### 1. Storage Account
- **Purpose:** Store ML experiment data, trained models, datasets
- **Type:** Azure Blob Storage (General Purpose v2)
- **Performance Tier:** Standard
- **Replication:** LRS (Locally Redundant Storage)
- **Usage:** Training data, model artifacts, logs
- **Estimated Cost:** ~$0.50/month (minimal data)

### 2. Key Vault
- **Purpose:** Secure storage for secrets, keys, and certificates
- **Security:** Hardware Security Module (HSM) backed
- **Stores:** Connection strings, API keys, credentials
- **Access Control:** Azure RBAC enabled
- **Estimated Cost:** ~$0.03/month (per secret)

### 3. Application Insights
- **Purpose:** Monitoring, logging, telemetry for ML operations
- **Tracks:** Model performance, API calls, errors, usage metrics
- **Data Retention:** 90 days (default)
- **Integration:** Automatic logging from ML experiments
- **Estimated Cost:** $0/month (5 GB free tier)

---

## Access Methods

### Method 1: Azure Portal
1. Navigate to https://portal.azure.com
2. Search "Machine Learning" in top search bar
3. Click "risk-ml-workspace" from results
4. View dashboard, experiments, models, compute

### Method 2: Azure ML Studio
1. Navigate to https://ml.azure.com
2. Login with Azure credentials
3. Select workspace: "risk-ml-workspace"
4. Use web-based ML development environment

### Method 3: Python SDK
```python
# Install SDK
pip install azure-ai-ml azure-identity

# Connect to workspace
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

ml_client = MLClient(
    credential=DefaultAzureCredential(),
    subscription_id="fdc6d48e-5fc6-4415-9cdb-85ac0e40fedb",
    resource_group_name="RiskIntelligenceRG",
    workspace_name="risk-ml-workspace"
)

# Verify connection
workspace = ml_client.workspaces.get(name="risk-ml-workspace")
print(f"Workspace: {workspace.name}")
print(f"Region: {workspace.location}")
```

### Method 4: Azure CLI (Limited)
```bash
# Note: ML CLI extension had compatibility issues on Parrot OS
# Portal/SDK methods are more reliable

# If extension works:
az ml workspace show \
  --name risk-ml-workspace \
  --resource-group RiskIntelligenceRG
```

---

## Planned ML Use Cases (Phase 6+)

### 1. Community Risk Scoring
**Input Features:**
- Location (area/ward)
- Issue category (health/environment/safety)
- Reported severity level
- Historical issue count in area
- Time of day/week
- Reporter type (citizen/NGO)

**Output:**
- Risk score (0-100)
- Predicted risk level (Low/Medium/High)
- Confidence interval

**Algorithm:** Lightweight regression (Random Forest or Gradient Boosting)

### 2. High-Risk Area Prediction
**Goal:** Identify areas likely to develop serious issues

**Approach:**
- Time-series analysis of historical reports
- Geographic clustering of issues
- Trend detection algorithms

**Output:** List of areas ranked by risk probability

### 3. Issue Severity Classification
**Goal:** Auto-classify issue severity from text descriptions

**Approach:**
- Combine AI Text Analytics sentiment with ML classification
- Train on labeled historical data
- Simple multi-class classifier

**Output:** Severity prediction (Low/Medium/High/Critical)

### 4. Trend Forecasting
**Goal:** Predict future issue volumes and patterns

**Approach:**
- Time-series forecasting (ARIMA or Prophet)
- Seasonal pattern detection
- Anomaly identification

**Output:** 7-day, 30-day forecasts with confidence intervals

---

## ML Development Approach

### Principles
✅ **Lightweight:** No complex deep learning, focus on interpretable models
✅ **Explainable:** Models must be understandable by non-technical NGO staff
✅ **Practical:** Focus on actionable predictions, not academic accuracy
✅ **Fast:** Quick training and inference for real-time use
✅ **Robust:** Handle missing data, imbalanced classes gracefully

### Technology Stack (Phase 6)
- **Framework:** Scikit-learn (simple, well-documented)
- **Data Processing:** Pandas, NumPy
- **Feature Engineering:** Manual feature creation from SQL data
- **Model Storage:** Azure ML Model Registry
- **Deployment:** Azure Functions for inference API

### Model Lifecycle
1. **Data Preparation:** Extract features from SQL Database
2. **Training:** Use Azure ML compute (on-demand)
3. **Evaluation:** Test on held-out data
4. **Registration:** Store model in ML Workspace
5. **Deployment:** Expose via Azure Function endpoint
6. **Monitoring:** Track performance via Application Insights
7. **Retraining:** Monthly or when performance degrades

---

## Integration with Other Components

### With Azure SQL Database
```
SQL Database (CommunityRiskDB)
    ↓ [Query historical data]
ML Workspace (Training)
    ↓ [Train model]
ML Model Registry
    ↓ [Deploy model]
Azure Functions (Inference API)
    ↓ [Real-time predictions]
Frontend / Power BI
```

### With Azure Functions (Phase 5)
- Functions will call ML inference endpoints
- Predictions stored back in SQL Database
- Real-time risk scoring on new report submissions

### With AI Text Analytics (Phase 6)
- AI extracts sentiment, keywords from text descriptions
- ML uses these as additional features
- Combined AI + ML provides richer analysis than either alone

### With Power BI (Phase 7)
- Visualize ML predictions alongside actual data
- Dashboard shows predicted vs actual risk levels
- Helps NGOs validate model accuracy

---

## Cost Management

### Current Costs (Workspace Created, No Compute Running)
| Resource | Cost |
|----------|------|
| ML Workspace | $0/month (no charge for workspace) |
| Storage Account | ~$0.50/month (minimal data) |
| Key Vault | ~$0.03/month (few secrets) |
| Application Insights | $0/month (under 5GB limit) |
| **Total** | **~$0.53/month** |

### Future Costs (When Training/Inference Active)
| Activity | Compute Type | Estimated Cost |
|----------|-------------|----------------|
| **Model Training** | CPU (2-4 cores, 1 hour) | ~$0.50-1.00 per training run |
| **Inference** | Azure Function calls | $0 (free tier 1M calls/month) |
| **Data Storage** | Blob storage (datasets) | ~$1/month for 10GB |

**Expected Monthly Cost (Development):** $2-5/month
**Expected Monthly Cost (Production):** $10-15/month

### Cost Optimization Tips
✅ Use CPU compute (not GPU) - sufficient for lightweight models
✅ Train models on-demand, not continuously
✅ Use serverless inference (Azure Functions) instead of always-on endpoints
✅ Set auto-shutdown rules for compute instances
✅ Monitor via Cost Management + Billing in Azure Portal

---

## Security & Compliance

### Access Control
- **RBAC Enabled:** Only authorized users can access workspace
- **Key Vault Integration:** Secrets never exposed in code
- **Network Security:** Can configure private endpoints (not done yet)

### Data Privacy
- **Training Data:** Stored in dedicated storage account
- **Model Artifacts:** Encrypted at rest
- **Inference Logs:** Retained for 90 days, then deleted

### Audit Trail
- **Activity Logs:** All workspace actions logged
- **Application Insights:** Tracks API calls and errors
- **Compliance:** Meets Azure security standards

---

## Troubleshooting Guide

### Issue: Cannot Access ML Studio
**Solution:**
1. Verify logged into correct Azure account
2. Check subscription has ML Workspace
3. Ensure workspace is in "risk-ml-workspace"
4. Try incognito/private browsing mode

### Issue: Python SDK Connection Fails
**Solution:**
```bash
# Install/upgrade SDK
pip install --upgrade azure-ai-ml azure-identity

# Authenticate
az login

# Verify credentials
az account show
```

### Issue: High Storage Costs
**Solution:**
```bash
# List storage accounts
az storage account list --resource-group RiskIntelligenceRG --output table

# Check storage usage in Azure Portal
# Delete old experiment data if needed
```

---

## Next Steps (Phase 6)

When ready to use ML Workspace:

1. **Prepare Training Data**
   - Export historical reports from SQL Database
   - Create feature engineering pipeline
   - Split into train/test sets

2. **Develop Risk Scoring Model**
   - Start with simple logistic regression
   - Evaluate performance
   - Iterate with Random Forest if needed

3. **Register Model in Workspace**
   - Use MLClient to register trained model
   - Version models appropriately
   - Document model parameters

4. **Deploy Inference Endpoint**
   - Create Azure Function wrapper
   - Test with sample data
   - Integrate with frontend

5. **Monitor Performance**
   - Track prediction accuracy
   - Set up alerts for degradation
   - Plan for model retraining

---

## Useful Resources

- **Azure ML Documentation:** https://docs.microsoft.com/azure/machine-learning/
- **Python SDK Reference:** https://docs.microsoft.com/python/api/overview/azure/ml/
- **ML Studio Guide:** https://docs.microsoft.com/azure/machine-learning/studio/
- **Best Practices:** https://docs.microsoft.com/azure/machine-learning/concept-responsible-ml

---

## Summary

✅ ML Workspace successfully deployed and operational
✅ Supporting infrastructure (storage, vault, insights) created
✅ Multiple access methods available
✅ Cost-optimized configuration
✅ Ready for Phase 6 integration
✅ Lightweight, practical ML approach planned

**Status:** Infrastructure complete, ready for model development in Phase 6

---

*Last Updated: February 11, 2026*
*Document Version: 1.0*
*Author: Sai Sugeet*
