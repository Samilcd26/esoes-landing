"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Deterministik renk üretici fonksiyon
const generateColorPalette = (count: number) => {
  const colors = [];
  const hueStep = 360 / count; // Renk tekerleğini eşit parçalara böl
  
  for (let i = 0; i < count; i++) {
    const hue = (i * hueStep) % 360;
    // Sabit saturasyon ve lightness değerleri ile tutarlı renkler
    const saturation1 = 70; // İlk renk için saturasyon
    const lightness1 = 25;  // İlk renk için parlaklık
    const saturation2 = 60; // İkinci renk için saturasyon  
    const lightness2 = 45;  // İkinci renk için parlaklık
    
    const color1 = `hsl(${hue}, ${saturation1}%, ${lightness1}%)`;
    const color2 = `hsl(${(hue + 30) % 360}, ${saturation2}%, ${lightness2}%)`;
    
    colors.push(`linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`);
  }
  
  return colors;
};

export const StickyScroll = ({
  content,
  contentClassName,
  fullscreen = false,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
  fullscreen?: boolean;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    // For fullscreen mode, use the entire page scroll instead of container scroll
    target: fullscreen ? ref : undefined,
    container: fullscreen ? undefined : ref,
    offset: fullscreen ? ["start start", "end end"] : ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  // Content sayısına göre otomatik renk paleti oluştur
  const backgroundColors = generateColorPalette(content.length);
  const linearGradients = generateColorPalette(content.length);

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
    
    // For fullscreen mode, apply background to document body
    if (fullscreen) {
      document.body.style.background = backgroundColors[activeCard % backgroundColors.length];
      document.body.style.transition = "background 0.8s ease";
    }
  }, [activeCard, fullscreen, backgroundColors, linearGradients]);

  // Cleanup effect for fullscreen mode
  useEffect(() => {
    if (fullscreen) {
      const originalBackground = document.body.style.background;
      const originalOverflow = document.body.style.overflow;
      
      // Prevent horizontal scrolling
      document.body.style.overflowX = "hidden";
      
      return () => {
        document.body.style.background = originalBackground;
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [fullscreen]);

  if (fullscreen) {
    return (
      <div
        ref={ref}
        className="w-full"
        style={{ height: `${content.length * 100}vh` }}
      >
        <div className="relative w-full">
          {content.map((item, index) => (
            <div 
              key={item.title + index} 
              className="flex min-h-screen w-full items-center justify-center px-4 py-10"
              style={{ 
                position: 'relative',
                height: '100vh'
              }}
            >
              <div className="flex w-full max-w-7xl items-center justify-between space-x-10">
                <div className="flex-1 max-w-2xl">
                  <motion.h2
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: activeCard === index ? 1 : 0.3,
                    }}
                    className="text-4xl font-bold text-slate-100 mb-6"
                  >
                    {item.title}
                  </motion.h2>
                  <motion.p
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: activeCard === index ? 1 : 0.3,
                    }}
                    className="text-xl text-slate-300 leading-relaxed"
                  >
                    {item.description}
                  </motion.p>
                </div>
                
                <div
                  style={{ background: backgroundGradient }}
                  className={cn(
                    "hidden lg:block h-80 w-96 rounded-md overflow-hidden",
                    contentClassName,
                  )}
                >
                  {content[activeCard].content ?? null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="relative flex h-[30rem] justify-center space-x-10 overflow-y-auto rounded-md p-10"
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-kg mt-10 max-w-sm text-slate-300"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-10 hidden h-60 w-80 overflow-hidden rounded-md bg-white lg:block",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};
