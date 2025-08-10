"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n";

const languages = {
  tr: { name: "Türkçe", flag: "🇹🇷" },
  en: { name: "English", flag: "🇺🇸" },
};

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Extract locale from pathname as the primary source of truth
  let locale: Locale = 'tr'; // Default fallback
  for (const supportedLocale of locales) {
    if (pathname.startsWith(`/${supportedLocale}`)) {
      locale = supportedLocale;
      break;
    }
  }
  
  // Safe translation hook with fallback
  const t = useTranslations("common");

  const switchLanguage = (newLocale: Locale) => {
    const currentPathname = pathname;
    
    // Remove any existing locale from the beginning of the pathname
    let pathnameWithoutLocale = currentPathname;
    
    // Check if pathname starts with any of the supported locales
    for (const supportedLocale of locales) {
      if (currentPathname.startsWith(`/${supportedLocale}`)) {
        pathnameWithoutLocale = currentPathname.slice(`/${supportedLocale}`.length);
        break;
      }
    }
    
    // Ensure we have a leading slash for the remaining path
    if (pathnameWithoutLocale && !pathnameWithoutLocale.startsWith('/')) {
      pathnameWithoutLocale = '/' + pathnameWithoutLocale;
    }
    
    // Create new path with new locale
    const newPath = `/${newLocale}${pathnameWithoutLocale || ''}`;
    
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-label={t("language")}
      >
        <span>{languages[locale].flag}</span>
        <span className="hidden sm:inline">{languages[locale].name}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-900 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700 z-20">
            <div className="py-1">
              {locales.map((lang) => (
                <button
                  key={lang}
                  onClick={() => switchLanguage(lang)}
                  className={`flex items-center justify-center gap-3 w-full px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 ${
                    locale === lang 
                      ? 'bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100' 
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <span>{languages[lang].flag}</span>
                  <span>{languages[lang].name}</span>
                  {locale === lang && (
                    <svg className="w-4 h-4 ml-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 