const { app } = require('@azure/functions');
const sql = require('mssql');

// SQL Database configuration
const config = {
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

app.http('ingestReport', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Processing ingestReport request');

        try {
            // Get JSON body from request
            const report = await request.json();
            
            // Validate required fields
            if (!report.date_reported || !report.location || !report.category || !report.severity || !report.description) {
                return {
                    status: 400,
                    jsonBody: { 
                        error: 'Missing required fields',
                        required: ['date_reported', 'location', 'category', 'severity', 'description']
                    }
                };
            }

            // Connect to database
            const pool = await sql.connect(config);
            
            // Insert report
            const result = await pool.request()
                .input('date_reported', sql.DateTime, report.date_reported)
                .input('location', sql.NVarChar(200), report.location)
                .input('category', sql.NVarChar(50), report.category)
                .input('severity', sql.NVarChar(20), report.severity)
                .input('reporter_type', sql.NVarChar(50), report.reporter_type || 'Anonymous')
                .input('description', sql.NVarChar(sql.MAX), report.description)
                .input('image_url', sql.NVarChar(500), report.image_url || null)
                .query(`
                    INSERT INTO CommunityReports 
                    (date_reported, location, category, severity, reporter_type, description, image_url)
                    VALUES (@date_reported, @location, @category, @severity, @reporter_type, @description, @image_url);
                    SELECT SCOPE_IDENTITY() AS report_id;
                `);

            await pool.close();

            return {
                status: 201,
                jsonBody: {
                    success: true,
                    message: 'Report inserted successfully',
                    report_id: result.recordset[0].report_id
                }
            };

        } catch (error) {
            context.log('Error:', error);
            return {
                status: 500,
                jsonBody: {
                    success: false,
                    error: 'Failed to insert report',
                    details: error.message
                }
            };
        }
    }
});