"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";

interface ConfettiEffectProps {
  className?: string;
  colors?: string[];
  intensity?: "light" | "medium" | "heavy";
}

export function ConfettiEffect({
  className,
  colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
  intensity = "medium",
}: ConfettiEffectProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      // Particle engine hazır
    }
  };

  // Yoğunluk ayarları
  const densityConfig = {
    light: 30,
    medium: 60,
    heavy: 100,
  };

  const sizeConfig = {
    light: { min: 3, max: 6 },
    medium: { min: 4, max: 8 },
    heavy: { min: 5, max: 10 },
  };

  if (!init) {
    return null;
  }

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-50", className)}>
      <Particles
        id="confetti-effect"
        className="h-full w-full"
        particlesLoaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fullScreen: {
            enable: false,
            zIndex: 50,
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: false,
              },
              onHover: {
                enable: false,
              },
              resize: {
                enable: true,
              },
            },
          },
          particles: {
            color: {
              value: colors,
            },
            move: {
              direction: "bottom",
              enable: true,
              outModes: {
                default: "out",
              },
              random: true,
              speed: {
                min: 1,
                max: 3,
              },
              straight: false,
              gravity: {
                enable: true,
                acceleration: 0.8,
                maxSpeed: 8,
              },
            },
            number: {
              density: {
                enable: true,
                width: 1920,
                height: 1080,
              },
              value: densityConfig[intensity],
            },
            opacity: {
              value: {
                min: 0.5,
                max: 1,
              },
              animation: {
                enable: true,
                speed: 0.5,
                sync: false,
              },
            },
            shape: {
              type: ["circle", "square"],
            },
            size: {
              value: sizeConfig[intensity],
              animation: {
                enable: true,
                speed: 1,
                sync: false,
              },
            },
            rotate: {
              animation: {
                enable: true,
                speed: {
                  min: 0,
                  max: 5,
                },
                sync: false,
              },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
