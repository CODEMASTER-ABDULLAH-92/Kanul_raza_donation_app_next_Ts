import nodemailer from 'nodemailer';

// Charity type labels
const charityTypeLabels = {
  sadaqah: "Sadaqah",
  zakat: "Zakat",
  sadaqah_nafilah: "Sadaqah Nafilah",
  general: "General Donation"
};

// Category labels
const categoryLabels = {
  boys_madrasa: "Boys Madrasa",
  girls_madrasa: "Girls Madrasa",
  masjid: "Masjid",
  cement: "Cement",
  islamic_books: "Islamic Books",
  construction: "Construction Work",
  ration: "Poor Families (Ration)",
  food_distribution: "Food Distribution"
};

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendDonationConfirmation(donation) {
    try {
      const charityType = charityTypeLabels[donation.charityType] || donation.charityType;
      const category = categoryLabels[donation.category] || donation.category;
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; }
                .details { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
                .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
                .detail-row:last-child { border-bottom: none; }
                .label { font-weight: 600; color: #4b5563; }
                .value { color: #111827; }
                .amount { font-size: 24px; font-weight: bold; color: #059669; text-align: center; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
                .badge { display: inline-block; padding: 4px 12px; background: #10b981; color: white; border-radius: 20px; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Thank You for Your Donation!</h1>
                    <p>Your contribution makes a difference</p>
                </div>
                <div class="content">
                    <p>Dear <strong>${donation.donorName}</strong>,</p>
                    
                    <p>On behalf of our entire organization, we extend our heartfelt gratitude for your generous donation. Your support enables us to continue our charitable work and make a positive impact in our community.</p>
                    
                    <div class="details">
                        <h3 style="color: #059669; margin-top: 0;">Donation Details</h3>
                        
                        <div class="detail-row">
                            <span class="label">Receipt Number:</span>
                            <span class="value"><strong>${donation.receiptNumber}</strong></span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="label">Date:</span>
                            <span class="value">${new Date(donation.createdAt).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</span>
                        </div>
                        
                        <div class="amount">
                            PKR ${donation.amount.toLocaleString()}
                        </div>
                        
                        <div class="detail-row">
                            <span class="label">Charity Type:</span>
                            <span class="value"><span class="badge">${charityType}</span></span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="label">Category:</span>
                            <span class="value">${category}</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="label">Collected By:</span>
                            <span class="value">${donation.staffName}</span>
                        </div>
                        
                        ${donation.notes ? `
                        <div class="detail-row">
                            <span class="label">Your Notes:</span>
                            <span class="value">${donation.notes}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <p><strong>May Allah (SWT) accept your donation and reward you abundantly in this life and the Hereafter.</strong></p>
                    
                    <p>This donation has been recorded in our system. You will receive updates about how your contribution is being utilized.</p>
                    
                    <p>If you have any questions or need further information, please don't hesitate to contact us.</p>
                    
                    <p>With sincere gratitude,<br>
                    <strong>The Charity Team</strong></p>
                </div>
                
                <div class="footer">
                    <p>This is an automated receipt. Please keep this email for your records.</p>
                    <p>© ${new Date().getFullYear()} Charity Organization. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `;

      const textContent = `
        DONATION CONFIRMATION - ${donation.receiptNumber}
        
        Dear ${donation.donorName},
        
        Thank you for your generous donation of PKR ${donation.amount} for ${category}.
        
        Donation Details:
        - Receipt Number: ${donation.receiptNumber}
        - Date: ${new Date(donation.createdAt).toLocaleDateString()}
        - Amount: PKR ${donation.amount}
        - Charity Type: ${charityType}
        - Category: ${category}
        - Collected By: ${donation.staffName}
        ${donation.notes ? `- Notes: ${donation.notes}` : ''}
        
        May Allah (SWT) accept your donation and reward you abundantly.
        
        This donation has been recorded in our system. You will receive updates about how your contribution is being utilized.
        
        With sincere gratitude,
        The Charity Team
      `;

      const mailOptions = {
        from: `"Charity Organization" <${process.env.EMAIL_USER}>`,
        to: donation.email,
        subject: `Donation Confirmation - ${donation.receiptNumber}`,
        text: textContent,
        html: htmlContent
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Also send notification to admin
      if (process.env.ADMIN_EMAIL) {
        await this.sendAdminNotification(donation, info.messageId);
      }

      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Error sending donation confirmation email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendAdminNotification(donation, messageId) {
    try {
      const mailOptions = {
        from: `"Charity System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Donation Received - ${donation.receiptNumber}`,
        text: `
          NEW DONATION ALERT
          
          Receipt: ${donation.receiptNumber}
          Donor: ${donation.donorName}
          Amount: PKR ${donation.amount}
          Email: ${donation.email}
          Phone: ${donation.phone}
          Collected By: ${donation.staffName} (${donation.staffId})
          Charity Type: ${donation.charityType}
          Category: ${donation.category}
          Time: ${new Date(donation.createdAt).toLocaleString()}
          
          Confirmation email sent to donor: ${messageId}
        `,
        html: `
          <h2>New Donation Alert</h2>
          <p><strong>Receipt:</strong> ${donation.receiptNumber}</p>
          <p><strong>Donor:</strong> ${donation.donorName}</p>
          <p><strong>Amount:</strong> PKR ${donation.amount}</p>
          <p><strong>Collected By:</strong> ${donation.staffName} (${donation.staffId})</p>
          <p><strong>Time:</strong> ${new Date(donation.createdAt).toLocaleString()}</p>
          <hr>
          <p><em>Confirmation email sent to donor: ${messageId}</em></p>
        `
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending admin notification:', error);
      // Don't throw error for admin notification failure
    }
  }
}

export default new EmailService();