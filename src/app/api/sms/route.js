const Twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendDonationConfirmation(donation) {
    try {
      const charityTypeLabels = {
        sadaqah: "Sadaqah",
        zakat: "Zakat",
        sadaqah_nafilah: "Sadaqah Nafilah",
        general: "General Donation"
      };

      const categoryLabels = {
        boys_madrasa: "Boys Madrasa",
        girls_madrasa: "Girls Madrasa",
        masjid: "Masjid",
        cement: "Cement",
        islamic_books: "Islamic Books",
        construction: "Construction",
        ration: "Poor Families",
        food_distribution: "Food Distribution"
      };

      const charityType = charityTypeLabels[donation.charityType] || donation.charityType;
      const category = categoryLabels[donation.category] || donation.category;

      const message = `Assalamu Alaikum ${donation.donorName},\n\nThank you for your generous donation of PKR ${donation.amount} for ${category} (${charityType}).\n\nReceipt: ${donation.receiptNumber}\nDate: ${new Date(donation.createdAt).toLocaleDateString('en-PK')}\n\nMay Allah accept your donation and reward you abundantly. JazakAllah Khair!\n\n- Charity Organization`;

      // Format phone number for Pakistan
      let phoneNumber = donation.phone.replace(/\D/g, '');
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '+92' + phoneNumber.substring(1);
      } else if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+92' + phoneNumber;
      }

      const response = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      return {
        success: true,
        messageSid: response.sid,
        status: response.status
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  async sendAdminAlert(donation) {
    try {
      if (!process.env.ADMIN_PHONE_NUMBER) return;

      const message = `🚨 NEW DONATION: ${donation.receiptNumber}\nDonor: ${donation.donorName}\nAmount: PKR ${donation.amount}\nCollected by: ${donation.staffName}\nTime: ${new Date(donation.createdAt).toLocaleTimeString('en-PK')}`;

      const response = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.ADMIN_PHONE_NUMBER
      });

      return response.sid;
    } catch (error) {
      console.error('Error sending admin SMS:', error);
    }
  }
}

// Export singleton instance
module.exports = new SMSService();