"use client";

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import ExpandableCardGrid from "@/components/ui/expandable-card-grid";
import { useSanityDepartments } from "@/hooks/useSanityDepartments";
import { LoaderOne } from "@/components/ui/loader";
import React from "react";

export default function DepartmentPage() {
    const { data: departmentsResponse, isLoading, error } = useSanityDepartments();

    // Department verilerini ExpandableCardGrid formatına çevir
    const departmentCards = departmentsResponse?.data?.map((department) => ({
        title: department.name,
        description: department.description,
        src: department.images?.[0]?.url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ctaText: "Daha Fazla",
        ctaLink: `/department/${department.slug}`,
        content: () => {
            return (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-lg mb-2">Sorumlu Kişi</h4>
                        <p className="text-gray-700 dark:text-gray-300">{department.responsibleUserName}</p>
                        {department.responsibleUserNotes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">
                                &ldquo;{department.responsibleUserNotes}&rdquo;
                            </p>
                        )}
                    </div>
                    
                    {department.phone && (
                        <div>
                            <h4 className="font-semibold text-lg mb-2">İletişim</h4>
                            <p className="text-gray-700 dark:text-gray-300">📞 {department.phone}</p>
                            {department.email && (
                                <p className="text-gray-700 dark:text-gray-300">📧 {department.email}</p>
                            )}
                        </div>
                    )}
                    
                    {department.assistants && department.assistants.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Yardımcılar</h4>
                            <div className="space-y-2">
                                {department.assistants.map((assistant, index) => (
                                    <div key={index} className="border-l-2 border-blue-500 pl-3">
                                        <p className="font-medium text-gray-700 dark:text-gray-300">
                                            {assistant.name}
                                        </p>
                                        {assistant.phone && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                📞 {assistant.phone}
                                            </p>
                                        )}
                                        {assistant.email && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                📧 {assistant.email}
                                            </p>
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
                        <h4 className="font-semibold text-lg mb-2">Açıklama</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {department.description}
                        </p>
                    </div>
                </div>
            );
        },
    })) || [];

    // Responsible user'lardan testimonials oluştur
    const testimonials = departmentsResponse?.data
        ?.filter(dept => dept.responsibleUserName && dept.responsibleUserNotes)
        ?.map((dept) => ({
            quote: dept.responsibleUserNotes!,
            name: dept.responsibleUserName,
            designation: dept.name,
            src: dept.responsibleUserImage || "/assets/images/testimonials/default-avatar.png",
        }))
        ?.slice(0, 7) || []; // Maksimum 7 testimonial göster

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <LoaderOne />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                        Departmanlar Yükleniyor
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        ESOES departmanları hakkında bilgi alınıyor...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Hata Oluştu
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Departmanlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="w-full !scroll-smooth">
                {/* Department Cards Section */}
                <section className="py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Departmanlarımız
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            ESOES&apos;in farklı departmanları ve sorumluluk alanları hakkında detaylı bilgi edinin.
                        </p>
                    </div>
                    {departmentCards.length > 0 ? (
                        <ExpandableCardGrid cards={departmentCards} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400">
                                Henüz departman bilgisi bulunmuyor.
                            </p>
                        </div>
                    )}
                </section>

                {/* Team Testimonials Section */}
                {testimonials.length > 0 && (
                    <section className="py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Sorumlularımızdan
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Departman sorumlularımızın deneyimleri ve görüşleri
                            </p>
                        </div>
                        <AnimatedTestimonials testimonials={testimonials} />
                    </section>
                )}
            </div>
        </div>
    );
}