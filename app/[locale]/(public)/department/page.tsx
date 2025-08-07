import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import ExpandableCardGrid from "@/components/ui/expandable-card-grid";

const testimonials = [
    {
        quote:
            "ESOES ailesiyle çalışmak bana liderlik ve takım ruhu kazandırdı. Her etkinlikte birlikte büyüyoruz.",
        name: "Mert Yıldız",
        designation: "Başkan",
        src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        quote:
            "Takımımızın enerjisi ve motivasyonu sayesinde her projede başarıya ulaşıyoruz.",
        name: "Elif Güçeren",
        designation: "Başkan Yardımcısı",
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        quote:
            "İletişim ve ilişkilerdeki gücümüz, kulübümüzü daha ileriye taşıyor.",
        name: "Nisa Arıkan",
        designation: "İlişkiler",
        src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        quote:
            "Kaynaklarımızı en verimli şekilde kullanarak harika etkinlikler düzenliyoruz.",
        name: "Şeyda Demir",
        designation: "Kaynakları",
        src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        quote:
            "Organizasyon ekibi olarak her ayrıntıyı düşünüyor ve mükemmel sonuçlar elde ediyoruz.",
        name: "Mert Gürkale",
        designation: "Organizasyon",
        src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
        quote:
            "Yaratıcı fikirlerimizle kulübümüze yeni bir soluk getiriyoruz.",
        name: "Öykü Kayagün",
        designation: "Y.K.",
        src: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
        quote:
            "Tanıtım ekibi olarak kulübümüzün sesini daha geniş kitlelere ulaştırıyoruz.",
        name: "Rumeysa Ünverdi",
        designation: "Tanıtım",
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
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
                    <ExpandableCardGrid />
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