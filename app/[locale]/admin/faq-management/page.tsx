import React from 'react';
import { useTranslations } from 'next-intl';
import FaqManagement from '@/components/admin/faq-management/FaqManagement';

const FaqManagementPage: React.FC = () => {
  const t = useTranslations('FaqManagement');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <FaqManagement />
    </div>
  );
};

export default FaqManagementPage;