"use client";

import ExpandableCardGrid from "@/components/ui/expandable-card-grid";
import { LoaderOne } from "@/components/ui/loader";
import { useSanityDepartmentsByCategory } from "@/hooks/useSanityDepartments";
import React from "react";
import { useTranslations } from "next-intl";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SparklesCore } from "@/components/ui/sparkles";
import { motion } from "motion/react";

export default function HsdDepartmentsPage() {
  const t = useTranslations('hsd');
  const tDept = useTranslations('department');
  const { data: departmentsResponse, isLoading, error } = useSanityDepartmentsByCategory('HSD');

  const departmentCards = departmentsResponse?.data?.map((department) => ({
    title: department.name,
    description: department.description,
    src:
      department.images?.[0]?.url ||
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: tDept('card.ctaText'),
    ctaLink: `/department/${department.slug}`,
    content: () => {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-2">{tDept('card.responsible.title')}</h4>
            <p className="text-gray-700 dark:text-gray-300">{department.responsibleUserName}</p>
            {department.responsibleUserNotes && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">
                &ldquo;{department.responsibleUserNotes}&rdquo;
              </p>
            )}
          </div>

          {department.phone && (
            <div>
              <h4 className="font-semibold text-lg mb-2">{tDept('card.contact.title')}</h4>
              <p className="text-gray-700 dark:text-gray-300">📞 {department.phone}</p>
              {department.email && (
                <p className="text-gray-700 dark:text-gray-300">📧 {department.email}</p>
              )}
            </div>
          )}

          {department.assistants && department.assistants.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-2">{tDept('card.assistants.title')}</h4>
              <div className="space-y-2">
                {department.assistants.map((assistant, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-3">
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {assistant.name}
                    </p>
                    {assistant.phone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">📞 {assistant.phone}</p>
                    )}
                    {assistant.email && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">📧 {assistant.email}</p>
                    )}
                    {assistant.notes && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 italic">
                        &ldquo;{assistant.notes}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-lg mb-2">{tDept('card.description.title')}</h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {department.description}
            </p>
          </div>
        </div>
      );
    },
  })) || [];

  type PersonCard = {
    name: string;
    image?: string;
    email?: string;
    phone?: string;
    role: 'Sorumlu' | 'Yardımcı';
    departmentName: string;
    departmentSlug: string;
  };

  const people: PersonCard[] = (departmentsResponse?.data || []).flatMap((dept) => {
    const responsible: PersonCard[] = dept.responsibleUserName
      ? [{
          name: dept.responsibleUserName,
          image: dept.responsibleUserImage,
          email: dept.email,
          phone: dept.phone,
          role: 'Sorumlu',
          departmentName: dept.name,
          departmentSlug: dept.slug,
        }]
      : [];
    const assistants: PersonCard[] = (dept.assistants || []).map((a) => ({
      name: a.name,
      image: undefined,
      email: a.email,
      phone: a.phone,
      role: 'Yardımcı',
      departmentName: dept.name,
      departmentSlug: dept.slug,
    }));
    return [...responsible, ...assistants];
  });

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 h-full shadow-xl">
                  <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="mt-16">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
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

      {/* People Section - Biz Kimiz */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 via-indigo-50/15 to-gray-50 dark:from-gray-900 dark:via-indigo-900/15 dark:to-gray-900">
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="people-particles"
            background="transparent"
            minSize={0.4}
            maxSize={1.0}
            particleDensity={30}
            className="w-full h-full"
            particleColor="#6366f1"
            speed={0.3}
          />
        </div>
        {/* Soft top gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-50/70 via-transparent to-transparent dark:from-gray-900/70"></div>
        {/* Soft bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50/70 via-transparent to-transparent dark:from-gray-900/70"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {t('sections.people.title')}
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('sections.people.subtitle')}
            </p>
          </motion.div>
          
          {people.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {people.map((person, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/8 via-purple-500/4 to-indigo-500/8 rounded-3xl blur-xl group-hover:blur-2xl group-hover:from-indigo-500/20 group-hover:to-purple-500/20 transition-all duration-500"></div>
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 h-full shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    {/* Role Badge */}
                    <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      {person.role === 'Sorumlu' ? t('people.roles.responsible') : t('people.roles.assistant')}
                    </div>
                    
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-4">
                      <div className="relative">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-indigo-500 p-0.5">
                          <div className="h-full w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                            {person.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={person.image} alt={person.name} className="h-full w-full object-cover rounded-full" />
                            ) : (
                              <span className="text-xl font-bold text-gray-600 dark:text-gray-300">
                                {person.name.split(' ').map((s: string) => s[0]).slice(0,2).join('')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      
                      {/* Name and Department */}
                      <div className="text-center mt-4">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {person.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                          {person.departmentName}
                        </p>
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      {person.phone && (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-lg">📞</span>
                          <span className="text-gray-700 dark:text-gray-300">{person.phone}</span>
                        </div>
                      )}
                      {person.email && (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-lg">📧</span>
                          <span className="text-gray-700 dark:text-gray-300 truncate">{person.email}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Department Link */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <a 
                        href={`/department/${person.departmentSlug}`} 
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group-hover:underline"
                      >
                        <span>{t('people.departmentPageLink')}</span>
                        <span className="text-xs">→</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-3xl">👥</span>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400">{t('sections.people.empty')}</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}


