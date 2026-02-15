const { app } = require('@azure/functions');
const { AzureKeyCredential } = require('@azure/core-auth');
const { TextAnalysisClient } = require('@azure/ai-language-text');
const sql = require('mssql');

// Database configuration
const dbConfig = {
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// Azure AI Language configuration
const aiEndpoint = process.env.AI_LANGUAGE_ENDPOINT;
const aiKey = process.env.AI_LANGUAGE_KEY;

// Initialize AI client
const aiClient = new TextAnalysisClient(aiEndpoint, new AzureKeyCredential(aiKey));

// ML Risk Scoring Logic (Rule-Based)
function calculateRiskScore(category, severity, aiUrgency, aiSentiment) {
    // Severity weights
    const severityWeights = {
        'High': 40,
        'Medium': 25,
        'Low': 10
    };

    // Category weights
    const categoryWeights = {
        'Health': 30,
        'Environmental': 25,
        'Safety': 20,
        'Infrastructure': 15,
        'Social': 10
    };

    // Sentiment weights
    const sentimentWeights = {
        'negative': 10,
        'mixed': 5,
        'neutral': 0,
        'positive': -5
    };

    // Calculate base score
    let riskScore = 0;
    riskScore += severityWeights[severity] || 10;
    riskScore += categoryWeights[category] || 10;
    riskScore += (aiUrgency * 30); // Urgency contributes 0-30 points
    riskScore += sentimentWeights[aiSentiment.toLowerCase()] || 0;

    // Ensure score is within 0-100 range
    riskScore = Math.min(Math.max(riskScore, 0), 100);

    return riskScore;
}

// Determine risk level from score
function getRiskLevel(riskScore) {
    if (riskScore >= 70) return 'High';
    if (riskScore >= 40) return 'Medium';
    return 'Low';
}

// Main AI/ML processing function
app.http('aiMlProcessor', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'aiml-process',
    handler: async (request, context) => {
        context.log('AI/ML Processor triggered');

        try {
            // Parse request body
            const requestBody = await request.json();
            const reportId = requestBody.report_id;

            if (!reportId) {
                return {
                    status: 400,
                    jsonBody: {
                        status: 'error',
                        message: 'report_id is required'
                    }
                };
            }

            context.log(`Processing report ID: ${reportId}`);

            // Connect to database
            const pool = await sql.connect(dbConfig);

            // Fetch report from database
            const reportResult = await pool.request()
                .input('reportId', sql.Int, reportId)
                .query(`
                    SELECT report_id, description, category, severity, location
                    FROM CommunityReports
                    WHERE report_id = @reportId
                `);

            if (reportResult.recordset.length === 0) {
                await pool.close();
                return {
                    status: 404,
                    jsonBody: {
                        status: 'error',
                        message: `Report with ID ${reportId} not found`
                    }
                };
            }

            const report = reportResult.recordset[0];
            context.log(`Report found: ${report.description.substring(0, 50)}...`);

            // Initialize AI/ML results with defaults (failover values)
            let aiKeywords = 'error_processing';
            let aiSentiment = 'neutral';
            let aiUrgency = 0.50;
            let riskScore = 50.00;
            let predictedRiskLevel = 'Medium';

            // === AI PROCESSING ===
            try {
                context.log('Calling Azure AI Language service...');

                // Prepare documents for analysis
                const documents = [{
                    id: "1",
                    language: "en",
                    text: report.description
                }];

                // Extract key phrases
                const keyPhrasesResult = await aiClient.analyze("KeyPhraseExtraction", documents);
                for await (const result of keyPhrasesResult) {
                    if (!result.error && result.keyPhrases && result.keyPhrases.length > 0) {
                        aiKeywords = result.keyPhrases.join(', ');
                    } else {
                        aiKeywords = 'no_keywords_detected';
                    }
                }

                // Analyze sentiment
                const sentimentResult = await aiClient.analyze("SentimentAnalysis", documents);
                for await (const result of sentimentResult) {
                    if (!result.error && result.sentiment) {
                        aiSentiment = result.sentiment;
                        
                        // Calculate urgency score based on sentiment confidence
                        const sentimentScores = result.confidenceScores;
                        if (sentimentScores) {
                            // Higher urgency for negative sentiment
                            if (aiSentiment.toLowerCase() === 'negative') {
                                aiUrgency = 0.60 + (sentimentScores.negative * 0.40); // 0.60-1.00
                            } else if (aiSentiment.toLowerCase() === 'mixed') {
                                aiUrgency = 0.40 + (sentimentScores.negative * 0.30); // 0.40-0.70
                            } else {
                                aiUrgency = 0.20 + (sentimentScores.positive * 0.30); // 0.20-0.50
                            }
                        }
                    }
                }

                context.log(`AI Results - Keywords: ${aiKeywords}, Sentiment: ${aiSentiment}, Urgency: ${aiUrgency.toFixed(2)}`);

            } catch (aiError) {
                context.error('AI Processing Error:', aiError.message);
                // Continue with default values (failover)
            }

            // === ML PROCESSING ===
            try {
                context.log('Calculating ML risk score...');

                riskScore = calculateRiskScore(
                    report.category,
                    report.severity,
                    aiUrgency,
                    aiSentiment
                );

                predictedRiskLevel = getRiskLevel(riskScore);

                context.log(`ML Results - Risk Score: ${riskScore.toFixed(2)}, Risk Level: ${predictedRiskLevel}`);

            } catch (mlError) {
                context.error('ML Processing Error:', mlError.message);
                // Continue with default values (failover)
            }

            // === UPDATE DATABASE ===
            try {
                context.log('Updating database with AI/ML results...');

                await pool.request()
                    .input('reportId', sql.Int, reportId)
                    .input('aiKeywords', sql.NVarChar(500), aiKeywords)
                    .input('aiSentiment', sql.NVarChar(20), aiSentiment)
                    .input('aiUrgency', sql.Decimal(3, 2), aiUrgency)
                    .input('riskScore', sql.Decimal(5, 2), riskScore)
                    .input('predictedRiskLevel', sql.NVarChar(20), predictedRiskLevel)
                    .query(`
                        UPDATE CommunityReports
                        SET 
                            ai_keywords = @aiKeywords,
                            ai_sentiment = @aiSentiment,
                            ai_urgency_score = @aiUrgency,
                            risk_score = @riskScore,
                            predicted_risk_level = @predictedRiskLevel,
                            updated_at = GETDATE()
                        WHERE report_id = @reportId
                    `);

                context.log('Database updated successfully');

            } catch (dbError) {
                context.error('Database Update Error:', dbError.message);
                await pool.close();
                return {
                    status: 500,
                    jsonBody: {
                        status: 'error',
                        message: 'Failed to update database',
                        error: dbError.message
                    }
                };
            }

            // Close database connection
            await pool.close();

            // Return success response
            return {
                status: 200,
                jsonBody: {
                    status: 'success',
                    report_id: reportId,
                    ai_results: {
                        keywords: aiKeywords,
                        sentiment: aiSentiment,
                        urgency_score: parseFloat(aiUrgency.toFixed(2))
                    },
                    ml_results: {
                        risk_score: parseFloat(riskScore.toFixed(2)),
                        predicted_risk_level: predictedRiskLevel
                    }
                }
            };

        } catch (error) {
            context.error('Fatal Error:', error.message);
            return {
                status: 500,
                jsonBody: {
                    status: 'error',
                    message: 'Internal server error',
                    error: error.message
                }
            };
        }
    }
});