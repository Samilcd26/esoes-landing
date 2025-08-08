import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">
          {t('common.pageNotFound') || 'Page Not Found'}
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          {t('common.pageNotFoundDescription') || 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'}
        </p>
        <Link 
          href="/home"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          {t('common.goHome') || 'Go Home'}
        </Link>
      </div>
    </div>
  );
}
