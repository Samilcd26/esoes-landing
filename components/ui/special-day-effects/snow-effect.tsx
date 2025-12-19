"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";

interface SnowEffectProps {
  className?: string;
  intensity?: "light" | "medium" | "heavy";
}

export function SnowEffect({ className, intensity = "medium" }: SnowEffectProps) {
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
    light: 50,
    medium: 100,
    heavy: 200,
  };

  const sizeConfig = {
    light: { min: 1, max: 3 },
    medium: { min: 2, max: 5 },
    heavy: { min: 3, max: 7 },
  };

  const speedConfig = {
    light: { min: 0.5, max: 1.5 },
    medium: { min: 1, max: 3 },
    heavy: { min: 1.5, max: 4 },
  };

  if (!init) {
    return null;
  }

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-50", className)}>
      <Particles
        id="snow-effect"
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
              value: "#ffffff",
            },
            move: {
              direction: "bottom",
              enable: true,
              outModes: {
                default: "out",
              },
              random: true,
              speed: speedConfig[intensity],
              straight: false,
              gravity: {
                enable: true,
                acceleration: 0.5,
                maxSpeed: 5,
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
                min: 0.3,
                max: 0.9,
              },
              animation: {
                enable: true,
                speed: 0.5,
                sync: false,
              },
            },
            shape: {
              type: "circle",
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
                  max: 2,
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
