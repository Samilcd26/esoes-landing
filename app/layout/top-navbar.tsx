"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { LanguageSelector } from "@/components/ui/language-selector";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";

const getNavigationItems = (t: ReturnType<typeof useTranslations>, locale: string): Array<{
  key: string;
  name: string;
  link: string;
  isSpecial?: boolean;
}> => [
  {
    key: "calendar",
    name: t("navigation.calendar"),
    link: `/${locale}/calendar`,
  },
  {
    key: "events",
    name: t("navigation.events"),
    link: `/${locale}/events`,
  },
  {
    key: "gallery",
    name: t("navigation.gallery"),
    link: `/${locale}/gallery`,
  },
  {
    key: "department",
    name: t("navigation.department"),
    link: `/${locale}/department`,
  },
  {
    key: "hsd",
    name: t("navigation.hsd"),
    link: `/${locale}/hsd`,
    isSpecial: true,
  },
  {
    key: "faq",
    name: t("navigation.faq"),
    link: `/${locale}/faq`,
  },
];

export default function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const locale = useLocale();
  
  const navigationItems = getNavigationItems(t, locale);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <Navbar className="max-w-7xl mx-auto">
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <div className="flex items-center space-x-4 flex-1 justify-center">
          {navigationItems.map((item) => (
            <Link
              key={`nav-item-${item.key}`}
              href={item.link}
              onClick={handleItemClick}
              className={`relative group px-4 py-2 transition-colors duration-300 font-semibold ${
                item.isSpecial
                  ? "transition-transform hover:scale-105"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              }`}
            >
              {item.isSpecial ? (
                <span className="flex items-center gap-1 text-lg">
                  <span className="text-red-500 font-bold">&lt;</span>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{item.name}</span>
                  <span className="text-red-500 font-bold">&gt;</span>
                </span>
              ) : (
                <>
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transform -translate-x-1/2 transition-all duration-300 group-hover:w-full"></span>
                </>
              )}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <div className="flex items-center">
            <NavbarLogo />
          </div>
          <MobileNavToggle isOpen={isOpen} onClick={handleToggle} />
        </MobileNavHeader>
        
        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navigationItems.map((item) => (
            <Link
              key={`mobile-link-${item.key}`}
              href={item.link}
              onClick={handleItemClick}
              className={`w-full text-center px-4 py-3 font-medium transition-colors duration-200 ${
                item.isSpecial
                  ? ""
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
              }`}
            >
              {item.isSpecial ? (
                <span className="flex items-center justify-center gap-1 text-lg">
                  <span className="text-red-500 font-bold">&lt;</span>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{item.name}</span>
                  <span className="text-red-500 font-bold">&gt;</span>
                </span>
              ) : (
                item.name
              )}
            </Link>
          ))}
          <div className="flex w-full items-center justify-center px-4 py-3 mt-4 border-t border-neutral-200 dark:border-neutral-700">
            <LanguageSelector />
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
