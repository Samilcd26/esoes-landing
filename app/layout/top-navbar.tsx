"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
//import { useCurrentUser, useLogout } from "@/hooks/useAuth";
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
  //const { data: user } = useCurrentUser();
  //const logoutMutation = useLogout();
  
  // Safe translation hook with fallback
  const t = useTranslations();
  const locale = useLocale();
  
  const navigationItems = getNavigationItems(t, locale);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };
/*
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }*/

  return (
    <Navbar className="max-w-7xl mx-auto">
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <div className="flex items-center space-x-4 flex-1 justify-center">
          {navigationItems.map((item) => {
            if (item.isSpecial) {
              return (
                <a
                  key={`nav-item-${item.key}`}
                  href={item.link}
                  onClick={handleItemClick}
                  className="relative group"
                >
                  <div className="px-4 py-2 text-white font-bold transform hover:-translate-y-1 transition duration-400">
                    <span className="relative z-10 flex items-center gap-1">
                      <span className="text-red-900">&lt;</span>
                      {item.name}
                      <span className="text-red-900">&gt;</span>
                    </span>
                  </div>
                </a>
              );
            }

            return (
              <a
                key={`nav-item-${item.key}`}
                href={item.link}
                onClick={handleItemClick}
                className="relative px-4 py-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          {/* Login button temporarily hidden
          {user ? (
            <div className="flex flex-col gap-0">
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                {t("navigation.welcome")}, {user.email?.split("@")[0]}
              </span>
              <NavbarButton 
                variant="secondary" 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="mt-1"
              >
                {logoutMutation.isPending ? t("navigation.loggingOut") : t("navigation.logout")}
              </NavbarButton>
            </div>
          ) : (
            <Link href="/login">
              <NavbarButton variant="primary" as="span">{t("navigation.login")}</NavbarButton>
            </Link>
          )}
          */}
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
          {navigationItems.map((item) => {
            if (item.isSpecial) {
              return (
                <a
                  key={`mobile-link-${item.key}`}
                  href={item.link}
                  onClick={handleItemClick}
                  className="flex w-full items-center justify-center"
                >
                  <div className="px-4 py-2 text-white font-bold transform hover:-translate-y-1 transition duration-400">
                    <span className="relative z-10 flex items-center gap-1">
                      <span className="text-red-900">&lt;</span>
                      {item.name}
                      <span className="text-red-900">&gt;</span>
                    </span>
                  </div>
                </a>
              );
            }

            return (
              <a
                key={`mobile-link-${item.key}`}
                href={item.link}
                onClick={handleItemClick}
                className="flex w-full items-center justify-center px-4 py-3 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            );
          })}
          <div className="flex w-full items-center justify-center px-4 py-3">
            <LanguageSelector />
            {/* Login button temporarily hidden
            {user ? (
              <div className="flex flex-col gap-0">
                <span className="text-sm text-neutral-600 dark:text-neutral-300">
                  {t("navigation.welcome")}, {user.email?.split("@")[0]}
                </span>
                <NavbarButton 
                  variant="secondary" 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="mt-1"
                >
                  {logoutMutation.isPending ? t("navigation.loggingOut") : t("navigation.logout")}
                </NavbarButton>
              </div>
            ) : (
              <Link href="/login">
                <NavbarButton variant="primary" as="span">{t("navigation.login")}</NavbarButton>
              </Link>
            )}
            */}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
