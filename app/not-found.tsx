"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
      <BackgroundBeams className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="relative z-10 text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        >
          <h1 className="text-8xl md:text-9xl font-black text-white leading-none tracking-tighter">
            <span className="bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent">
              404
            </span>
          </h1>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-slate-100 mt-4 mb-6"
        >
          Sayfa Bulunamadı
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-slate-300 mb-10 max-w-md mx-auto"
        >
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className='flex justify-center'
        >
          <HoverBorderGradient
            as="div"
            containerClassName="rounded-lg"
            duration={0.8}
          >
            <Link 
              href="/tr/home"
            >
              Ana Sayfaya Dön
            </Link>
          </HoverBorderGradient>
        </motion.div>
      </div>
    </div>
  );
}
