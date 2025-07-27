"use client";
import { useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";

export const ParallaxScroll = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    // Remove container reference to use viewport scroll
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  // Different height classes for variety
  const heightClasses = [
    "h-60", // 240px
    "h-80", // 320px
    "h-96", // 384px
    "h-72", // 288px
    "h-64", // 256px
    "h-88", // 352px
  ];

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const getImageIndex = (column: number, idx: number) => {
    return column === 1 ? idx : column === 2 ? idx + third : idx + 2 * third;
  };

  return (
    <>
      <div
        className={cn("h-full items-start w-full", className)}
        ref={gridRef}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-7xl mx-auto gap-10 py-40 px-10"
          ref={gridRef}
        >
          <div className="grid gap-10">
            {firstPart.map((el, idx) => (
              <motion.div
                style={{ y: translateFirst }} // Apply the translateY motion value here
                key={"grid-1" + idx}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleImageClick(idx)}
                className={cn(
                  "rounded-lg relative overflow-hidden transition-all duration-300 ease-out cursor-pointer",
                  hovered !== null && hovered !== idx && "blur-sm scale-[0.98]"
                )}
              >
                <img
                  src={el}
                  className={`${heightClasses[idx % heightClasses.length]} w-full object-cover object-left-top !m-0 !p-0`}
                  height="400"
                  width="400"
                  alt="thumbnail"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
                    hovered === idx ? "opacity-100" : "opacity-0"
                  )}
                >
                  <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                    Image {idx + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-10">
            {secondPart.map((el, idx) => (
              <motion.div 
                style={{ y: translateSecond }} 
                key={"grid-2" + idx}
                onMouseEnter={() => setHovered(idx + third)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleImageClick(idx + third)}
                className={cn(
                  "rounded-lg relative overflow-hidden transition-all duration-300 ease-out cursor-pointer",
                  hovered !== null && hovered !== (idx + third) && "blur-sm scale-[0.98]"
                )}
              >
                <img
                  src={el}
                  className={`${heightClasses[(idx + 2) % heightClasses.length]} w-full object-cover object-left-top !m-0 !p-0`}
                  height="400"
                  width="400"
                  alt="thumbnail"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
                    hovered === (idx + third) ? "opacity-100" : "opacity-0"
                  )}
                >
                  <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                    Image {idx + third + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-10">
            {thirdPart.map((el, idx) => (
              <motion.div 
                style={{ y: translateThird }} 
                key={"grid-3" + idx}
                onMouseEnter={() => setHovered(idx + 2 * third)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleImageClick(idx + 2 * third)}
                className={cn(
                  "rounded-lg relative overflow-hidden transition-all duration-300 ease-out cursor-pointer",
                  hovered !== null && hovered !== (idx + 2 * third) && "blur-sm scale-[0.98]"
                )}
              >
                <img
                  src={el}
                  className={`${heightClasses[(idx + 4) % heightClasses.length]} w-full object-cover object-left-top !m-0 !p-0`}
                  height="400"
                  width="400"
                  alt="thumbnail"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
                    hovered === (idx + 2 * third) ? "opacity-100" : "opacity-0"
                  )}
                >
                  <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                    Image {idx + 2 * third + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-7xl max-h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImage]}
                alt={`Image ${selectedImage + 1}`}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
              
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                {selectedImage + 1} / {images.length}
              </div>

              {/* Navigation arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
