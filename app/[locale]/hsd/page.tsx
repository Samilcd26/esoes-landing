"use client";

import { LoaderOne } from "@/components/ui/loader";
import { useSanityDepartmentsByCategory } from "@/hooks/useSanityDepartments";
import React from "react";
import { useTranslations } from "next-intl";
import { 
  HsdHeader, 
  UsersSection, 
  MissionSection, 
  DepartmentsSection 
} from "./components";

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
                            <img 
                              src={person.image} 
                              alt={`${person.firstName} ${person.lastName}`}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span>
                              {person.firstName?.[0]}{person.lastName?.[0]}
                            </span>
                          )}
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
                            <img 
                              src={person.image} 
                              alt={`${person.firstName} ${person.lastName}`}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span>
                              {person.firstName?.[0]}{person.lastName?.[0]}
                            </span>
                          )}
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
        </div>
      );
    },
  })) || [];

  // Group users by department
  const groupedUsers = departmentsResponse?.data?.reduce((acc, department) => {
    const users: Array<{
      firstName?: string;
      lastName?: string;
      title?: string;
      phone?: string;
      email?: string;
      image?: string;
      role: string;
    }> = [];
    
    // Add responsible users
    if (department.responsible) {
      users.push(...department.responsible.map((person) => ({
        ...person,
        role: 'responsible'
      })));
    }
    
    // Add assistant users
    if (department.assistant) {
      users.push(...department.assistant.map((person) => ({
        ...person,
        role: 'assistant'
      })));
    }
    
    if (users.length > 0) {
      acc.push({
        departmentName: department.name,
        users: users
      });
    }
    
    return acc;
  }, [] as Array<{ 
    departmentName: string; 
    users: Array<{
      firstName?: string;
      lastName?: string;
      title?: string;
      phone?: string;
      email?: string;
      image?: string;
      role: string;
    }>;
  }>) || [];

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
      {/* Header Section */}
      <HsdHeader 
        title={t('header.title')}
        description={t('header.description1')}
      />

      {/* Users Section */}
      <UsersSection 
        groupedUsers={groupedUsers}
        title={t('sections.users.title') || 'HSD Ekibi'}
        subtitle={t('sections.users.subtitle') || 'HSD kategorisinde görev alan tüm ekip üyeleri'}
      />

      {/* Mission Section */}
      <MissionSection 
        title={t('mission.title')}
        missions={[
          t('mission.p1'),
          t('mission.p2'),
          t('mission.p3')
        ]}
      />

      {/* Departments Section */}
      <DepartmentsSection 
        title={t('sections.departments.title')}
        subtitle={t('sections.departments.subtitle')}
        departmentCards={departmentCards}
        emptyMessage={tDept('empty')}
      />
    </div>
  );
}


