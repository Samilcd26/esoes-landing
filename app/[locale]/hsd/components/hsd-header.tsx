"use client";

import { motion } from "motion/react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Image from "next/image";

interface HsdHeaderProps {
  title: string;
  description: string;
}

export default function HsdHeader({ title, description }: HsdHeaderProps) {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-purple-900/60 to-slate-800">
        <BackgroundBeams className="absolute inset-0" />
      </div>
      {/* Soft bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 via-gray-50/50 to-transparent dark:from-gray-900 dark:via-gray-900/50"></div>
      <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
        {/* HUAWEI Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 flex justify-center"
        >
          <div className="relative w-80 h-40 md:w-96 md:h-48 bg-white/15 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 shadow-2xl">
            <Image
              src="/assets/images/huawei_logo.png"
              alt="HUAWEI"
              fill
              className="object-contain p-3"
              priority
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent mb-8">
            {title}
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed max-w-4xl mx-auto">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
