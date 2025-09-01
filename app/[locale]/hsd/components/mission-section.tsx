"use client";

import { motion } from "motion/react";
import { SparklesCore } from "@/components/ui/sparkles";

interface MissionSectionProps {
  title: string;
  missions: string[];
}

export default function MissionSection({ title, missions }: MissionSectionProps) {
  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-900/30 dark:to-gray-900">
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#3b82f6"
          speed={0.5}
        />
      </div>
      {/* Soft top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-800/50 via-transparent to-transparent dark:from-gray-900/50"></div>
      {/* Soft bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/30 via-transparent to-transparent dark:from-gray-900/30"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {title}
          </h3>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative mx-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl p-8 h-full shadow-xl">
                <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
                <div className="mt-16">
                  <p className="text-lg text-gray-800 dark:text-gray-100 leading-relaxed font-semibold">
                    {mission}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
