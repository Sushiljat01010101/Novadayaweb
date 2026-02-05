# Navodaya Girls Hostel Website

## Overview

This is a static HTML website for Navodaya Girls Hostel that provides information about accommodations, amenities, and booking services for prospective residents. The application features a multi-page structure with sections for room details, gallery, and contact information. The website is built using traditional web technologies with static HTML pages and client-side interactivity through JavaScript.

## Recent Changes

**August 10, 2025**: Removed all PHP files and converted to static HTML website
- All .php files removed from the project
- PHP backend functionality eliminated  
- Converted to pure HTML/CSS/JavaScript static website
- Empty PHP directories (includes/, process/) cleaned up
- Added secure Telegram Bot integration for form notifications
- Created separate config.js file for API credentials
- Implemented client-side form processing with Telegram notifications

## User Preferences

Preferred communication style: Simple, everyday language.
SEO Priority: Top Google ranking for "girls hostel Jaipur" searches.
Location Focus: Tonk Road, Sitapura, near EPIP Gate area.
Hosting Platform: InfinityFree hosting - Production ready, no errors allowed.

## System Architecture

### Frontend Architecture
- **Multi-page static HTML website** with client-side rendering
- **Responsive design** using custom CSS with CSS variables for consistent theming
- **Bootstrap-based layout** indicated by navbar classes and responsive utilities
- **Interactive JavaScript features** with utility functions for smooth scrolling and debounced events
- **SEO-optimized structure** with proper robots.txt configuration for search engine visibility

### Backend Architecture
- **Static file serving** - No server-side processing required
- **File-based organization** with directories for different concerns:
  - `/bookings/` - JSON files for booking data storage
  - `/css/` - Stylesheet files
  - `/js/` - JavaScript files
  - `/images/` - Image assets and gallery
- **Client-side functionality** handles user interactions

### Data Storage
- **File-based or database storage** (specific database type not evident from current files)
- **Booking system integration** with dedicated booking processing capabilities
- **Image and media management** with organized asset directories

### Design Patterns
- **Separation of concerns** with distinct CSS, JavaScript, and PHP file organization
- **Component-based structure** using PHP includes for reusable elements
- **Progressive enhancement** with core functionality in PHP and enhanced user experience through JavaScript
- **Mobile-first responsive design** with CSS variables for consistent theming

## External Dependencies

### Web Technologies
- **Bootstrap CSS framework** for responsive grid system and UI components
- **Modern browser APIs** for smooth scrolling and animation features
- **Web fonts** (Segoe UI family with fallbacks)

### SEO and Search Engines
- **Advanced SEO optimization** with comprehensive robots.txt, sitemap.xml, and .htaccess configuration
- **Local business schema markup** with complete address and contact information
- **Geo-targeted meta tags** for Jaipur location targeting
- **Open Graph and Twitter Card integration** for social media sharing
- **Performance optimization** with compression and caching headers
- **Clean URL structure** with .htaccess rewrite rules for better SEO

### Current Integrations
- **Telegram Bot API** for real-time notifications of contact form submissions and booking requests
  - Bot Token: Configured for instant notification delivery
  - Chat ID: Set up for admin notifications
  - Formatted messages with emojis and structured data display

### Potential Future Integrations
- **Image hosting and management** system for gallery functionality
- **Email services** for contact form processing and booking confirmations (currently optional)
- **Payment processing** services for booking transactions (suggested by booking system presence)
- **Analytics tracking** for visitor behavior monitoring

### Development Tools
- **Local development environment** configured for localhost:5000
- **File logging system** for debugging and monitoring (excluded from search indexing)
- **Asset optimization** with separate CSS and JavaScript file management