const form = document.getElementById('repairForm');
const fileInput = document.getElementById('photos');
const photoPreview = document.getElementById('photoPreview');
const loading = document.getElementById('loading');
const success = document.getElementById('success');
const error = document.getElementById('error');

// Configuration - UPDATE THESE
const CONFIG = {
    // Email config (use Formspree for MVP)
    formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID', // Replace with actual Formspree endpoint
    
    // Or webhook for custom backend
    webhookUrl: '', // If using custom backend
    
    // WhatsApp/SMS config (using Tally or Formspree + Make/Zapier)
    enableNotifications: true,
};

// Photo preview handler
fileInput.addEventListener('change', function(e) {
    photoPreview.innerHTML = '';
    if (this.files.length > 5) {
        alert('Maximum 5 photos allowed');
        this.value = '';
        return;
    }
    
    Array.from(this.files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Preview';
                photoPreview.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    });
});

// Phone formatting
const phoneInput = document.getElementById('agentPhone');
phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 6) {
        value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
    } else if (value.length >= 3) {
        value = `(${value.slice(0,3)}) ${value.slice(3)}`;
    }
    e.target.value = value;
});

// Radio button visual feedback
document.querySelectorAll('input[name="timeline"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.querySelectorAll('.radio-option').forEach(opt => {
            opt.style.borderColor = '#e5e7eb';
            opt.style.background = '';
        });
        if (this.checked) {
            this.closest('.radio-option').style.borderColor = '#6366f1';
            this.closest('.radio-option').style.background = 'rgba(99, 102, 241, 0.05)';
        }
    });
});

// Form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    // Animation
    btnText.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    // Gather form data
    const formData = new FormData(form);
    
    // Get job types
    const jobTypes = Array.from(form.querySelectorAll('input[name="jobTypes"]:checked'))
        .map(cb => cb.value);
    
    // Get timeline
    const timeline = form.querySelector('input[name="timeline"]:checked')?.value || '';
    
    // Build email HTML
    const timelineLabels = { '24h': 'Within 24 hours', '3d': 'Within 3 days', '1w': 'Within 1 week' };
    
    const emailBody = `
        <h2>New Repair Request From Real Estate Agent</h2>
        <p><strong>Urgency:</strong> ${timelineLabels[timeline] || timeline}</p>
        <hr>
        <p><strong>Agent:</strong> ${formData.get('agentName')}</p>
        <p><strong>Phone:</strong> ${formData.get('agentPhone')}</p>
        <p><strong>Email:</strong> ${formData.get('agentEmail')}</p>
        <p><strong>Property:</strong> ${formData.get('propertyAddress')}</p>
        <hr>
        <p><strong>Job Types:</strong> ${jobTypes.join(', ')}</p>
        <p><strong>Budget:</strong> ${formData.get('budget')}</p>
        <hr>
        <p><strong>Description:</strong></p>
        <p>${formData.get('description').replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
    `;
    
    // Save contact info for success message
    document.getElementById('savedPhone').textContent = formData.get('agentPhone');
    document.getElementById('savedEmail').textContent = formData.get('agentEmail');
    
    try {
        // Simple fallback: use mailto (works without backend)
        const subject = `🚨 URGENT: ${timelineLabels[timeline]} - ${jobTypes.join(', ')}`;
        const bodyText = `Agent: ${formData.get('agentName')}\nPhone: ${formData.get('agentPhone')}\nEmail: ${formData.get('agentEmail')}\nProperty: ${formData.get('propertyAddress')}\n\nJob Types: ${jobTypes.join(', ')}\nBudget: ${formData.get('budget')}\n\nDescription:\n${formData.get('description')}`;
        
        // Create mailto link
        const mailtoLink = `mailto:YOUR_EMAIL@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
        
        // Method 1: Try Formspree
        if (CONFIG.formspreeEndpoint.includes('formspree.io/f/') && !CONFIG.formspreeEndpoint.includes('YOUR_FORM_ID')) {
            const response = await fetch(CONFIG.formspreeEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showSuccess();
            } else {
                throw new Error('Formspree failed');
            }
        }
        // Method 2: Use mailto fallback (requires user to send)
        else {
            // Open email client
            window.open(mailtoLink, '_blank');
            
            // Manual SMS fallback (will need Twilio for automated SMS)
            // For now, just show success message
            showSuccess();
        }
        
    } catch (err) {
        console.error('Submit failed:', err);
        showError();
        btnText.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
});

function showSuccess() {
    form.classList.add('hidden');
    success.classList.remove('hidden');
    
    // Trigger SMS if enabled
    const phone = document.getElementById('savedPhone').textContent;
    if (phone && CONFIG.enableNotifications) {
        // This would connect to Twilio or similar
        console.log('Would send SMS to:', phone);
    }
}

function showError() {
    error.classList.remove('hidden');
    form.classList.add('hidden');
}

// Add to homescreen detection (PWA Support)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
    // Optionally show "Add to homescreen" button
});

console.log('QuickFix Form Loaded ✓');
console.log('Next: Set up Formspree endpoint in CONFIG.formspreeEndpoint');
