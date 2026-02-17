// Azure Function API endpoint
const API_URL = 'https://community-risk-api-e2affkacd6b0djc5.eastasia-01.azurewebsites.net/api/ingestReport';

document.getElementById('reportForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values with backend-compatible field names
    const formData = {
        date_reported: new Date().toISOString(),
        location: document.getElementById('location').value.trim(),
        category: document.getElementById('category').value.trim(),
        severity: document.getElementById('severity').value.trim(),
        reporter_type: document.getElementById('reporterType').value.trim(),
        description: document.getElementById('description').value.trim()
    };

    // DEBUG: Log what we're sending
    console.log('Sending data:', JSON.stringify(formData));

    // Frontend validation
    if (!formData.location || !formData.category || 
        !formData.severity || !formData.reporter_type || 
        !formData.description) {
        alert('Please fill in all required fields!');
        return;
    }
    
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Get raw response for debugging
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        // Parse JSON
        const result = JSON.parse(responseText);
        
        if (!response.ok) {
            throw new Error(result.error || result.details || 
                          `HTTP error! status: ${response.status}`);
        }
        
        console.log('Report submitted successfully:', result);
        
        // Show success message
        document.getElementById('successMessage').style.display = 'block';
        
        // Clear form
        document.getElementById('reportForm').reset();
        
        // Hide success message after 5 seconds
        setTimeout(function() {
            document.getElementById('successMessage').style.display = 'none';
        }, 5000);
        
    } catch (error) {
        console.error('Full error details:', error);
        alert('Error submitting report: ' + error.message);
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});

// File size validation
document.getElementById('image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        e.target.value = '';
    }
});
