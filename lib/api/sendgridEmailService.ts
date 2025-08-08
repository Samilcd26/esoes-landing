import sgMail from '@sendgrid/mail';

// SendGrid API key configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@esoes.com';

// Initialize SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY is not set. Email functionality will be disabled.');
}

export interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EventRegistrationData {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  userName: string;
  userEmail: string;
}

export class SendGridEmailService {
  /**
   * Send a simple email
   */
  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      if (!SENDGRID_API_KEY) {
        console.error('SendGrid API key not configured');
        return false;
      }

     

      await sgMail.send({
        to: emailData.to,
        from: emailData.from || FROM_EMAIL,
        subject: emailData.subject,
        text: emailData.text || '',
        html: emailData.html,
      });
      console.log('Email sent successfully to:', emailData.to);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send contact form email
   */
  static async sendContactFormEmail(formData: ContactFormData): Promise<boolean> {
    const subject = `New Contact Form Submission: ${formData.subject}`;
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Subject:</strong> ${formData.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.message}</p>
    `;

    return this.sendEmail({
      to: 'info@esoes.com', // Admin email
      subject,
      html,
    });
  }

  /**
   * Send event registration confirmation email
   */
  static async sendEventRegistrationEmail(registrationData: EventRegistrationData): Promise<boolean> {
    const subject = `Event Registration Confirmation: ${registrationData.eventTitle}`;
    const html = `
      <h2>Event Registration Confirmation</h2>
      <p>Dear ${registrationData.userName},</p>
      <p>Thank you for registering for our event!</p>
      <h3>Event Details:</h3>
      <ul>
        <li><strong>Event:</strong> ${registrationData.eventTitle}</li>
        <li><strong>Date:</strong> ${registrationData.eventDate}</li>
        <li><strong>Location:</strong> ${registrationData.eventLocation}</li>
      </ul>
      <p>We look forward to seeing you at the event!</p>
      <p>Best regards,<br>ESOES Team</p>
    `;

    return this.sendEmail({
      to: registrationData.userEmail,
      subject,
      html,
    });
  }

  /**
   * Send welcome email to new users
   */
  static async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const subject = 'Welcome to ESOES!';
    const html = `
      <h2>Welcome to ESOES!</h2>
      <p>Dear ${userName},</p>
      <p>Welcome to ESOES! We're excited to have you as part of our community.</p>
      <p>You can now:</p>
      <ul>
        <li>Browse and register for events</li>
        <li>Access exclusive content</li>
        <li>Connect with other members</li>
      </ul>
      <p>If you have any questions, feel free to contact us.</p>
      <p>Best regards,<br>ESOES Team</p>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const html = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your ESOES account.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
      <p>Best regards,<br>ESOES Team</p>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }
}

export default SendGridEmailService;
