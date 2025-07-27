"use client";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { motion } from "framer-motion";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { useTranslations } from "next-intl";
import { SparklesCore } from "@/components/ui/sparkles";
  
// Section wrapper for fade-in animation
const SectionWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function Home() {
  const t = useTranslations("home");
  
  //  calendar events from Supabase




  // Data for Apple Cards Carousel
  const departmentCards = [
    {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: t("departments.education.title"),
      category: t("departments.education.category"),
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            {t("departments.education.description1")}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400">
            {t("departments.education.description2")}
          </p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: t("departments.corporate.title"),
      category: t("departments.corporate.category"),
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            {t("departments.corporate.description1")}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400">
            {t("departments.corporate.description2")}
          </p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: t("departments.media.title"),
      category: t("departments.media.category"),
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            {t("departments.media.description1")}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400">
            {t("departments.media.description2")}
          </p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: t("departments.sponsorship.title"),
      category: t("departments.sponsorship.category"),
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            {t("departments.sponsorship.description1")}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400">
            {t("departments.sponsorship.description2")}
          </p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: t("departments.hr.title"),
      category: t("departments.hr.category"),
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            {t("departments.hr.description1")}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400">
            {t("departments.hr.description2")}
          </p>
        </div>
      ),
    },
  ];

  // Sticky scroll content
  const stickyContent = [
    {
      title: t("about.club.title"),
      description: t("about.club.description"),
      content: t("about.club.content")
    },
    {
      title: t("about.vision.title"),
      description: t("about.vision.description"),
      content: t("about.vision.content")
    },
    {
      title: t("about.mission.title"),
      description: t("about.mission.description"),
      content: t("about.mission.content")
    }
  ];

  const testimonials = [
    {
      quote: t("testimonials.items.0.quote"),
      name: t("testimonials.items.0.name"),
      title: t("testimonials.items.0.title"),
    },
    {
      quote: t("testimonials.items.1.quote"),
      name: t("testimonials.items.1.name"),
      title: t("testimonials.items.1.title"),
    },
    {
      quote: t("testimonials.items.2.quote"),
      name: t("testimonials.items.2.name"),
      title: t("testimonials.items.2.title"),
    }
  ];



  return (
    <>
      {/* Hero Section with Background Effects */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Background Effects */}
        <BackgroundBeams className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-black/50" />
        
        {/* Background Image with Overlay */}
        <img
          src="/nova-04.jpeg"
          alt="ESOES Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          ESOES
        </h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
    </div>
          
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 max-w-4xl leading-relaxed">
            {t("hero.title.part1")}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              {" "}{t("hero.title.highlight")}{" "}
            </span>
            {t("hero.title.part2")}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl">
            {t("hero.subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <HoverBorderGradient
              onClick={() => {
                window.location.href = "/contact";
              }}
              containerClassName="rounded-full"
              className="bg-black text-white px-8 py-3 text-lg font-semibold cursor-pointer"
            >
              {t("hero.joinClub")}
            </HoverBorderGradient>
            
            <HoverBorderGradient
              onClick={() => {
                window.location.href = "/events";
              }}
              containerClassName="rounded-full"
              className="bg-transparent border border-white/20 text-white px-8 py-3 text-lg font-semibold hover:bg-white/10 cursor-pointer"
            >
              {t("hero.exploreEvents")}
            </HoverBorderGradient>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <SectionWrapper className="relative py-20 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-black/50" />
        <img
          src="/chroma-04.jpeg"
          alt="Features Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t("features.title.part1")}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                {" "}{t("features.title.highlight")}
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>
          
          <Carousel 
            items={departmentCards.map((card, index) => (
              <Card key={card.title} card={card} index={index} layout={true} />
            ))}
          />
        </div>
      </SectionWrapper>

      {/* About Section with Sticky Scroll */}
      <SectionWrapper className="relative bg-black">
        <StickyScroll content={stickyContent} />
      </SectionWrapper>

      {/* Testimonials Section */}
      <SectionWrapper className="relative py-20 bg-gradient-to-br from-purple-950/20 via-black to-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t("testimonials.title.part1")}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                {" "}{t("testimonials.title.highlight")}
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t("testimonials.subtitle")}
            </p>
          </div>
          
          <div className="flex justify-center">
            <InfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
            />
          </div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <section className="relative py-40 bg-black overflow-hidden ">
        <GoogleGeminiEffect />
        <div className="relative z-10 container mx-auto px-4 text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            {t("cta.title.part1")}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              {" "}{t("cta.title.highlight")}{" "}
            </span>
            {t("cta.title.part2")}
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {t("cta.subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            
            <HoverBorderGradient
              onClick={() => {
                window.location.href = "/c  ";
              }}
              containerClassName="rounded-full"
              className="bg-transparent border border-white/20 text-white px-12 py-4 text-xl font-semibold hover:bg-white/10 cursor-pointer"
            >
              {t("cta.applyNow")}
            </HoverBorderGradient>
          </div>
        </div>
      </section>
    </>
  );
}
