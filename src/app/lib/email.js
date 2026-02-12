import nodemailer from "nodemailer";

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendStaffRegistrationEmail(email, name, password, role) {
  try {
    const mailOptions = {
      from: `"Darul Raza Admin" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Welcome to Darul Raza - Staff Account Created",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Darul Raza</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Staff Portal</p>
          </div>
          
          <div style="padding: 30px; background: white; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin-top: 0;">Welcome, ${name}!</h2>
            
            <p style="color: #374151; line-height: 1.6;">
              Your staff account has been successfully created by the administrator.
              You can now log in to the Darul Raza staff portal using the credentials below:
            </p>
            
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151; display: block; margin-bottom: 5px;">Login URL:</strong>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/staff_login" 
                   style="color: #059669; text-decoration: none;">
                  ${process.env.NEXT_PUBLIC_APP_URL}/staff_login
                </a>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151; display: block; margin-bottom: 5px;">Your Email:</strong>
                <span style="color: #111827; font-family: monospace;">${email}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151; display: block; margin-bottom: 5px;">Your Password:</strong>
                <span style="color: #111827; font-family: monospace; background: #f3f4f6; padding: 5px 10px; border-radius: 4px;">
                  ${password}
                </span>
              </div>
              
              <div>
                <strong style="color: #374151; display: block; margin-bottom: 5px;">Your Role:</strong>
                <span style="color: #111827; text-transform: capitalize;">${role}</span>
              </div>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              <strong>Important Security Note:</strong>
              1. Do not share your credentials with anyone
              <br/>
              2. Contact the administrator if you face any issues
            </p>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #065f46; margin: 0; font-size: 14px;">
                <strong>Role Permissions:</strong>
                As a ${role}, you have access to ${role === "admin" ? "all administrative functions" : "donation collection and management features"}.
              </p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              This is an automated message from Darul Raza. Please do not reply to this email.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
              © ${new Date().getFullYear()} Darul Raza. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Registration email sent to ${email}`);
  } catch (error) {
    console.error("Error sending registration email:", error);
    // Don't throw error here, just log it
    // We don't want registration to fail just because email failed
  }
}
