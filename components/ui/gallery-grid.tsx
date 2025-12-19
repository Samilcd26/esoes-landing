"use client";
import { useScroll, useTransform, MotionValue } from "motion/react";
import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/client";

interface GalleryMediaItem {
  _type: 'imageItem' | 'videoItem' | 'externalLink'
  _key: string
  // Image fields
  image?: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
  alt?: string
  caption?: string
  // Video fields
  video?: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
  poster?: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
  // External link fields
  url?: string
  platform?: string
  title?: string
  description?: string
  thumbnail?: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
}

interface GalleryGridProps {
  galleries: Array<{
    _id: string
    title: string
    description?: string
    category: string
    mediaItems: GalleryMediaItem[]
    tags?: string[]
    date?: string
  }>
  className?: string
}

export const GalleryGrid = ({ galleries, className }: GalleryGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{
    galleryId: string
    mediaIndex: number
    mediaItem: GalleryMediaItem
  } | null>(null);
  
  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Tüm media item'ları düzleştir
  const allMediaItems = galleries.flatMap(gallery => 
    gallery.mediaItems.map((mediaItem, index) => ({
      ...mediaItem,
      galleryId: gallery._id,
      galleryTitle: gallery.title,
      mediaIndex: index,
    }))
  );

  const third = Math.ceil(allMediaItems.length / 3);
  const firstPart = allMediaItems.slice(0, third);
  const secondPart = allMediaItems.slice(third, 2 * third);
  const thirdPart = allMediaItems.slice(2 * third);

  const heightClasses = [
    "h-60", "h-80", "h-96", "h-72", "h-64", "h-88",
  ];

  const handleItemClick = (item: typeof allMediaItems[0]) => {
    if (item._type === 'externalLink' && item.url) {
      // Harici link için yeni sekmede aç
      if (typeof window !== 'undefined') {
        window.open(item.url, '_blank');
      }
    } else {
      // Resim ve video için modal aç
      console.log('Opening modal for:', item);
      console.log('Image URL:', item._type === 'imageItem' && item.image ? urlFor(item.image).url() : 'Not an image');
      setSelectedItem({
        galleryId: item.galleryId,
        mediaIndex: item.mediaIndex,
        mediaItem: item,
      });
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    // Reset zoom when closing modal
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setLastPanPosition({ x: 0, y: 0 });
  };

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setLastPanPosition({ x: 0, y: 0 });
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  // Drag to pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLastPanPosition(panPosition);
    }
  }, [zoomLevel, panPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setPanPosition({
        x: lastPanPosition.x + deltaX,
        y: lastPanPosition.y + deltaY,
      });
    }
  }, [isDragging, dragStart, lastPanPosition, zoomLevel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setLastPanPosition(panPosition);
    }
  }, [zoomLevel, panPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;
      setPanPosition({
        x: lastPanPosition.x + deltaX,
        y: lastPanPosition.y + deltaY,
      });
    }
  }, [isDragging, dragStart, lastPanPosition, zoomLevel]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const renderMediaItem = (item: typeof allMediaItems[0], index: number, translateY: MotionValue<number>) => {
    const isImage = item._type === 'imageItem' && item.image;
    const isVideo = item._type === 'videoItem' && item.video;
    const isExternal = item._type === 'externalLink' && item.url;
    
    let imageUrl = '';
    let altText = '';
    let caption = '';

    if (isImage && item.image) {
      imageUrl = urlFor(item.image).url();
      altText = item.alt || item.caption || 'Gallery image';
      caption = item.caption || '';
    } else if (isVideo && item.poster) {
      imageUrl = urlFor(item.poster).url();
      altText = item.caption || 'Video thumbnail';
      caption = item.caption || '';
    } else if (isExternal) {
      // Harici linkler için thumbnail varsa kullan, yoksa platform'a göre fallback
      if (item.thumbnail) {
        imageUrl = urlFor(item.thumbnail).url();
      } else {
        // Platform'a göre fallback görsel
        const platformImages = {
          youtube: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop',
          vimeo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop',
          instagram: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop',
          twitter: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop',
          linkedin: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop',
          other: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop'
        };
        imageUrl = platformImages[item.platform as keyof typeof platformImages] || platformImages.other;
      }
      altText = item.title || item.description || 'External link';
      caption = item.title || '';
    }

    if (!imageUrl) return null;

    return (
      <motion.div
        style={{ y: translateY }}
        key={`${item.galleryId}-${item._key}`}
        onMouseEnter={() => setHovered(`${item.galleryId}-${item._key}`)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => handleItemClick(item)}
        className={cn(
          "rounded-lg relative overflow-hidden transition-all duration-300 ease-out cursor-pointer group",
          hovered !== null && hovered !== `${item.galleryId}-${item._key}` && "blur-sm scale-[0.98]"
        )}
      >
        <div className={`${heightClasses[index % heightClasses.length]} w-full relative`}>
          <Image
            src={imageUrl}
            fill
            className="object-cover object-center"
            alt={altText}
          />
          
          {/* Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
              hovered === `${item.galleryId}-${item._key}` ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
              {caption || item.galleryTitle}
            </div>
          </div>

          {/* Platform indicator */}
          {isExternal && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
              {item.platform || 'Link'}
            </div>
          )}

          {/* Video indicator */}
          {isVideo && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
              Video
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div className={cn("h-full items-start w-full", className)} ref={gridRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-7xl mx-auto gap-10 pb-24 px-10">
          <div className="grid gap-10">
            {firstPart.map((item, idx) => renderMediaItem(item, idx, translateFirst))}
          </div>
          <div className="grid gap-10">
            {secondPart.map((item, idx) => renderMediaItem(item, idx + third, translateSecond))}
          </div>
          <div className="grid gap-10">
            {thirdPart.map((item, idx) => renderMediaItem(item, idx + 2 * third, translateThird))}
          </div>
        </div>
      </div>

      {/* Modal for images and videos */}
      <AnimatePresence>
        {selectedItem && selectedItem.mediaItem._type !== 'externalLink' && (
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
              className="relative w-[95vw] h-[90vh] max-w-4xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ cursor: isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'default' }}
              >
                {selectedItem.mediaItem._type === 'imageItem' && selectedItem.mediaItem.image && (
                  <div 
                    className="relative flex items-center justify-center p-4 transition-transform duration-200 ease-out"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                      transformOrigin: 'center center'
                    }}
                  >
                    <Image
                      src={urlFor(selectedItem.mediaItem.image).url()}
                      alt={selectedItem.mediaItem.alt || selectedItem.mediaItem.caption || 'Gallery image'}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 95vw, (max-width: 1200px) 80vw, 1200px"
                      className="object-contain rounded-lg shadow-2xl w-auto h-auto max-w-[1200px] max-h-[600px] select-none"
                      draggable={false}
                    />
                  </div>
                )}
                
                {selectedItem.mediaItem._type === 'videoItem' && selectedItem.mediaItem.video && (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <video
                      controls
                      className="w-auto h-auto max-w-[1200px] max-h-[600px] rounded-lg shadow-2xl"
                      poster={selectedItem.mediaItem.poster ? urlFor(selectedItem.mediaItem.poster).url() : undefined}
                    >
                      <source src={urlFor(selectedItem.mediaItem.video).url()} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
              
              {/* Zoom Controls */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
                  title="Yakınlaştır"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
                  title="Uzaklaştır"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                  </svg>
                </button>
                <button
                  onClick={handleResetZoom}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
                  title="Zoom Sıfırla"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              {/* Zoom Level Indicator */}
              <div className="absolute top-4 left-20 bg-black/50 text-white px-3 py-2 rounded-lg backdrop-blur-sm text-sm font-medium">
                {Math.round(zoomLevel * 100)}%
              </div>
              
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Caption */}
              {selectedItem.mediaItem.caption && (
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm max-w-md">
                  {selectedItem.mediaItem.caption}
                </div>
              )}

              {/* Instructions */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm text-sm max-w-xs">
                <div className="text-xs text-gray-300">
                  <div>• Mouse tekerleği ile zoom</div>
                  <div>• Sürükleyerek hareket ettir</div>
                  <div>• Butonlarla kontrol et</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
