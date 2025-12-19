"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';
import { IconBrandLinkedinFilled, IconBrandYoutube, IconBrandTiktok, IconBrandInstagram } from '@tabler/icons-react';

export default function Footer() {
  const socials = [
    { icon: <IconBrandInstagram size={20} />, href: 'https://instagram.com/esoes', hoverColor: 'pink-500' },
    { icon: <IconBrandLinkedinFilled size={20} />, href: 'https://linkedin.com/company/esoes', hoverColor: 'blue-700' },
    { icon: <IconBrandYoutube size={20} />, href: 'https://youtube.com/@esoes', hoverColor: 'red-500' },
    { icon: <IconBrandTiktok size={20} />, href: 'https://tiktok.com/@esoes', hoverColor: 'cyan-500' },
  ];

  return (
    <footer className="bg-black text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Grid */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
          
          {/* Company Info - Takes more space */}
          <div className="w-full md:max-w-md">
            <GridItem
               title="ESOES"
              description="Eskişehir Mühendislik Öğrencileri Çevre Sürdürülebilirliği Topluluğu"
            />
          </div>

          {/* Contact Info */}
          <div className="w-full md:max-w-sm">
            <GridItem
              icon={null}
              title="İletişim"
              description={
                <div className="space-y-1 text-sm">
                  <a href="mailto:info@esoes.org" className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                    <Mail size={16} className="text-purple-400" />
                    <span>info@esoes.org</span>
                  </a>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer hover:text-purple-300 transition-colors">
                    <MapPin size={16} className="text-purple-400" />
                    <span>Eskişehir, Türkiye</span>
                  </a>
                </div>
              }
            />
          </div>

          {/* Social Media - Compact vertical design */}
          <div className="w-full md:w-auto">
            <div className="h-full rounded-2xl border p-3 border-gray-800 relative min-h-[12rem]">
              <div className="relative flex flex-col items-center justify-start h-full rounded-xl p-2 bg-gray-900/30">
                <div className="flex flex-col items-center gap-3 pt-4">
                  <h3 className="font-sans text-lg font-semibold text-white text-center">
                    Sosyal Medya
                  </h3>
                  <div className="flex flex-row md:flex-col gap-2">
                    {socials.map((social) => (
                      <SocialIcon key={social.href} {...social} />
                    ))}
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
              © 2024 ESOES. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-4 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Kullanım Şartları</Link>
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
        {icon && (
          <div className="w-fit rounded-lg border border-gray-600 p-2">
            {icon}
          </div>
        )}
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

const socialHoverClasses: { [key: string]: string } = {
  'pink-500': 'hover:text-pink-500',
  'blue-700': 'hover:text-blue-700',
  'red-500': 'hover:text-red-500',
  'cyan-500': 'hover:text-cyan-500',
};

const SocialIcon = ({ icon, href, hoverColor }: { icon: React.ReactNode; href: string; hoverColor: string }) => {
  const hoverClass = socialHoverClasses[hoverColor] || 'hover:text-white';
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 transition-colors duration-200 ${hoverClass}`}
    >
      {icon}
    </a>
  );
};
