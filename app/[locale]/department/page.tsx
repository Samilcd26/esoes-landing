"use client";

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import ExpandableCardGrid from "@/components/ui/expandable-card-grid";
import React from "react";

const testimonials = [
    {
        quote:
            "ESOES ailesiyle çalışmak bana liderlik ve takım ruhu kazandırdı. Her etkinlikte birlikte büyüyoruz.",
        name: "Mert Yıldız",
        designation: "Başkan",
        src: "/assets/images/testimonials/mert-yildiz.jpeg",
    },
    {
        quote:
            "Takımımızın enerjisi ve motivasyonu sayesinde her projede başarıya ulaşıyoruz.",
        name: "Elif Güçeren",
        designation: "Başkan Yardımcısı",
        src: "/assets/images/testimonials/elif-guceren.png",
    },
    {
        quote:
            "İletişim ve ilişkilerdeki gücümüz, kulübümüzü daha ileriye taşıyor.",
        name: "Türkan Nisa Arslan",
        designation: "İlişkiler",
        src: "/assets/images/testimonials/turkan-nisa-arslan.jpeg",
    },
    {
        quote:
            "Kaynaklarımızı en verimli şekilde kullanarak harika etkinlikler düzenliyoruz.",
        name: "Şeyda Demir",
        designation: "Kaynakları",
        src: "/assets/images/testimonials/seyda-demir.jpeg",
    },
    {
        quote:
            "Organizasyon ekibi olarak her ayrıntıyı düşünüyor ve mükemmel sonuçlar elde ediyoruz.",
        name: "Mert Yüksel",
        designation: "Organizasyon",
        src: "/assets/images/testimonials/mert-yuksel.jpeg",
    },
    {
        quote:
            "Yaratıcı fikirlerimizle kulübümüze yeni bir soluk getiriyoruz.",
        name: "Öykü Kayacan",
        designation: "Y.K.",
        src: "/assets/images/testimonials/oyku-kayacan.jpeg",
    },
    {
        quote:
            "Tanıtım ekibi olarak kulübümüzün sesini daha geniş kitlelere ulaştırıyoruz.",
        name: "Rumeysa Ünal",
        designation: "Tanıtım",
        src: "/assets/images/testimonials/rumeysa-unal.jpeg",
    },
];

const departmentCards = [
    {
        description: "Eğitim ve Organizasyon",
        title: "Eğitim ve Organizasyon",
        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ctaText: "Daha Fazla",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Eğitim ve Organizasyon Departmanı, mühendislik öğrencilerinin ihtiyacı olan 
                    hem sosyal hem de teknik eğitim programları düzenler. Ayrıca, HEBOCON, 
                    GameJam ve İmza etkinliğimiz olan SOF&apos;un organizasyonu ile ilgilenir. <br /> <br /> 
                    Departmanımız, öğrencilerin hem akademik hem de sosyal gelişimlerini destekleyerek 
                    kapsamlı eğitim fırsatları sunar. Teknik becerilerin yanı sıra liderlik, 
                    takım çalışması ve proje yönetimi konularında da eğitimler verilir.
                </p>
            );
        },
    },
    {
        description: "Kurumsal İlişkiler",
        title: "Kurumsal İlişkiler",
        src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ctaText: "Daha Fazla",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    EsTalks ve teknik geziler düzenleyerek öğrencilere mesleki ağ kazandırılması, 
                    daha donanımlı bireyler olmalarını amaçlar. Aynı zamanda büyük etkinliklere 
                    konuşmacı bulunması Kurumsal İlişkiler departmanının sorumluluğu altındadır. <br /> <br /> 
                    Departmanımız, sektör profesyonelleri ile öğrenciler arasında köprü görevi görür 
                    ve kariyer fırsatları yaratır. Şirket ziyaretleri, networking etkinlikleri ve 
                    mentörlük programları organize eder.
                </p>
            );
        },
    },
    {
        description: "Medya ve Tanıtım",
        title: "Medya ve Tanıtım",
        src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ctaText: "Daha Fazla",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Kulübün tüm medya hesaplarını yönetir ve bu mecraları etkili bir şekilde kullanır. 
                    Aynı zamanda sosyal medya PR&apos;ını üstlenir; paylaşılacak içeriklerin tasarımı 
                    ve editlenmesinden sorumludur. <br /> <br /> 
                    Departmanımız, kulübün görünürlüğünü artırarak marka değerini yükseltir. 
                    Grafik tasarım, video prodüksiyonu, sosyal medya yönetimi ve içerik 
                    stratejisi konularında uzmanlaşmış ekibimiz bulunur.
                </p>
            );
        },
    },
    {
        description: "Sponsorluk",
        title: "Sponsorluk",
        src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ctaText: "Daha Fazla",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Kulübün şirketler, esnaflar ve sponsor adayı olan tüm firmalarla bağlantı 
                    kurulmasını sağlar. Kulübün maddi ihtiyaçlarının neredeyse tamamını 
                    sponsorluk departmanı tarafından karşılanır. <br /> <br /> 
                    Departmanımız, sürdürülebilir finansal kaynak yaratarak kulübün 
                    büyümesini destekler. Sponsor ilişkileri yönetimi, proje finansmanı 
                    ve bütçe planlaması konularında aktif rol oynar.
                </p>
            );
        },
    },
    {
        description: "İnsan Kaynakları",
        title: "İnsan Kaynakları",
        src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ctaText: "Daha Fazla",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Sosyal etkinlik ve sosyal sorumluluk projeleri düzenleyerek kulübe 
                    üye katmaktan ve daha sosyal bir ortam sağlanmasından sorumludur. 
                    Ayrıca düzenlenmesi planlanan büyük etkinliklerin PR çalışmalarının 
                    bir bölümü İnsan kaynakları departmanının görevidir. <br /> <br /> 
                    Departmanımız, kulüp kültürünü güçlendirerek üye memnuniyetini artırır. 
                    Takım ruhu, motivasyon ve kişisel gelişim aktiviteleri organize eder.
                </p>
            );
        },
    },
];

export default function DepartmentPage() {
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
                    <ExpandableCardGrid cards={departmentCards} />
                </section>

                {/* Team Testimonials Section */}
                <section className="py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Ekibimizden
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Departman üyelerimizin deneyimleri ve görüşleri
                        </p>
                    </div>
                    <AnimatedTestimonials testimonials={testimonials} />
                </section>
            </div>
        </div>
    );
}