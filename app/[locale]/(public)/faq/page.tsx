"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconChevronDown, IconQuestionMark } from "@tabler/icons-react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useRouter } from "next/navigation";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: "Kulübe nasıl üye olabilirim?",
    answer: "ESOES'e üye olmak için sosyal medya hesaplarımızı takip edebilir ve üyelik başvuru formunu doldurabilirsiniz. Başvurular genellikle her dönem başında açılır ve tüm mühendislik öğrencilerine açıktır. Üyelik sürecinde motivasyon mektubu ve kısa bir mülakat bulunmaktadır.",
    category: "Üyelik"
  },
  {
    question: "Etkinlikler herkese açık mı?",
    answer: "Evet! ESOES'in düzenlediği çoğu etkinlik tüm öğrencilere açıktır. Teknik konferanslar, workshop'lar, networking etkinlikleri ve sosyal aktiviteler herkesin katılımına açıktır. Sadece bazı özel eğitim programları üyelerimize özeldir.",
    category: "Etkinlikler"
  },
  {
    question: "Gönüllü olarak çalışabilir miyim?",
    answer: "Kesinlikle! ESOES'te gönüllü olarak çalışmak mümkündür. Etkinlik organizasyonunda, teknik projelerde, sosyal medya yönetiminde veya diğer departmanlarda gönüllü olarak yer alabilirsiniz. Bu, hem deneyim kazanmanızı hem de topluluğa katkıda bulunmanızı sağlar.",
    category: "Gönüllülük"
  },
  {
    question: "Hangi departmanlarda çalışabilirim?",
    answer: "ESOES'te Eğitim ve Organizasyon, Kurumsal İlişkiler, Medya ve Tanıtım departmanlarında çalışabilirsiniz. Her departmanın kendine özgü sorumlulukları ve projeleri bulunmaktadır. İlgi alanlarınıza göre size en uygun departmanı seçebilirsiniz.",
    category: "Departmanlar"
  },
  {
    question: "Teknik bilgi seviyem düşük, yine de katılabilir miyim?",
    answer: "Tabii ki! ESOES, tüm seviyelerdeki öğrencilere açıktır. Başlangıç seviyesinde olsanız bile, eğitim programlarımız ve mentorluk sistemi sayesinde kendinizi geliştirebilirsiniz. Önemli olan öğrenmeye açık olmanız ve istekli olmanızdır.",
    category: "Üyelik"
  },
  {
    question: "Hangi etkinlikler düzenleniyor?",
    answer: "ESOES olarak HEBOCON, GameJam, SOF (İmza etkinliğimiz), EsTalks, teknik geziler, workshop'lar ve networking etkinlikleri düzenliyoruz. Ayrıca sektör profesyonelleri ile buluşma fırsatları ve kariyer günleri de organize ediyoruz.",
    category: "Etkinlikler"
  },
  {
    question: "Üyelik ücreti var mı?",
    answer: "Hayır, ESOES'e üye olmak tamamen ücretsizdir. Tüm etkinliklerimiz ve eğitim programlarımız da ücretsizdir. Sadece bazı özel workshop'larda materyal ücreti olabilir, ancak bu durum önceden duyurulur.",
    category: "Üyelik"
  },
  {
    question: "Mezun olduktan sonra da devam edebilir miyim?",
    answer: "Evet! ESOES mezunlar ağımız oldukça güçlüdür. Mezun olduktan sonra mentor olarak geri dönebilir, etkinliklerde konuşmacı olarak yer alabilir veya mezunlar ağımıza katılarak topluluğumuzun bir parçası olmaya devam edebilirsiniz.",
    category: "Gönüllülük"
  }
];

const categories = ["Tümü", "Üyelik", "Etkinlikler", "Gönüllülük", "Departmanlar"];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const router = useRouter();

  const filteredFAQs = selectedCategory === "Tümü" 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

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
            ESOES hakkında merak ettiğiniz her şeyi burada bulabilirsiniz. 
            Sorularınızın cevabını bulamazsanız bizimle iletişime geçebilirsiniz.
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
              {category}
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
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={`${faq.question}-${selectedCategory}`}
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
                      {faq.category}
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
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Hala sorunuz mu var?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            Sorularınızın cevabını burada bulamadıysanız, sosyal medya hesaplarımızdan 
            veya e-posta yoluyla bizimle iletişime geçebilirsiniz.
          </p>
          <HoverBorderGradient
            as="button"
            duration={0.7}
            containerClassName="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            className="text-lg"
            onClick={() => router.push("/contact")}
          >
            İletişime Geç
          </HoverBorderGradient>
        </motion.div>
      </div>
    </BackgroundLines>
  );
}
