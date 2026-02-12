import nodemailer from 'nodemailer';

// Charity type labels with descriptions
const charityTypeLabels = {
  sadaqah: { label: "Sadaqah", description: "Voluntary Charity", icon: "🤝" },
  zakat: { label: "Zakat", description: "Obligatory Charity", icon: "✨" },
  sadaqah_nafilah: { label: "Sadaqah Nafilah", description: "Supererogatory Charity", icon: "🌟" },
  general: { label: "General Donation", description: "Wherever Needed Most", icon: "❤️" }
};

// Category labels with descriptions and icons
const categoryLabels = {
  boys_madrasa: { label: "Boys Madrasa", description: "Islamic Education for Boys", icon: "📚" },
  girls_madrasa: { label: "Girls Madrasa", description: "Islamic Education for Girls", icon: "📖" },
  masjid: { label: "Masjid", description: "House of Allah", icon: "🕌" },
  cement: { label: "Cement", description: "Construction Material", icon: "🏗️" },
  islamic_books: { label: "Islamic Books", description: "Sacred Knowledge", icon: "📕" },
  construction: { label: "Construction Work", description: "Building & Development", icon: "🏛️" },
  ration: { label: "Poor Families (Ration)", description: "Food Assistance", icon: "🍞" },
  food_distribution: { label: "Food Distribution", description: "Feeding the Needy", icon: "🍽️" }
};

// CSS Styles
const emailStyles = {
  main: `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 20px;
    border-radius: 20px;
  `,
  container: `
    background-color: white;
    border-radius: 15px;
    padding: 40px 30px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  `,
  header: `
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 3px solid #667eea;
    padding-bottom: 20px;
  `,
  logo: `
    font-size: 48px;
    margin-bottom: 10px;
  `,
  title: `
    color: #333;
    font-size: 28px;
    margin: 0;
    font-weight: 600;
  `,
  subtitle: `
    color: #667eea;
    font-size: 16px;
    margin-top: 5px;
  `,
  greeting: `
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  `,
  highlight: `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    margin: 20px 0;
  `,
  amount: `
    font-size: 48px;
    font-weight: bold;
    margin: 10px 0;
  `,
  amountLabel: `
    font-size: 16px;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 2px;
  `,
  detailsGrid: `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 30px 0;
  `,
  detailItem: `
    text-align: center;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    transition: transform 0.3s;
  `,
  detailIcon: `
    font-size: 32px;
    margin-bottom: 10px;
  `,
  detailLabel: `
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
  `,
  detailValue: `
    font-size: 18px;
    color: #333;
    font-weight: 600;
  `,
  receiptBox: `
    background: #f8f9fa;
    border-left: 4px solid #667eea;
    padding: 15px;
    margin: 20px 0;
    font-family: monospace;
  `,
  button: `
    display: inline-block;
    padding: 15px 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-weight: bold;
    margin: 10px 5px;
    text-align: center;
    border: none;
    cursor: pointer;
    transition: transform 0.3s;
  `,
  footer: `
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    text-align: center;
    color: #666;
    font-size: 14px;
  `,
  socialLinks: `
    margin: 20px 0;
  `,
  socialIcon: `
    display: inline-block;
    margin: 0 10px;
    color: #667eea;
    text-decoration: none;
  `,
  taxInfo: `
    background: #e8f4fd;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
    color: #0288d1;
    font-size: 14px;
  `
};

class EmailService {
  constructor() {
    const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465;
    const secure = port === 465;

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port,
      secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  generateHTMLTemplate(content, options = {}) {
    const { title = "Donation Confirmation",} = options;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background: #f6f9fc;">
        <div style="${emailStyles.main}">
          <div style="${emailStyles.container}">
            ${content}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateDonationEmailContent(donation) {
    const charityType = charityTypeLabels[donation.charityType] || { 
      label: donation.charityType, 
      description: "", 
      icon: "💝" 
    };
    const category = categoryLabels[donation.category] || { 
      label: donation.category, 
      description: "", 
      icon: "🎁" 
    };

    const formattedDate = donation.createdAt 
      ? new Date(donation.createdAt).toLocaleDateString('en-PK', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : new Date().toLocaleDateString('en-PK', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

    const amountInWords = this.numberToWords(donation.amount);

    return `
      <!-- Header -->
      <div style="${emailStyles.header}">
        <div style="${emailStyles.logo}">${charityType.icon || '🤝'}</div>
        <h1 style="${emailStyles.title}">JazakAllah Khair!</h1>
        <p style="${emailStyles.subtitle}">May Allah accept your generous donation</p>
      </div>

      <!-- Greeting -->
      <div style="${emailStyles.greeting}">
        Assalamu Alaikum, <strong>${donation.donorName}</strong> 👋
      </div>

      <!-- Amount Highlight -->
      <div style="${emailStyles.highlight}">
        <div style="${emailStyles.amountLabel}">Your Donation Amount</div>
        <div style="${emailStyles.amount}">PKR ${donation.amount.toLocaleString()}</div>
        <div style="font-size: 16px; opacity: 0.95;">${amountInWords} Rupees Only</div>
      </div>

      <!-- Donation Details Grid -->
      <div style="${emailStyles.detailsGrid}">
        <div style="${emailStyles.detailItem}">
          <div style="${emailStyles.detailIcon}">${category.icon || '📋'}</div>
          <div style="${emailStyles.detailLabel}">Category</div>
          <div style="${emailStyles.detailValue}">${category.label}</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">${category.description}</div>
        </div>

        <div style="${emailStyles.detailItem}">
          <div style="${emailStyles.detailIcon}">${charityType.icon || '💝'}</div>
          <div style="${emailStyles.detailLabel}">Charity Type</div>
          <div style="${emailStyles.detailValue}">${charityType.label}</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">${charityType.description}</div>
        </div>

        <div style="${emailStyles.detailItem}">
          <div style="${emailStyles.detailIcon}">📅</div>
          <div style="${emailStyles.detailLabel}">Date</div>
          <div style="${emailStyles.detailValue}">${formattedDate}</div>
        </div>

        <div style="${emailStyles.detailItem}">
          <div style="${emailStyles.detailIcon}">🕋</div>
          <div style="${emailStyles.detailLabel}">Blessings</div>
          <div style="${emailStyles.detailValue}">700x Reward</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">Surah Al-Baqarah: 261</div>
        </div>
      </div>

      <!-- Receipt Information -->
      <div style="${emailStyles.receiptBox}">
        <div style="font-weight: bold; color: #667eea; margin-bottom: 10px;">📎 Receipt Details</div>
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span style="color: #666;">Receipt Number:</span>
          <span style="font-weight: 600;">${donation.receiptNumber}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span style="color: #666;">Transaction ID:</span>
          <span style="font-weight: 600;">${donation.transactionId || 'N/A'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span style="color: #666;">Payment Method:</span>
          <span style="font-weight: 600;">${donation.paymentMethod || 'Online Transfer'}</span>
        </div>
      </div>

      <!-- Tax Information (if applicable) -->
      ${donation.taxDeductible ? `
        <div style="${emailStyles.taxInfo}">
          <strong>📋 Tax Information:</strong><br>
          This donation is tax-deductible under Section 2(36) of the Income Tax Ordinance, 2001.
          Your receipt number ${donation.receiptNumber} is valid for tax credit.
        </div>
      ` : ''}



      <!-- Impact Statement -->
      <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #e9eef5 100%); border-radius: 10px;">
        <h3 style="color: #333; margin-top: 0;">Your Impact 🌍</h3>
        <p style="color: #666; line-height: 1.6;">
          Your generous donation of PKR ${donation.amount.toLocaleString()} will help us 
          ${this.getImpactMessage(donation.category)}. 
          This is part of our ongoing commitment to serve humanity and please Allah SWT.
        </p>
      </div>

      <!-- Footer -->
      <div style="${emailStyles.footer}">
        <div style="${emailStyles.socialLinks}">
          <a href="#" style="${emailStyles.socialIcon}">📘 Facebook</a>
          <a href="#" style="${emailStyles.socialIcon}">🐦 Twitter</a>
          <a href="#" style="${emailStyles.socialIcon}">📸 Instagram</a>
          <a href="#" style="${emailStyles.socialIcon}">▶️ YouTube</a>
        </div>
        
        <p style="margin: 10px 0;">
          Charity Organization<br>
          ${process.env.CHARITY_ADDRESS || '123 Charity Street, Islamabad, Pakistan'}<br>
          Contact: ${process.env.CHARITY_PHONE || '+92 123 4567890'}
        </p>
        
        <p style="font-size: 12px; color: #999; margin-top: 20px;">
          This email was sent to ${donation.email}. You're receiving this because you made a donation.<br>
          © ${new Date().getFullYear()} Charity Organization. All rights reserved.
        </p>
        
        <p style="font-size: 12px; color: #999;">
          Prophet Muhammad (ﷺ) said: "Save yourself from Hellfire even by giving half a date in charity." (Bukhari)
        </p>
      </div>
    `;
  }

  generateTextContent(donation) {
    const charityType = charityTypeLabels[donation.charityType]?.label || donation.charityType;
    const category = categoryLabels[donation.category]?.label || donation.category;
    
    return `
      ASSALAMU ALAIKUM ${donation.donorName}!

      JazakAllah Khair for your generous donation of PKR ${donation.amount.toLocaleString()}!

      DONATION DETAILS:
      • Category: ${category}
      • Charity Type: ${charityType}
      • Receipt Number: ${donation.receiptNumber}
      • Date: ${new Date().toLocaleDateString('en-PK')}
      • Transaction ID: ${donation.transactionId || 'N/A'}

      Your donation will help us serve those in need and please Allah SWT.
      May Allah accept your charity and grant you barakah in your wealth.

      For tax receipt or inquiries, please contact us.

      Contact Us:
      📞 ${process.env.CHARITY_PHONE || '+92 123 4567890'}
      📧 ${process.env.EMAIL_USER}
      🌐 ${process.env.CHARITY_WEBSITE || 'www.charity.org'}

      "The example of those who spend their wealth in the way of Allah is like a seed of grain 
      which grows seven spikes; in each spike is a hundred grains. And Allah multiplies His 
      reward for whom He wills." (Quran 2:261)
    `;
  }

  // ✅ FIXED: Removed donation parameter, now accepts category directly
  getImpactMessage(category) {
    const messages = {
      boys_madrasa: "educate young boys in Islamic studies and provide them with a strong foundation in Deen",
      girls_madrasa: "empower young girls with Islamic knowledge and academic excellence",
      masjid: "maintain and operate masjids for the community to worship Allah",
      cement: "construct and repair masjids, madrasas, and community centers",
      islamic_books: "publish and distribute authentic Islamic literature",
      construction: "develop sustainable infrastructure for underprivileged communities",
      ration: "provide essential food supplies to struggling families",
      food_distribution: "feed the hungry and ensure no one sleeps without a meal"
    };
    return messages[category] || "make a significant impact in the lives of those in need";
  }

  numberToWords(num) {
    // Simple implementation - you can expand this
    return `${num.toLocaleString()}`;
  }

  async sendDonationConfirmation(donation) {
    try {
      // Validate required fields
      if (!donation.email) {
        throw new Error('Donor email is required');
      }
      if (!donation.receiptNumber) {
        throw new Error('Receipt number is required');
      }

      const htmlContent = this.generateDonationEmailContent(donation);
      const fullHTML = this.generateHTMLTemplate(htmlContent, {
        title: `Donation Confirmation - ${donation.receiptNumber}`,
        logo: charityTypeLabels[donation.charityType]?.icon || '🤝'
      });

      const mailOptions = {
        from: `"Charity Organization" <${process.env.EMAIL_USER}>`,
        to: donation.email,
        subject: `🤝 JazakAllah Khair! Your Donation Confirmed - ${donation.receiptNumber}`,
        text: this.generateTextContent(donation),
        html: fullHTML,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Donation email sent to ${donation.email}: ${info.messageId}`);

      // Send admin notification with detailed information
      if (process.env.ADMIN_EMAIL) {
        await this.sendAdminNotification(donation, info);
      }

      return { 
        success: true, 
        messageId: info.messageId,
        donorEmail: donation.email,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Email failed:', {
        error: error.message,
        donation: donation?.receiptNumber || 'Unknown',
        donor: donation?.email || 'Unknown'
      });
      
      return { 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async sendAdminNotification(donation, emailInfo) {
    try {
      const adminHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">🆕 New Donation Received</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
            <h3>Donor Information</h3>
            <p><strong>Name:</strong> ${donation.donorName}</p>
            <p><strong>Email:</strong> ${donation.email}</p>
            <p><strong>Phone:</strong> ${donation.phone || 'Not provided'}</p>
            
            <h3>Donation Details</h3>
            <p><strong>Amount:</strong> PKR ${donation.amount.toLocaleString()}</p>
            <p><strong>Category:</strong> ${categoryLabels[donation.category]?.label || donation.category}</p>
            <p><strong>Charity Type:</strong> ${charityTypeLabels[donation.charityType]?.label || donation.charityType}</p>
            <p><strong>Receipt Number:</strong> ${donation.receiptNumber}</p>
            <p><strong>Transaction ID:</strong> ${donation.transactionId || 'N/A'}</p>
            
            <h3>Email Status</h3>
            <p><strong>Confirmation Email:</strong> Sent to ${donation.email}</p>
            <p><strong>Message ID:</strong> ${emailInfo.messageId}</p>
            <p><strong>Sent At:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"Charity System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `💰 New Donation: PKR ${donation.amount.toLocaleString()} - ${donation.donorName}`,
        html: adminHTML,
        text: `New donation received!\n\nDonor: ${donation.donorName}\nAmount: PKR ${donation.amount}\nCategory: ${donation.category}\nReceipt: ${donation.receiptNumber}`
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Admin notification sent for donation ${donation.receiptNumber}`);
      
    } catch (error) {
      console.error('❌ Admin notification failed:', error.message);
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

// ✅ Export singleton instance
const emailService = new EmailService();

// Verify connection on startup (non-blocking)
emailService.verifyConnection().catch(console.error);

export default emailService;