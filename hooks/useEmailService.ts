import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('email');
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = async (type: string, data: unknown) => {
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
        toast.success(t('sendSuccess'));
        return true;
      } else {
        toast.error(result.error || t('sendError'));
        return false;
      }
    } catch (error) {
      console.error('Email service error:', error);
      toast.error(t('sendError'));
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

  const sendCustomEmail = async (emailData: unknown) => {
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
