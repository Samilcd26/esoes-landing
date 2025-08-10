"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconChevronDown, IconQuestionMark } from "@tabler/icons-react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useRouter } from "next/navigation";
import { useSanityFaqs, useSanityFaqsByCategory } from "@/hooks/useSanityFaqs";
import { Faq } from "@/lib/types/api";
import { useTranslations } from "next-intl";

const categories = ["all", "general", "events", "membership", "technical", "other"] as const;

export default function FAQPage() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("all");
  const router = useRouter();

  // Sanity hook'larını kullan
  const { data: allFaqsData, isLoading: isLoadingAll } = useSanityFaqs();
  const { data: categoryFaqsData, isLoading: isLoadingCategory } = useSanityFaqsByCategory(
    selectedCategory === "all" ? "" : selectedCategory
  );

  const isLoading = isLoadingAll || isLoadingCategory;
  
  // FAQ verilerini al
  const faqs = selectedCategory === "all" 
    ? allFaqsData?.data || []
    : categoryFaqsData || [];

  // FAQ'ları API formatından component formatına çevir
  const faqItems = faqs.map((faq: Faq) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    id: faq.id
  }));

  if (isLoading) {
    return (
      <BackgroundLines 
        className="min-h-screen"
        svgOptions={{ duration: 4 }}
      >
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <IconQuestionMark className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200 mb-4">
              {t('loading.title')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t('loading.subtitle')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </BackgroundLines>
    );
  }

  return (
    <BackgroundLines 
      className="min-h-screen"
      svgOptions={{ duration: 4 }}
    >
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.1, 
              rotate: 360,
              transition: { duration: 0.6 }
            }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg"
          >
            <IconQuestionMark className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200 mb-4"
          >
            {t('header.title')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            {t('header.subtitle')}
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <HoverBorderGradient
              key={category}
              as="button"
              duration={0.5}
              containerClassName={
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }
              className="font-medium px-6 py-3"
              onClick={() => setSelectedCategory(category)}
            >
              {t(`categories.${category}`)}
            </HoverBorderGradient>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="max-w-4xl mx-auto space-y-4"
        >
          <AnimatePresence mode="wait">
            {faqItems.map((faq, index) => (
              <motion.div
                key={`${faq.id}-${selectedCategory}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                  whileHover={{ 
                    scale: 1.01,
                    backgroundColor: "rgba(59, 130, 246, 0.05)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                      {t(`categories.${faq.category}`)}
                    </span>
                  </div>
                  <motion.div
                    animate={{ 
                      rotate: openIndex === index ? 180 : 0,
                      scale: openIndex === index ? 1.1 : 1
                    }}
                    transition={{ 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    className="ml-4 flex-shrink-0"
                  >
                    <IconChevronDown className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: "easeInOut",
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: 0.1,
                            type: "spring",
                            stiffness: 100,
                            damping: 20
                          }}
                          className="text-slate-600 dark:text-slate-300 leading-relaxed"
                        >
                          {faq.answer}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {faqItems.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <IconQuestionMark className="w-24 h-24 mx-auto text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">{t('empty.title')}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg">{t('empty.subtitle')}</p>
            </div>
          </motion.div>
        )}

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          whileHover={{ 
            scale: 1.02,
            y: -5,
            transition: { duration: 0.3 }
          }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-3xl border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('contact.title')}</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
          <HoverBorderGradient
            as="button"
            duration={0.7}
            containerClassName="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            className="text-lg"
            onClick={() => router.push("/contact")}
          >
            {t('contact.button')}
          </HoverBorderGradient>
        </motion.div>
      </div>
    </BackgroundLines>
  );
}
