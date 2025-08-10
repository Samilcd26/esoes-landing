"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { useTranslations } from "next-intl";
import Image from "next/image";



export default function Home() {
  const t = useTranslations("home");

  //  calendar events from Supabase







  return (
    <>
      {/* Hero Section with Background Effects */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Background Effects */}
        <BackgroundBeams className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-black/50" />

        {/* Background Image with Overlay */}
        <Image
          src="/assets/images/backgrounds/nova-04.jpeg"
          alt="ESOES Background"
          fill
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            ESOES
          </h1>
          <div className="w-full max-w-[40rem] h-32 sm:h-36 md:h-40 relative">
            {/* Gradients */}
            <div className="absolute left-5 right-5 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute left-5 right-5 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute left-20 right-20 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute left-20 right-20 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
            <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 bg-opacity-70 mt-4">
              Engineering Society of Eskişehir
            </p>
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
                if (typeof window !== 'undefined') {
                  window.location.href = "/contact";
                }
              }}
              containerClassName="rounded-full"
              className="bg-black text-white px-8 py-3 text-lg font-semibold cursor-pointer"
            >
              {t("hero.joinClub")}
            </HoverBorderGradient>

            <HoverBorderGradient
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = "/events";
                }
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

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">

            <HoverBorderGradient
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSeDHO9m0yJvLWpvzZgwek2tfovrCagfI58MqffHhrixxekyTw/viewform?usp=dialog";
                }
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
