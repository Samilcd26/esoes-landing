import { useState } from 'react';
import { toast } from 'sonner';

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

export const useEmailService = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = async (type: string, data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Email sent successfully!');
        return true;
      } else {
        toast.error(result.error || 'Failed to send email');
        return false;
      }
    } catch (error) {
      console.error('Email service error:', error);
      toast.error('Failed to send email');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendContactFormEmail = async (formData: ContactFormData) => {
    return sendEmail('contact', formData);
  };

  const sendEventRegistrationEmail = async (registrationData: EventRegistrationData) => {
    return sendEmail('event-registration', registrationData);
  };

  const sendWelcomeEmail = async (email: string, name: string) => {
    return sendEmail('welcome', { email, name });
  };

  const sendPasswordResetEmail = async (email: string, resetToken: string) => {
    return sendEmail('password-reset', { email, resetToken });
  };

  const sendCustomEmail = async (emailData: any) => {
    return sendEmail('custom', emailData);
  };

  return {
    isLoading,
    sendContactFormEmail,
    sendEventRegistrationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendCustomEmail,
  };
};
