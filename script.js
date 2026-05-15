/**
 * First Choice | Ready, Set, Close - Lead Capture Form
 * Handles form submission via Formspree (replace with your endpoint)
 */

(function() {
    'use strict';

    // ===== CONFIGURE YOUR FORMSPREE ENDPOINT HERE =====
    // 1. Go to https://formspree.io/register
    // 2. Create a form with your email
    // 3. Replace YOUR_FORM_ID below
    const FORMSPREE_ID = 'xkoyllep';
    const FORM_ACTION = `https://formspree.io/f/${FORMSPREE_ID}`;

    // DOM Elements
    const form = document.getElementById('repairForm');
    const fileInput = document.getElementById('photos');
    const photoPreview = document.getElementById('photoPreview');
    const submitBtn = form.querySelector('.submit-btn');
    const loading = document.getElementById('loading');
    const success = document.getElementById('success');
    const error = document.getElementById('error');
    const savedPhone = document.getElementById('savedPhone');
    const savedEmail = document.getElementById('savedEmail');

    // Track uploaded files for Formspree
    let uploadedFiles = [];

    // ===== FILE UPLOAD HANDLER =====
    fileInput.addEventListener('change', function(e) {
        photoPreview.innerHTML = '';
        uploadedFiles = [];

        const files = Array.from(this.files);
        if (files.length > 5) {
            alert('Maximum 5 photos allowed');
            this.value = '';
            return;
        }

        files.forEach(file => {
            if (!file.type.startsWith('image/')) return;

            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert(`${file.name} is too large (max 10MB)`);
                return;
            }

            uploadedFiles.push(file);

            // Show preview
            const reader = new FileReader();
            reader.onload = function(ev) {
                const img = document.createElement('img');
                img.src = ev.target.result;
                img.alt = 'Preview';
                photoPreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });

    // ===== TIMELINE SELECTION HIGHLIGHTING =====
    document.querySelectorAll('input[name="timeline"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.timeline-option').forEach(opt => {
                opt.style.borderColor = '#E0E0E0';
                opt.style.background = '';
            });
            if (this.checked) {
                const opt = this.closest('.timeline-option');
                if (this.value === '24h') {
                    opt.style.borderColor = '#FF6B6B';
                    opt.style.background = '#FFF5F5';
                } else {
                    opt.style.borderColor = '#003366';
                    opt.style.background = '#F0F8FF';
                }
            }
        });
    });

    // ===== REPAIR TYPE SELECTION HIGHLIGHTING =====
    document.querySelectorAll('input[name="jobTypes"]').forEach(cb => {
        cb.addEventListener('change', function() {
            const opt = this.closest('.repair-option');
            if (this.checked) {
                opt.style.borderColor = '#33B5FF';
                opt.style.background = '#F0F8FF';
            } else {
                opt.style.borderColor = '#E0E0E0';
                opt.style.background = '#F5F5F5';
            }
        });
    });

    // ===== PHONE FORMATTING =====
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

    // ===== FORM SUBMISSION =====
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate timeline selection
        const timeline = document.querySelector('input[name="timeline"]:checked');
        if (!timeline) {
            alert('Please select a timeline');
            return;
        }

        // Validate at least one repair type
        const jobTypes = document.querySelectorAll('input[name="jobTypes"]:checked');
        if (jobTypes.length === 0) {
            alert('Please select at least one repair type');
            return;
        }

        // Check if Formspree is configured
        if (FORMSPREE_ID === 'YOUR_FORM_ID') {
            console.warn('Formspree not configured - showing success for demo');
            showSuccess();
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        loading.classList.remove('hidden');
        error.classList.add('hidden');
        success.classList.add('hidden');

        try {
            const formData = new FormData();
            
            // Collect all form fields
            formData.append('agentName', document.getElementById('agentName').value);
            formData.append('agentPhone', document.getElementById('agentPhone').value);
            formData.append('agentEmail', document.getElementById('agentEmail').value);
            formData.append('propertyAddress', document.getElementById('propertyAddress').value);
            formData.append('timeline', timeline.value);
            formData.append('budget', document.getElementById('budget').value);
            formData.append('jobTypes', Array.from(jobTypes).map(cb => cb.value).join(', '));
            formData.append('description', document.getElementById('description').value);
            formData.append('textUpdates', document.querySelector('input[name="textUpdates"]').checked ? 'Yes' : 'No');
            formData.append('emailUpdates', document.querySelector('input[name="emailUpdates"]').checked ? 'Yes' : 'No');

            // Add photo attachments
            uploadedFiles.forEach(file => {
                formData.append('attachment', file);
            });

            // Submit to Formspree
            const response = await fetch(FORM_ACTION, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showSuccess();
            } else {
                throw new Error('Submission failed');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            loading.classList.add('hidden');
            error.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    });

    function showSuccess() {
        form.style.display = 'none';
        loading.classList.add('hidden');
        success.classList.remove('hidden');
        
        // Show submitted contact info
        savedPhone.textContent = document.getElementById('agentPhone').value || 'your phone';
        savedEmail.textContent = document.getElementById('agentEmail').value || 'your email';
    }

})();