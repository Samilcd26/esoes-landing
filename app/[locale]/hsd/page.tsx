"use client";

import ExpandableCardGrid from "@/components/ui/expandable-card-grid";
import { LoaderOne } from "@/components/ui/loader";
import { useSanityDepartmentsByCategory } from "@/hooks/useSanityDepartments";
import React from "react";
import { useTranslations } from "next-intl";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SparklesCore } from "@/components/ui/sparkles";
import { motion } from "motion/react";
import Image from "next/image";

export default function HsdDepartmentsPage() {
  const t = useTranslations('hsd');
  const tDept = useTranslations('department');
  const { data: departmentsResponse, isLoading, error } = useSanityDepartmentsByCategory('HSD');

  const departmentCards = departmentsResponse?.data?.map((department) => ({
    title: department.name,
    description: department.description,
    src:
      department.images?.[0]?.url ||
      "/assets/images/backgrounds/nova-04.jpeg",
    ctaText: tDept('card.ctaText'),
    ctaLink: `/department/${department.slug}`,
    content: () => {
      return (
        <div className="space-y-6">
          {/* Responsible Users Section */}
          {department.responsible && department.responsible.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {tDept('card.responsible.title')}
              </h4>
              <div className="space-y-3">
                {department.responsible.map((person, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                          {person.image ? (
                            <Image 
                              src={person.image} 
                              alt={`${person.firstName} ${person.lastName}`}
                              width={48}
                              height={48}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : null}
                          <span className={`${person.image ? 'hidden' : ''}`}>
                            {person.firstName?.[0]}{person.lastName?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {person.firstName} {person.lastName}
                        </p>
                        {person.title && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                            {person.title}
                          </p>
                        )}
                        <div className="space-y-1">
                          {person.phone && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <span className="text-blue-500">📞</span>
                              {person.phone}
                            </p>
                          )}
                          {person.email && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <span className="text-green-500">📧</span>
                              {person.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assistant Users Section */}
          {department.assistant && department.assistant.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                {tDept('card.assistant.title') || "Assistant Users"}
              </h4>
              <div className="space-y-3">
                {department.assistant.map((person, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border-l-4 border-purple-500">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                          {person.image ? (
                            <Image 
                              src={person.image} 
                              alt={`${person.firstName} ${person.lastName}`}
                              width={48}
                              height={48}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : null}
                          <span className={`${person.image ? 'hidden' : ''}`}>
                            {person.firstName?.[0]}{person.lastName?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {person.firstName} {person.lastName}
                        </p>
                        {person.title && (
                          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                            {person.title}
                          </p>
                        )}
                        <div className="space-y-1">
                          {person.phone && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <span className="text-blue-500">📞</span>
                              {person.phone}
                            </p>
                          )}
                          {person.email && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <span className="text-green-500">📧</span>
                              {person.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div>
            <h4 className="font-semibold text-lg mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
              {tDept('card.description.title')}
            </h4>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {department.description}
              </p>
            </div>
          </div>
        </div>
      );
    },
  })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoaderOne />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">{tDept('loading.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('loading.subtitle')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{tDept('error.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{tDept('error.message')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full !scroll-smooth">
      {/* Header Section with Background */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-purple-900/60 to-slate-800">
          <BackgroundBeams className="absolute inset-0" />
        </div>
        {/* Soft bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 via-gray-50/50 to-transparent dark:from-gray-900 dark:via-gray-900/50"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
          {/* Huawei Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16 flex justify-center"
          >
            <div className="relative w-80 h-40 md:w-96 md:h-48 bg-white/15 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 shadow-2xl">
              <Image
                src="/assets/images/huawei_logo.png"
                alt="Huawei"
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
              {t('header.title')}
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed max-w-4xl mx-auto">
              {t('header.description1')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section with Sparkles */}
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
              {t('mission.title')}
            </h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { text: t('mission.p1'), delay: 0.2 },
              { text: t('mission.p2'), delay: 0.4 },
              { text: t('mission.p3'), delay: 0.6 }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item.delay }}
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
                      {item.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
        {/* Soft top gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-50/80 via-transparent to-transparent dark:from-gray-900/80"></div>
        {/* Soft bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50/80 via-transparent to-transparent dark:from-gray-900/80"></div>
        <div className="relative z-10 text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('sections.departments.title')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('sections.departments.subtitle')}</p>
        </div>
        {departmentCards.length > 0 ? (
          <ExpandableCardGrid cards={departmentCards} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{tDept('empty')}</p>
          </div>
        )}
      </section>
    </div>
  );
}


