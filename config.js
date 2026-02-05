// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
    BOT_TOKEN: '8507195633:AAHQK9kuzco1bQ2MBOhKMwbXtreMYCz0wsg',
    CHAT_ID: '1691680798',
    API_URL: function() {
        return `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TELEGRAM_CONFIG;
} else {
    window.TELEGRAM_CONFIG = TELEGRAM_CONFIG;
}
