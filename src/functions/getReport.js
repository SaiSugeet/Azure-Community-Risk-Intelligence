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

app.http('getReport', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Processing getReport request');

        try {
            // Connect to database
            const pool = await sql.connect(config);
            
            // Query all reports
            const result = await pool.request()
                .query('SELECT * FROM CommunityReports ORDER BY date_reported DESC');

            await pool.close();

            return {
                status: 200,
                jsonBody: {
                    success: true,
                    count: result.recordset.length,
                    reports: result.recordset
                }
            };

        } catch (error) {
            context.log('Error:', error);
            return {
                status: 500,
                jsonBody: {
                    success: false,
                    error: 'Failed to retrieve reports',
                    details: error.message
                }
            };
        }
    }
});