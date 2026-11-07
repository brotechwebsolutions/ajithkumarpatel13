"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ProfileHoverCard from "@/components/ui/profile-hover-card";
import { profile, projects } from "@/lib/data";

type Project = (typeof projects)[number];
type ProjectShot = Project["shots"][number];

interface TunnelCardData {
  project: Project;
  image: ProjectShot | undefined;
  angleCos: number;
  angleSin: number;
  index: number;
}

interface StageDimensions {
  width: number;
  height: number;
  isMobile: boolean;
}

const TUNNEL_CARDS: TunnelCardData[] = projects.map((project, index) => {
  const angle = index * 137.5 * (Math.PI / 180);

  return {
    project,
    image: project.shots.length ? project.shots[0] : undefined,
    angleCos: Math.cos(angle),
    angleSin: Math.sin(angle),
    index,
  };
});

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

interface TunnelCardProps {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
  onFocus: () => void;
}

function TunnelCard({
  card,
  progress,
  pointer,
  total,
  stage,
  onFocus,
}: TunnelCardProps) {
  const staggerSpan = 0.72;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;
  const localProgress = useTransform(progress, [start, end], [0, 1]);
  const z = useTransform(localProgress, [0, 1], [-1250, stage.isMobile ? 120 : 180]);
  const opacity = useTransform(localProgress, [0, 0.14, 0.8, 1], [0, 1, 1, 0]);
  const cardWidth = stage.isMobile
    ? Math.max(210, Math.min(270, stage.width * 0.67))
    : Math.max(270, Math.min(340, stage.width * 0.26));

  const baseX = stage.width * (stage.isMobile ? 0 : 0.25 + card.angleCos * 0.12);
  const baseY =
    card.angleSin * stage.height * 0.2 + (stage.isMobile ? stage.height * 0.12 : 0);
  const panStrength = stage.isMobile ? 10 : 24;

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currentZ, pointerX, pointerY]: number[]) => {
      const offsetX = baseX - pointerX * panStrength;
      const offsetY = baseY - pointerY * panStrength;
      const rotation = (card.index % 2 === 0 ? 1 : -1) * (2 + card.index);
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currentZ}px) rotateZ(${rotation}deg)`;
    },
  );

  return (
    <motion.a
      href={card.project.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${card.project.title} on GitHub`}
      onFocus={onFocus}
      style={{ width: cardWidth, transform, opacity, zIndex: card.index + 1 }}
      className="tunnel-card"
    >
      {card.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="tunnel-card-image"
          src={card.image.src}
          alt=""
          draggable={false}
        />
      ) : (
        <div className="tunnel-card-art" aria-hidden="true">
          <span className="tunnel-card-monogram">KM</span>
          <span className="tunnel-card-art-label">Agricultural marketplace</span>
        </div>
      )}
      <div className="tunnel-card-copy">
        <h2>{card.project.title}</h2>
        <p>{card.project.blurb}</p>
        <span className="tunnel-card-link">View project on GitHub ↗</span>
      </div>
    </motion.a>
  );
}

export default function PerspectiveTunnelHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousTouchY = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<StageDimensions>({
    width: 1440,
    height: 900,
    isMobile: false,
  });
  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setStage({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateProgress = (delta: number, event: Event) => {
      const current = rawProgress.get();
      const next = Math.min(1, Math.max(0, current + delta));

      if (next === current) return;
      event.preventDefault();
      rawProgress.set(next);
    };

    const handleWheel = (event: WheelEvent) => {
      updateProgress(event.deltaY * 0.0008, event);
    };

    const handleTouchStart = (event: TouchEvent) => {
      previousTouchY.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touchY = event.touches[0]?.clientY;
      const previousY = previousTouchY.current;
      if (touchY === undefined || previousY === null) return;

      previousTouchY.current = touchY;
      updateProgress((previousY - touchY) * 0.002, event);
    };

    const resetTouch = () => {
      previousTouchY.current = null;
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", resetTouch);
    element.addEventListener("touchcancel", resetTouch);

    return () => {
      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", resetTouch);
      element.removeEventListener("touchcancel", resetTouch);
    };
  }, [rawProgress]);

  const pointer = useCameraParallax(!reduceMotion && !stage.isMobile);
  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.035, 1]);
  const promptOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const deltas: Record<string, number> = {
      ArrowDown: 0.12,
      PageDown: 0.2,
      " ": 0.2,
      ArrowUp: -0.12,
      PageUp: -0.2,
    };
    const delta = deltas[event.key];
    if (delta === undefined) return;

    const current = rawProgress.get();
    const next = Math.min(1, Math.max(0, current + delta));
    if (next === current) return;

    event.preventDefault();
    rawProgress.set(next);
  };

  return (
    <div
      ref={containerRef}
      className="tunnel-hero"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Portfolio introduction and selected projects. Scroll to move through the project tunnel."
      style={{
        perspective: stage.isMobile ? "900px" : "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      <div className="tunnel-grid" aria-hidden="true" />
      <div className="tunnel-glow" aria-hidden="true" />
      <div className="tunnel-ring tunnel-ring-inner" aria-hidden="true" />
      <div className="tunnel-ring tunnel-ring-outer" aria-hidden="true" />

      <div className="tunnel-layout">
        <motion.div
          style={{ scale: titleScale }}
          className="tunnel-intro"
        >
          <div className="tunnel-brand">
            <p className="tunnel-eyebrow">{profile.name}</p>
            <p className="tunnel-label">Selected work</p>
          </div>
          <h1>{profile.title}</h1>
          <p className="tunnel-description">{profile.bio}</p>
          <p className="tunnel-location">{profile.location}</p>
          <div className="tunnel-actions">
            <a href="#work">Explore projects <span aria-hidden="true">↓</span></a>
            {profile.resume && (
              <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                Resume <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </motion.div>
        <ProfileHoverCard
          className="tunnel-profile-card"
          projectProgress={smoothProgress}
        />
      </div>

      <motion.p
        style={{ opacity: promptOpacity }}
        className="tunnel-prompt"
        aria-hidden="true"
      >
        Scroll or swipe to explore
      </motion.p>

      <div className="tunnel-cards" style={{ transformStyle: "preserve-3d" }}>
        {TUNNEL_CARDS.map((card) => (
          <TunnelCard
            key={card.project.title}
            card={card}
            progress={smoothProgress}
            pointer={pointer}
            total={TUNNEL_CARDS.length}
            stage={stage}
            onFocus={() => rawProgress.set(0.52)}
          />
        ))}
      </div>
    </div>
  );
}
