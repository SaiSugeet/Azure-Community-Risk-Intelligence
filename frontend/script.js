// Azure Function API endpoint
const API_URL = 'https://community-risk-api-e2affkacd6b0djc5.eastasia-01.azurewebsites.net/api/ingestReport';

document.getElementById('reportForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        location: document.getElementById('location').value,
        category: document.getElementById('category').value,
        severity: document.getElementById('severity').value,
        reporterType: document.getElementById('reporterType').value,
        description: document.getElementById('description').value,
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    try {
        // Send data to Azure Function
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
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
        console.error('Error submitting report:', error);
        alert('Error submitting report. Please try again. Error: ' + error.message);
    } finally {
        // Reset button state
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
