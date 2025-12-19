"use client";

import ExpandableCardGrid from "@/components/ui/expandable-card-grid";
import { useSanityDepartmentsByCategory } from "@/hooks/useSanityDepartments";
import { useUsersByCategory } from "@/hooks/useSanityUsers";
import React from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import UserCard from "@/components/ui/user-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DepartmentPage() {
    const { data: departmentsResponse, isLoading, error } = useSanityDepartmentsByCategory('GENERAL');
    
    // General Management kategorisindeki kullanıcıları getir
    const { data: generalManagementUsers, isLoading: generalManagementUsersLoading } = useUsersByCategory('GENERAL_MANAGEMENT');

    
    
    // Department verilerini ExpandableCardGrid formatına çevir
    const departmentCards = departmentsResponse?.data?.map((department) => ({
        title: department.name,
        description: department.description,
        src: department.images?.[0]?.url || "/assets/images/backgrounds/nova-04.jpeg",
        ctaText: "Detayları Gör",
        ctaLink: `/department/${department.slug}`,
        content: () => {
            return (
                <div className="space-y-6">
                    {/* Responsible Users Section */}
                    {department.responsible && department.responsible.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                Sorumlular
                            </h4>
                            <div className="space-y-3">
                                {/* Department Responsible Users */}
                                {department.responsible.map((person, index) => (
                                    <div key={`dept-${index}`} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border-l-4 border-blue-500">
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
                                Asistanlar
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
                                                            <span className="text-purple-500">📞</span>
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

    if (isLoading || generalManagementUsersLoading) {
        return (
            <LoadingSpinner 
            title="Yükleniyor..."
            subtitle="Departmanlar getiriliyor"
            className="min-h-[60vh]"
          />
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Hata Oluştu</h2>
                    <p className="text-gray-600 dark:text-gray-400">Departmanlar yüklenirken bir hata oluştu.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="w-full !scroll-smooth">
                {/* General Management Section */}
                {generalManagementUsers && generalManagementUsers.length > 0 && (
                    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    Genel Yönetim
                                </h2>
                              
                            </div>
                            <div className="flex justify-center">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
                                    {generalManagementUsers
                                        .sort((a, b) => {
                                            // Order alanına göre sırala (null/undefined değerler en sona)
                                            const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
                                            const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
                                            return orderA - orderB;
                                        })
                                        .map((user, index) => (
                                        <UserCard
                                            key={`general-${user._id}`}
                                            user={{
                                                firstName: user.firstName,
                                                lastName: user.lastName,
                                                title: user.title,
                                                email: user.email,
                                                image: user.profileImage ? urlFor(user.profileImage).width(208).height(208).url() : undefined,
                                                role: 'responsible'
                                            }}
                                            variant="default"
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Department Cards Section */}
                <section className="py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Departmanlar</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">ESOES'in farklı departmanlarını keşfedin</p>
                    </div>
                    {departmentCards.length > 0 ? (
                        <ExpandableCardGrid cards={departmentCards} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400">Henüz departman bulunamadı</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}