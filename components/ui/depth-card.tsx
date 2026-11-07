"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DepthCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  label?: string;
}

export default function DepthCard({
  children,
  className,
  delay = 0,
  label,
}: DepthCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 160, damping: 22 });
  const rotateY = useSpring(rawRotateY, { stiffness: 160, damping: 22 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    rawRotateY.set((x - 0.5) * 4);
    rawRotateX.set((0.5 - y) * 4);
  };

  const resetTilt = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      role={label ? "article" : undefined}
      aria-label={label}
      className={cn("depth-card", className)}
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 22, z: -48, rotateX: 2, scale: 0.985 }
      }
      whileInView={
        reduceMotion ? undefined : { opacity: 1, y: 0, z: 0, rotateX: 0, scale: 1 }
      }
      viewport={{ once: false, amount: 0.14 }}
      transition={{
        duration: reduceMotion ? 0 : 0.52,
        delay: reduceMotion ? 0 : delay,
        ease: [0.2, 0.72, 0.24, 1],
      }}
      whileHover={reduceMotion ? undefined : { y: -3, scale: 1.008 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
    >
      {children}
    </motion.div>
  );
}
