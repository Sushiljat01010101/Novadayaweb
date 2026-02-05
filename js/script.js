/**
 * Navodaya Girls Hostel - Main JavaScript File
 * Handles all interactive features and functionality
 */

(function() {
    'use strict';

    // ===== UTILITY FUNCTIONS =====
    
    /**
     * Debounce function to limit function calls
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * Smooth scroll to element
     */
    function smoothScrollTo(element, duration = 1000) {
        const targetPosition = element.offsetTop - 100;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    /**
     * Show loading spinner
     */
    function showLoading(element) {
        if (element) {
            element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            element.disabled = true;
        }
    }

    /**
     * Hide loading spinner
     */
    function hideLoading(element, originalText) {
        if (element) {
            element.innerHTML = originalText;
            element.disabled = false;
        }
    }

    // ===== NAVBAR FUNCTIONALITY =====
    
    /**
     * Handle navbar scroll effects
     */
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset;

        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    /**
     * Handle active nav link highlighting
     */
    function handleActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active'); // Remove active class from all links first
            const href = link.getAttribute('href');
            if (href && (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html'))) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Handle mobile menu close on link click
     */
    function handleMobileMenu() {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
    }

    // ===== FORM HANDLING =====
    
    /**
     * Handle contact form submission
     */
    function handleContactForm() {
        const contactForm = document.querySelector('#contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const messageDiv = document.getElementById('contactFormMessage');
            
            showLoading(submitBtn);
            
            // Collect form data
            const formData = new FormData(this);
            
            // Send AJAX request
            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                hideLoading(submitBtn, originalText);
                
                if (data.success) {
                    // Show success message
                    messageDiv.innerHTML = `
                        <div class="alert alert-success alert-dismissible fade show">
                            <i class="fas fa-check-circle me-2"></i>
                            ${data.message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;
                    this.reset();
                } else {
                    // Show error message
                    let errorMessage = data.message || 'An error occurred. Please try again.';
                    if (data.errors && Object.keys(data.errors).length > 0) {
                        errorMessage += '<ul class="mt-2 mb-0">';
                        Object.values(data.errors).forEach(error => {
                            errorMessage += `<li>${error}</li>`;
                        });
                        errorMessage += '</ul>';
                    }
                    
                    messageDiv.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            ${errorMessage}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;
                }
                
                // Scroll to message
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            })
            .catch(error => {
                hideLoading(submitBtn, originalText);
                messageDiv.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Network error. Please check your connection and try again.
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    /**
     * Handle booking form validation and submission
     */
    function handleBookingForm() {
        const bookingForm = document.querySelector('#bookingForm');
        if (!bookingForm) return;

        // Real-time validation
        const requiredFields = bookingForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', clearValidationError);
        });

        // Phone number formatting
        const phoneFields = bookingForm.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            field.addEventListener('input', formatPhoneNumber);
        });

        // Form submission
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const messageDiv = document.getElementById('bookingFormMessage');
            
            showLoading(submitBtn);
            
            // Collect form data
            const formData = new FormData(this);
            
            // Send AJAX request
            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                hideLoading(submitBtn, originalText);
                
                if (data.success) {
                    // Show success message with booking ID
                    let successMsg = data.message;
                    if (data.booking_id) {
                        successMsg += `<br><strong>Booking ID: ${data.booking_id}</strong>`;
                    }
                    
                    messageDiv.innerHTML = `
                        <div class="alert alert-success alert-dismissible fade show">
                            <i class="fas fa-check-circle me-2"></i>
                            <strong>Booking successful!</strong><br>
                            ${successMsg}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;
                    this.reset();
                    
                    // Reset room preview
                    const roomPreview = document.getElementById('room-preview');
                    if (roomPreview) {
                        roomPreview.innerHTML = '<p class="text-muted">Select a room type to see details</p>';
                    }
                } else {
                    // Show error message
                    let errorMessage = data.message || 'An error occurred. Please try again.';
                    if (data.errors && Object.keys(data.errors).length > 0) {
                        errorMessage += '<ul class="mt-2 mb-0">';
                        Object.values(data.errors).forEach(error => {
                            errorMessage += `<li>${error}</li>`;
                        });
                        errorMessage += '</ul>';
                    }
                    
                    messageDiv.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            ${errorMessage}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;
                }
                
                // Scroll to message
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            })
            .catch(error => {
                hideLoading(submitBtn, originalText);
                messageDiv.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Network error. Please check your connection and try again.
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    /**
     * Validate individual form field
     */
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error
        clearValidationError(e);
        
        if (!value && field.hasAttribute('required')) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }

    /**
     * Show field error
     */
    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        let errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    /**
     * Clear field validation error
     */
    function clearValidationError(e) {
        const field = e.target;
        field.classList.remove('is-invalid');
        
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    /**
     * Format phone number as user types
     */
    function formatPhoneNumber(e) {
        const field = e.target;
        let value = field.value.replace(/\D/g, '');
        
        if (value.length >= 10) {
            value = value.substring(0, 10);
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
        
        field.value = value;
    }

    /**
     * Validate entire booking form
     */
    function validateBookingForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            const fakeEvent = { target: field };
            if (!validateField(fakeEvent)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Show booking success message
     */
    function showBookingSuccess() {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>Booking request submitted successfully!</strong> 
            We'll contact you within 24 hours to confirm your booking and payment details.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const form = document.querySelector('.booking-form');
        form.insertBefore(alertDiv, form.firstChild);
        
        // Scroll to top of form
        smoothScrollTo(form);
        
        // Reset form
        form.reset();
        
        // Update room preview
        const roomPreview = document.getElementById('room-preview');
        if (roomPreview) {
            roomPreview.innerHTML = '<p class="text-muted">Select a room type to see details</p>';
        }
    }

    // ===== GALLERY FUNCTIONALITY =====
    
    /**
     * Handle gallery filtering
     */
    function handleGalleryFilter() {
        const filterButtons = document.querySelectorAll('.gallery-filters .btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (!filterButtons.length) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items with animation
                galleryItems.forEach((item, index) => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        setTimeout(() => {
                            item.style.display = 'block';
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            
                            setTimeout(() => {
                                item.style.transition = 'all 0.3s ease';
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 50);
                        }, index * 50);
                    } else {
                        item.style.transition = 'all 0.3s ease';
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(-20px)';
                        
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ===== ROOM SELECTION =====
    
    /**
     * Handle room type selection in booking form
     */
    function handleRoomSelection() {
        const roomTypeSelect = document.getElementById('room_type');
        const roomPreview = document.getElementById('room-preview');
        
        if (!roomTypeSelect || !roomPreview) return;
        
        // Room data (this should match the PHP data)
        const roomData = {
            'single': {
                'name': 'Single Room',
                'price': '₹8,000/month',
                'features': ['AC', 'Private Bathroom', 'Study Table', 'Wardrobe', 'WiFi']
            },
            'double': {
                'name': 'Double Sharing',
                'price': '₹6,000/month',
                'features': ['AC', 'Shared Bathroom', 'Study Table', 'Wardrobe', 'WiFi']
            },
            'triple': {
                'name': 'Triple Sharing',
                'price': '₹4,500/month',
                'features': ['AC', 'Shared Bathroom', 'Study Table', 'Wardrobe', 'WiFi']
            }
        };
        
        roomTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            
            if (selectedType && roomData[selectedType]) {
                const room = roomData[selectedType];
                roomPreview.innerHTML = `
                    <div class="selected-room">
                        <h5>${room.name}</h5>
                        <div class="price">${room.price}</div>
                        <div class="features mt-2">
                            <h6>Features:</h6>
                            <ul class="list-unstyled">
                                ${room.features.map(feature => `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            } else {
                roomPreview.innerHTML = '<p class="text-muted">Select a room type to see details</p>';
            }
        });
        
        // Trigger change event if room is pre-selected
        if (roomTypeSelect.value) {
            roomTypeSelect.dispatchEvent(new Event('change'));
        }
    }

    // ===== SCROLL ANIMATIONS =====
    
    /**
     * Handle scroll-triggered animations
     */
    function handleScrollAnimations() {
        const animatedElements = document.querySelectorAll('.feature-card, .amenity-card, .room-card, .testimonial-card');
        
        function checkAnimation() {
            animatedElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('animate');
                }
            });
        }
        
        window.addEventListener('scroll', debounce(checkAnimation, 100));
        checkAnimation(); // Check on page load
    }

    // ===== WHATSAPP INTEGRATION =====
    
    /**
     * Handle WhatsApp quick contact
     */
    function handleWhatsAppContact() {
        const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
        
        whatsappButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Track WhatsApp clicks (for analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'whatsapp_contact', {
                        'event_category': 'contact',
                        'event_label': 'WhatsApp Button Click'
                    });
                }
            });
        });
    }

    // ===== PHONE CALL TRACKING =====
    
    /**
     * Handle phone call tracking
     */
    function handlePhoneCallTracking() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        phoneLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Track phone calls (for analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'phone_call', {
                        'event_category': 'contact',
                        'event_label': 'Phone Call Click'
                    });
                }
            });
        });
    }

    // ===== FAQ FUNCTIONALITY =====
    
    /**
     * Handle FAQ accordion
     */
    function handleFAQ() {
        const faqItems = document.querySelectorAll('.accordion-button');
        
        faqItems.forEach(button => {
            button.addEventListener('click', function() {
                // Track FAQ interactions
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'faq_interaction', {
                        'event_category': 'engagement',
                        'event_label': this.textContent.trim()
                    });
                }
            });
        });
    }

    // ===== LAZY LOADING =====
    
    /**
     * Handle lazy loading for SVG images and heavy content
     */
    function handleLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyElements = document.querySelectorAll('[data-lazy]');
            
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        element.classList.add('loaded');
                        lazyObserver.unobserve(element);
                    }
                });
            });
            
            lazyElements.forEach(element => {
                lazyObserver.observe(element);
            });
        }
    }

    // ===== BACK TO TOP BUTTON =====
    
    /**
     * Handle back to top functionality
     */
    function handleBackToTop() {
        // Create back to top button
        const backToTopButton = document.createElement('button');
        backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopButton.className = 'btn btn-primary back-to-top';
        backToTopButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(backToTopButton);
        
        // Show/hide button based on scroll
        window.addEventListener('scroll', debounce(() => {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        }, 100));
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== ERROR HANDLING =====
    
    /**
     * Global error handler
     */
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        
        // You can send error reports to a logging service here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'javascript_error', {
                'event_category': 'error',
                'event_label': e.error.message
            });
        }
    });

    // ===== INITIALIZATION =====
    
    /**
     * Initialize all functionality when DOM is ready
     */
    function init() {
        // Core functionality
        handleActiveNavLink();
        handleMobileMenu();
        handleContactForm();
        handleBookingForm();
        handleRoomSelection();
        
        // Interactive features
        handleGalleryFilter();
        handleScrollAnimations();
        handleWhatsAppContact();
        handlePhoneCallTracking();
        handleFAQ();
        handleLazyLoading();
        handleBackToTop();
        
        // Event listeners
        window.addEventListener('scroll', debounce(handleNavbarScroll, 100));
        
        // Page-specific initialization
        if (window.location.pathname.includes('booking')) {
            initBookingPage();
        }
        
        if (window.location.pathname.includes('gallery')) {
            initGalleryPage();
        }
    }

    /**
     * Initialize booking page specific features
     */
    function initBookingPage() {
        // Set minimum date for check-in
        const checkInField = document.getElementById('check_in');
        if (checkInField) {
            const today = new Date().toISOString().split('T')[0];
            checkInField.setAttribute('min', today);
        }
        
        // Add booking form enhancements
        const bookingForm = document.querySelector('.booking-form');
        if (bookingForm) {
            // Add form progress indicator
            addFormProgress(bookingForm);
        }
    }

    /**
     * Initialize gallery page specific features
     */
    function initGalleryPage() {
        // Add image lightbox functionality
        handleImageLightbox();
    }

    /**
     * Add form progress indicator
     */
    function addFormProgress(form) {
        const sections = form.querySelectorAll('.form-section');
        const progress = document.createElement('div');
        progress.className = 'form-progress mb-4';
        progress.innerHTML = `
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 0%"></div>
            </div>
            <small class="text-muted">Complete all sections to submit your booking</small>
        `;
        
        form.insertBefore(progress, form.firstChild);
        
        // Update progress as user fills form
        const progressBar = progress.querySelector('.progress-bar');
        const requiredFields = form.querySelectorAll('[required]');
        
        function updateProgress() {
            const filledFields = Array.from(requiredFields).filter(field => field.value.trim() !== '').length;
            const percentage = (filledFields / requiredFields.length) * 100;
            progressBar.style.width = percentage + '%';
            progressBar.setAttribute('aria-valuenow', percentage);
        }
        
        requiredFields.forEach(field => {
            field.addEventListener('input', debounce(updateProgress, 300));
            field.addEventListener('change', updateProgress);
        });
    }

    /**
     * Handle image lightbox for gallery
     */
    function handleImageLightbox() {
        const galleryCards = document.querySelectorAll('.gallery-card');
        
        galleryCards.forEach(card => {
            card.addEventListener('click', function() {
                const overlay = this.querySelector('.gallery-overlay');
                if (overlay) {
                    const title = overlay.querySelector('h5').textContent;
                    const description = overlay.querySelector('p').textContent;
                    
                    // Create modal for larger view
                    const modal = document.createElement('div');
                    modal.className = 'modal fade';
                    modal.innerHTML = `
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">${title}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    ${this.querySelector('svg').outerHTML}
                                    <p class="mt-3">${description}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                    const bsModal = new bootstrap.Modal(modal);
                    bsModal.show();
                    
                    // Remove modal after it's hidden
                    modal.addEventListener('hidden.bs.modal', () => {
                        modal.remove();
                    });
                }
            });
        });
    }

    // ===== AUTO-INIT =====
    
    // Initialize when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-initialize on page show (for back/forward navigation)
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            init();
        }
    });

})();
