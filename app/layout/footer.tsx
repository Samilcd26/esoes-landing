"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Mail,  MapPin } from 'lucide-react';
import Link from 'next/link';
import { IconBrandLinkedinFilled,IconBrandYoutube, IconBrandTiktok,IconBrandInstagram } from '@tabler/icons-react';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-black text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-12 xl:gap-4">
          
          {/* Company Info - Takes more space */}
          <div className="md:col-span-1 lg:col-span-2 xl:col-span-5">
            <GridItem
               title={t('company.title')}
              description={t('company.description')}
            />
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1 lg:col-span-1 xl:col-span-4">
            <GridItem
              icon={null}
              title={t('contact.title')}
              description={
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-purple-400" />
                    <span>{t('contact.email')}</span>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open('https://share.google/RB3wUvj52SUNHvXgO', '_blank');
                    }
                  }}>
                    <MapPin size={16} className="text-purple-400" />
                    <span>{t('contact.address')}</span>
                  </div>
                </div>
              }
            />
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1 lg:col-span-1 xl:col-span-2">
            <div className="h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 border-gray-800">
              <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl p-4 bg-gray-900/30">
                <div className="w-fit rounded-lg border border-gray-600 p-2">
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans text-lg font-semibold text-white">
                    {t('quickLinks.title')}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <Link href="/home" className="block hover:text-purple-400 transition-colors text-gray-300">{t('quickLinks.home')}</Link>
                    <Link href="/department" className="block hover:text-purple-400 transition-colors text-gray-300">{t('quickLinks.departments')}</Link>
                    <Link href="/gallery" className="block hover:text-purple-400 transition-colors text-gray-300">{t('quickLinks.gallery')}</Link>
                    <Link href="/faq" className="block hover:text-purple-400 transition-colors text-gray-300">{t('quickLinks.faq')}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media - Compact vertical design */}
          <div className="md:col-span-3 lg:col-span-4 xl:col-span-1 md:flex md:justify-center xl:block">
            <div className="w-full max-w-sm md:max-w-none xl:w-full h-full">
              <div className="h-full rounded-2xl border p-3 border-gray-800 relative min-h-[12rem]">
                <div className="relative flex flex-col items-center justify-start h-full rounded-xl p-2 bg-gray-900/30">
                  <div className="flex flex-col items-center gap-3 pt-4">
                    <h3 className="font-sans text-lg font-semibold text-white text-center">
                      {t('social.title')}
                    </h3>
                    <div className="flex xl:flex-col gap-2">
                      <SocialIcon icon={<IconBrandInstagram size={20} />} href="https://www.instagram.com/esoesogu" hoverColor="pink-500" />
                      <SocialIcon icon={<IconBrandLinkedinFilled size={20} />} href="https://www.linkedin.com/company/esoesog%C3%BC/" hoverColor="blue-700" />
                      <SocialIcon icon={<IconBrandYoutube size={20} />} href="https://www.youtube.com/@esoesogu" hoverColor="red-500" />
                      <SocialIcon icon={<IconBrandTiktok size={20} />} href="https://www.tiktok.com/@esoesogu" hoverColor="blue-600" />
                    </div>  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-400 text-sm">
              {t('bottom.copyright')}
            </p>
            <div className="flex gap-4 text-sm text-gray-400">
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface GridItemProps {
  icon?: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ icon, title, description }: GridItemProps) => {
  return (
    <div className="h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 border-gray-800 relative">
      <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl p-4 bg-gray-900/30">
        <div className="w-fit rounded-lg border border-gray-600 p-2">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="font-sans text-lg font-semibold text-white">
            {title}
          </h3>
          <div className="font-sans text-sm text-gray-300">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ icon, href, hoverColor }: { icon: React.ReactNode; href: string; hoverColor: string }) => {
  return (
    <a
      href={href}
      className={`w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:${hoverColor}`}
    >
      {icon}
    </a>
  );
};
