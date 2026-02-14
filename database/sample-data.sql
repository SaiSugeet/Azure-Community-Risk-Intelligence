-- ============================================
-- Sample Community Reports Dataset
-- Realistic NGO-style data for demo
-- ============================================

-- Insert 15 diverse community reports
INSERT INTO CommunityReports 
(date_reported, location, category, severity, reporter_type, description, image_url)
VALUES

-- Health Reports
('2025-02-10 09:15:00', 'Barangay San Roque, Manila', 'Health', 'High', 'Community Health Worker', 
'Outbreak of dengue fever reported. 12 confirmed cases in the last week. Stagnant water observed in multiple locations. Urgent fumigation needed.', 
'https://example.com/dengue-site.jpg'),

('2025-02-09 14:30:00', 'Tondo District, Manila', 'Health', 'Medium', 'NGO Field Officer', 
'Community members reporting respiratory issues near industrial area. Air quality concerns raised by 8 families. Requesting environmental health assessment.', 
NULL),

('2025-02-08 11:00:00', 'Quezon City, Metro Manila', 'Health', 'Low', 'Individual Citizen', 
'Public water fountain not functioning for 3 days. Community requesting repair for safe drinking water access.', 
NULL),

-- Environmental Reports
('2025-02-11 16:45:00', 'Pasig River Bank, Mandaluyong', 'Environment', 'High', 'Environmental NGO', 
'Illegal waste dumping observed. Approximately 2 tons of industrial waste deposited overnight. Chemical smell detected. Immediate cleanup required.', 
'https://example.com/waste-dump.jpg'),

('2025-02-10 08:20:00', 'Laguna Lake Shore, Rizal', 'Environment', 'Medium', 'Community Leader', 
'Water pollution affecting fishing community. Dead fish observed floating. 15 families dependent on fishing impacted. Water testing requested.', 
'https://example.com/lake-pollution.jpg'),

('2025-02-07 13:10:00', 'Antipolo City, Rizal', 'Environment', 'Low', 'Individual Citizen', 
'Illegal logging activity suspected in protected forest area. 4 trees marked for cutting. Requesting forest ranger patrol.', 
NULL),

-- Safety Reports
('2025-02-11 19:30:00', 'Highway 54, Bulacan', 'Safety', 'High', 'Local Government Unit', 
'Major pothole causing motorcycle accidents. 3 injuries reported this week. Road shoulder collapsed during heavy rain. Emergency repair needed.', 
'https://example.com/highway-damage.jpg'),

('2025-02-09 22:00:00', 'Barangay Payatas, Quezon City', 'Safety', 'Medium', 'Community Health Worker', 
'Street lighting failure in residential area. 6 blocks affected for 5 days. Safety concern for women and children. Increased crime reports.', 
NULL),

('2025-02-06 07:45:00', 'Caloocan City Market District', 'Safety', 'Low', 'Individual Citizen', 
'Sidewalk obstruction by vendor stalls. Pedestrians forced to walk on road. Requesting traffic enforcement.', 
NULL),

-- Mixed Category Reports
('2025-02-11 10:00:00', 'Marikina City Flood Zone', 'Environment', 'High', 'NGO Field Officer', 
'Flash flood warning. River water level rising rapidly. 200 families in evacuation area. Requesting emergency response coordination.', 
'https://example.com/flood-warning.jpg'),

('2025-02-10 15:20:00', 'Navotas Fish Port', 'Health', 'Medium', 'Environmental NGO', 
'Unsanitary fish processing conditions. Wastewater flowing into residential area. 10 households affected. Health and environmental hazard.', 
'https://example.com/fish-port.jpg'),

('2025-02-08 09:00:00', 'Cavite Industrial Zone', 'Safety', 'Medium', 'Local Government Unit', 
'Factory fire escape routes blocked by storage. Safety inspection revealed violations. 80 workers at risk. Compliance order issued.', 
NULL),

('2025-02-07 16:30:00', 'Las Piñas Coastal Area', 'Environment', 'Low', 'Individual Citizen', 
'Plastic waste accumulation on beach. Affecting turtle nesting site. Community cleanup organized for weekend.', 
'https://example.com/beach-cleanup.jpg'),

('2025-02-12 08:45:00', 'Muntinlupa City School Zone', 'Safety', 'High', 'Community Leader', 
'Broken traffic light at elementary school crossing. Near-miss accidents daily. 500+ students affected. Urgent repair requested.', 
'https://example.com/school-crossing.jpg'),

('2025-02-11 12:00:00', 'Parañaque City Barangay Hall', 'Health', 'Low', 'Community Health Worker', 
'Request for mobile health clinic visit. Vaccination program needed for 60 children under 5 years. Scheduling assistance requested.', 
NULL);

-- Verify data insertion
SELECT COUNT(*) AS TotalReports, 
       COUNT(DISTINCT category) AS UniqueCategories,
       COUNT(DISTINCT severity) AS SeverityLevels
FROM CommunityReports;

-- Display sample breakdown
SELECT category, severity, COUNT(*) AS Count
FROM CommunityReports
GROUP BY category, severity
ORDER BY category, severity;
