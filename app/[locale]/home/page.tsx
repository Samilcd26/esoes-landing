"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
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
          


          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <HoverBorderGradient
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSeDHO9m0yJvLWpvzZgwek2tfovrCagfI58MqffHhrixxekyTw/viewform";
                }
              }}
              containerClassName="rounded-full"
              className="bg-black text-white px-8 py-3 text-lg font-semibold cursor-pointer"
            >
              {t("hero.joinClub")}
            </HoverBorderGradient>

          
          </div>
        </div>

    
      </section>


    </>
  );
}
