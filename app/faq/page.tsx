"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconChevronDown, IconQuestionMark } from "@tabler/icons-react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSanityFaqs, useSanityFaqsByCategory } from "@/hooks/useSanityFaqs";
import { Faq } from "@/lib/types/api";
import { FaqCategory } from "@/lib/types/enum";

const categories = ["all", "general", "events", "membership", "technical", "other"] as const;

// Helper function to convert FaqCategory enum to display string
const getCategoryDisplayName = (category: FaqCategory | string): string => {
  // If it's already a string, use it directly
  if (typeof category === 'string') {
    const categoryLower = category.toLowerCase();
    if (categoryLower === 'all') return 'Tümü';
    if (categoryLower === 'general') return 'Genel';
    if (categoryLower === 'events') return 'Etkinlikler';
    if (categoryLower === 'membership') return 'Üyelik';
    if (categoryLower === 'technical') return 'Teknik';
    if (categoryLower === 'other') return 'Diğer';
    return 'Diğer';
  }
  
  // If it's an enum, get the enum key name by finding the key
  const categoryKey = Object.keys(FaqCategory).find(
    key => FaqCategory[key as keyof typeof FaqCategory] === category
  );
  
  if (!categoryKey) return 'Diğer';
  
  const categoryStr = categoryKey.toLowerCase();
  if (categoryStr === 'general') return 'Genel';
  if (categoryStr === 'technical') return 'Teknik';
  if (categoryStr === 'account' || categoryStr === 'billing') return 'Üyelik';
  if (categoryStr === 'support') return 'Destek';
  if (categoryStr === 'other') return 'Diğer';
  return 'Diğer';
};

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("all");

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
      <LoadingSpinner 
      title="Yükleniyor..."
      subtitle="SSS getiriliyor"
      className="min-h-[60vh]"
    />
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
            Sıkça Sorulan Sorular
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            ESOES hakkında merak ettiğiniz soruların cevapları
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
              {category === 'all' ? 'Tümü' : category === 'general' ? 'Genel' : category === 'events' ? 'Etkinlikler' : category === 'membership' ? 'Üyelik' : category === 'technical' ? 'Teknik' : 'Diğer'}
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
                      {getCategoryDisplayName(faq.category)}
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
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Henüz soru bulunamadı</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Yakında daha fazla soru eklenecek</p>
            </div>
          </motion.div>
        )}

      </div>
    </BackgroundLines>
  );
}
