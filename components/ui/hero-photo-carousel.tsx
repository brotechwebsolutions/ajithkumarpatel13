"use client";

import Image from "next/image";
import {
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  PointerEvent,
  ReactNode,
  TouchEvent,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface HeroPhotoCarouselProps {
  images: string[];
  alt: string;
  children?: ReactNode;
  className?: string;
  projectProgress?: MotionValue<number>;
}

const MAX_REAR_CARDS = 3;

export default function HeroPhotoCarousel({
  images,
  alt,
  children,
  className,
  projectProgress,
}: HeroPhotoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageCount = images.length;
  const finalImageSelected = useRef(false);
  const cardRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const fallbackProgress = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(rawRotateY, { stiffness: 180, damping: 22 });
  const opacity = useTransform(
    projectProgress ?? fallbackProgress,
    [0, 0.2, 0.45, 0.92, 1],
    [1, 0.92, 0, 0, 1],
  );
  const rearCardCount = Math.min(MAX_REAR_CARDS, Math.max(0, imageCount - 1));

  useMotionValueEvent(projectProgress ?? fallbackProgress, "change", (progress) => {
    if (imageCount > 2 && progress >= 0.999 && !finalImageSelected.current) {
      finalImageSelected.current = true;
      setActiveIndex(2);
    } else if (progress < 0.95) {
      finalImageSelected.current = false;
    }
  });

  const selectImage = (index: number) => {
    setActiveIndex((index + imageCount) % imageCount);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    rawRotateY.set((x - 0.5) * 7);
    rawRotateX.set((0.5 - y) * 7);
  };

  const resetTilt = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX === null || endX === undefined || Math.abs(endX - startX) < 48) return;
    selectImage(activeIndex + (endX < startX ? 1 : -1));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectImage(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectImage(activeIndex - 1);
    }
  };

  if (!imageCount) return null;

  return (
    <motion.article
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        opacity: projectProgress ? opacity : 1,
        transformPerspective: 1100,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      className={cn("profile-hover-card hero-photo-carousel", className)}
      aria-label={`${alt} photo carousel`}
      aria-roledescription="carousel"
    >
      <div className="hero-photo-stack">
        {Array.from({ length: rearCardCount + 1 }, (_, depth) => {
          const imageIndex = (activeIndex + depth) % imageCount;
          const isActive = depth === 0;

          return (
            <motion.div
              key={images[imageIndex]}
              className={`hero-photo-slide${isActive ? " is-active" : " is-rear"}`}
              initial={false}
              animate={
                isActive
                  ? { x: 0, y: 0, z: 0, rotateZ: 0, scale: 1, opacity: 1 }
                  : {
                      x: depth * 15,
                      y: depth * 9,
                      z: -depth * 34,
                      rotateZ: depth * -2.2,
                      scale: 1 - depth * 0.045,
                      opacity: 1 - depth * 0.12,
                    }
              }
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                ease: [0.2, 0.75, 0.25, 1],
              }}
              style={{ zIndex: rearCardCount + 1 - depth }}
              aria-hidden={!isActive}
            >
              <motion.div
                className="hero-photo-image-wrap"
                whileHover={isActive && !reduceMotion ? { scale: 1.035 } : undefined}
                transition={{ duration: 0.55, ease: [0.2, 0.65, 0.3, 1] }}
              >
                <Image
                  src={images[imageIndex]}
                  alt={isActive ? alt : ""}
                  fill
                  priority={imageIndex === 0}
                  sizes="(max-width: 700px) 76vw, (max-width: 1100px) 34vw, 390px"
                  quality={88}
                  className="profile-hover-image"
                  style={{ objectPosition: "53% 42%" }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="profile-hover-shade" aria-hidden="true" />
      <div className="profile-hover-border" aria-hidden="true" />

      {imageCount > 1 && (
        <div className="hero-photo-controls" aria-label="Photo carousel controls">
          <button
            type="button"
            className="hero-photo-arrow"
            onClick={() => selectImage(activeIndex - 1)}
            aria-label="Previous photo"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <div className="hero-photo-indicators" role="group" aria-label="Choose a photo">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`hero-photo-indicator${index === activeIndex ? " is-active" : ""}`}
                onClick={() => selectImage(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-pressed={index === activeIndex}
              >
                <Image
                  src={image}
                  alt=""
                  width={36}
                  height={44}
                  sizes="36px"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="hero-photo-arrow"
            onClick={() => selectImage(activeIndex + 1)}
            aria-label="Next photo"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      )}

      <div className="profile-hover-content">{children}</div>
    </motion.article>
  );
}
