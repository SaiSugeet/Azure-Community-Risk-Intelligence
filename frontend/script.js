document.getElementById('reportForm').addEventListener('submit', function(e) {
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
    
    // Log to console (later this will send to Azure)
    console.log('Report Submitted:', formData);
    
    // Show success message
    document.getElementById('successMessage').style.display = 'block';
    
    // Clear form
    document.getElementById('reportForm').reset();
    
    // Hide success message after 5 seconds
    setTimeout(function() {
        document.getElementById('successMessage').style.display = 'none';
    }, 5000);
});

// File size validation
document.getElementById('image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        e.target.value = '';
    }
});
