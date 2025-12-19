"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";

const navigationItems: Array<{
  key: string;
  name: string;
  link: string;
  isSpecial?: boolean;
}> = [
  {
    key: "calendar",
    name: "Takvim",
    link: "/calendar",
  },
  {
    key: "events",
    name: "Etkinlikler",
    link: "/events",
  },
  {
    key: "gallery",
    name: "Galeri",
    link: "/gallery",
  },
  {
    key: "department",
    name: "Departmanlar",
    link: "/department",
  },
  {
    key: "hsd",
    name: "HSD",
    link: "/hsd",
    isSpecial: true,
  },
  {
    key: "faq",
    name: "SSS",
    link: "/faq",
  },
];

export default function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false);

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
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
