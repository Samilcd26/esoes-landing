'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconChevronDown, IconQuestionMark } from "@tabler/icons-react";
import { useSanityFaqs, useSanityFaqsByCategory } from "@/hooks/useSanityFaqs";
import { Faq } from "@/lib/types/api";

interface FaqSectionProps {
  title?: string;
  description?: string;
  showCategories?: boolean;
  limit?: number;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const categories = ["Tümü", "general", "events", "membership", "technical", "other"];

const categoryLabels: Record<string, string> = {
  "Tümü": "Tümü",
  "general": "Genel",
  "events": "Etkinlikler", 
  "membership": "Üyelik",
  "technical": "Teknik",
  "other": "Diğer"
};

export default function FaqSection({ 
  title = "Sıkça Sorulan Sorular",
  description = "ESOES hakkında merak ettiğiniz her şeyi burada bulabilirsiniz.",
  showCategories = true,
  limit,
  selectedCategory: externalSelectedCategory,
  onCategoryChange
}: FaqSectionProps) {
  const [internalSelectedCategory, setInternalSelectedCategory] = useState("Tümü");
  
  const selectedCategory = externalSelectedCategory || internalSelectedCategory;
  const handleCategoryChange = onCategoryChange || setInternalSelectedCategory;

  // Sanity hook'larını kullan
  const { data: allFaqsData, isLoading: isLoadingAll } = useSanityFaqs(limit ? { page: 1, limit } : undefined);
  const { data: categoryFaqsData, isLoading: isLoadingCategory } = useSanityFaqsByCategory(
    selectedCategory === "Tümü" ? "" : selectedCategory
  );

  const isLoading = isLoadingAll || isLoadingCategory;
  
  // FAQ verilerini al
  const faqs = selectedCategory === "Tümü" 
    ? allFaqsData?.data || []
    : categoryFaqsData || [];

  // FAQ'ları API formatından component formatına çevir
  const faqItems = faqs.map((faq: Faq) => ({
    question: faq.question_tr, // Türkçe soru
    answer: faq.answer_tr, // Türkçe cevap
    category: faq.category,
    id: faq.id
  }));

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <IconQuestionMark className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Yükleniyor...
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
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
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
          >
            {title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        {showCategories && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`font-medium px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </motion.div>
        )}

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
                      {categoryLabels[faq.category] || faq.category}
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
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                Bu kategoride henüz soru bulunmuyor
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Farklı bir kategori seçebilir veya bizimle iletişime geçebilirsiniz.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
