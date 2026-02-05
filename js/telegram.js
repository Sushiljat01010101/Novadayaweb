// Telegram Bot Integration for Forms
class TelegramBot {
    constructor() {
        this.config = window.TELEGRAM_CONFIG;
    }

    // Send booking details to Telegram
    async sendBookingNotification(bookingData) {
        const message = this.formatBookingMessage(bookingData);
        return await this.sendMessage(message);
    }

    // Send contact form details to Telegram
    async sendContactNotification(contactData) {
        const message = this.formatContactMessage(contactData);
        return await this.sendMessage(message);
    }

    // Format booking message
    formatBookingMessage(data) {
        return `🏠 *NEW BOOKING REQUEST* 🏠

👤 *Name:* ${data.name}
📞 *Phone:* ${data.phone}
📧 *Email:* ${data.email}
🏠 *Room Type:* ${data.roomType}
📅 *Check-in:* ${data.checkIn}
📅 *Duration:* ${data.duration}
👤 *Age:* ${data.age}
💼 *Occupation:* ${data.occupation}
🏢 *Institute/Company:* ${data.instituteCompany || 'Not specified'}
🏠 *Current Address:* ${data.currentAddress}

👨‍👩‍👧‍👦 *Guardian Details:*
• Name: ${data.guardianName} (${data.guardianRelation})
• Phone: ${data.guardianPhone}
• Email: ${data.guardianEmail || 'Not provided'}

💰 *Monthly Rent:* ₹${data.totalAmount}

💬 *Special Requirements:* ${data.specialRequirements || 'None'}

🆔 *Booking ID:* ${data.bookingId}
⏰ *Submitted at:* ${new Date().toLocaleString('en-IN')}`;
    }

    // Format contact message
    formatContactMessage(data) {
        return `📩 *NEW CONTACT MESSAGE* 📩

👤 *Name:* ${data.name}
📞 *Phone:* ${data.phone}
📧 *Email:* ${data.email}
🏷️ *Subject:* ${data.subject}

💬 *Message:*
${data.message}

⏰ *Submitted at:* ${new Date().toLocaleString('en-IN')}`;
    }

    // Send message to Telegram
    async sendMessage(text) {
        try {
            const response = await fetch(this.config.API_URL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.config.CHAT_ID,
                    text: text,
                    parse_mode: 'Markdown'
                })
            });

            const result = await response.json();
            
            if (result.ok) {
                console.log('✅ Telegram notification sent successfully');
                return { success: true, data: result };
            } else {
                console.error('❌ Telegram API error:', result);
                return { success: false, error: result.description };
            }
        } catch (error) {
            console.error('❌ Network error sending to Telegram:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // Test connection
    async testConnection() {
        const testMessage = '🧪 *TEST MESSAGE* 🧪\n\nTelegram Bot connection successful!';
        return await this.sendMessage(testMessage);
    }
}

// Initialize Telegram Bot
const telegramBot = new TelegramBot();