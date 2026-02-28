import nodemailer from "nodemailer";
import { injectable } from "tsyringe";

@injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: `"Security Team" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  }

// Beautiful Email Templates with Blue Color Scheme

async sendVerificationEmail(email: string, token: string) {
  const link = `${process.env.FRONTEND_URL}/verify?token=${token}`;
  await this.sendEmail(
    email,
    "Verify your account",
    `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0f9ff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header with gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%); padding: 40px 30px; text-align: center;">
                  <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center;">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Verify Your Email</h1>
                  <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Complete your registration</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                    Thank you for signing up! We're excited to have you on board.
                  </p>
                  <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                    To complete your registration and start using your account, please verify your email address by clicking the button below:
                  </p>
                  
                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 10px 0 30px 0;">
                        <a href="${link}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                          Verify Email Address
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    Or copy and paste this link in your browser:
                  </p>
                  <p style="margin: 0 0 30px 0; padding: 16px; background-color: #f0f9ff; border-radius: 8px; color: #3b82f6; font-size: 13px; word-break: break-all; border-left: 4px solid #3b82f6;">
                    ${link}
                  </p>
                  
                  <div style="padding: 20px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                      <strong>⚠️ Security Note:</strong> This link will expire in 24 hours. If you didn't create an account, please ignore this email.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                    © 2024 Your Company. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    If you have any questions, contact us at support@yourcompany.com
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
  );
}

async sendAccountBlockedEmail(email: string, blockedUntil: Date) {
  const formattedDate = blockedUntil.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  await this.sendEmail(
    email,
    "Account Temporarily Blocked",
    `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0f9ff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%); padding: 40px 30px; text-align: center;">
                  <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center;">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Account Temporarily Blocked</h1>
                  <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Security Alert</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                    Your account has been temporarily blocked due to multiple failed login attempts or suspicious activity.
                  </p>
                  
                  <div style="padding: 24px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; margin: 0 0 30px 0; border: 2px solid #3b82f6;">
                    <p style="margin: 0 0 10px 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                      🔒 Account Status: Blocked
                    </p>
                    <p style="margin: 0; color: #1e3a8a; font-size: 20px; font-weight: bold;">
                      Until: ${formattedDate}
                    </p>
                  </div>
                  
                  <div style="padding: 20px; background-color: #eff6ff; border-radius: 8px; margin: 0 0 30px 0;">
                    <p style="margin: 0 0 15px 0; color: #1e40af; font-size: 15px; font-weight: 600;">
                      What this means:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                      <li>You cannot log in until the block expires</li>
                      <li>This is a security measure to protect your account</li>
                      <li>Access will be automatically restored after the block period</li>
                    </ul>
                  </div>
                  
                  <div style="padding: 20px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                      <strong>⚠️ Didn't attempt to log in?</strong><br>
                      If you didn't try to access your account, please contact our support team immediately at support@yourcompany.com
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                    © 2024 Your Company. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    This is an automated security notification
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
  );
}

async sendNewDeviceAlert(email: string, device: string) {
  await this.sendEmail(
    email,
    "New Device Login Detected",
    `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0f9ff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%); padding: 40px 30px; text-align: center;">
                  <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center;">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    </svg>
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">New Device Login</h1>
                  <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Security Alert</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                    We detected a new login to your account from a device we haven't seen before.
                  </p>
                  
                  <div style="padding: 24px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; margin: 0 0 30px 0; border: 2px solid #3b82f6;">
                    <p style="margin: 0 0 10px 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                      📱 Device Information
                    </p>
                    <p style="margin: 0; color: #1e3a8a; font-size: 18px; font-weight: bold;">
                      ${device}
                    </p>
                  </div>
                  
                  <div style="padding: 20px; background-color: #eff6ff; border-radius: 8px; margin: 0 0 30px 0;">
                    <p style="margin: 0 0 15px 0; color: #1e40af; font-size: 15px; font-weight: 600;">
                      Was this you?
                    </p>
                    <p style="margin: 0 0 15px 0; color: #374151; font-size: 14px; line-height: 1.6;">
                      ✅ If you recognize this device, you can safely ignore this email.
                    </p>
                    <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6;">
                      ❌ If you don't recognize this login, your account may be compromised.
                    </p>
                  </div>
                  
                  <div style="padding: 20px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <p style="margin: 0 0 15px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                      🚨 Not you? Take action immediately:
                    </p>
                    <ol style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 14px; line-height: 1.8;">
                      <li>Change your password immediately</li>
                      <li>Review your recent account activity</li>
                      <li>Enable two-factor authentication</li>
                      <li>Contact support at support@yourcompany.com</li>
                    </ol>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                    © 2024 Your Company. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    This is an automated security notification
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
  );
}
}