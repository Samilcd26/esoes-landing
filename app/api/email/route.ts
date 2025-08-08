import { NextRequest, NextResponse } from 'next/server';
import SendGridEmailService from '@/lib/api/sendgridEmailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let success = false;

    switch (type) {
      case 'contact':
        success = await SendGridEmailService.sendContactFormEmail(data);
        break;
      
      case 'event-registration':
        success = await SendGridEmailService.sendEventRegistrationEmail(data);
        break;
      
      case 'welcome':
        success = await SendGridEmailService.sendWelcomeEmail(data.email, data.name);
        break;
      
      case 'password-reset':
        success = await SendGridEmailService.sendPasswordResetEmail(data.email, data.resetToken);
        break;
      
      case 'custom':
        success = await SendGridEmailService.sendEmail(data);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    if (success) {
      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Email API is running' },
    { status: 200 }
  );
}
