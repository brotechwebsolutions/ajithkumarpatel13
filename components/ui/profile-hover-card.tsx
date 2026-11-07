
"use client";

import { MotionValue } from "framer-motion";
import HeroPhotoCarousel from "@/components/ui/hero-photo-carousel";
import { profile } from "@/lib/data";

interface ProfileHoverCardProps {
  className?: string;
  projectProgress?: MotionValue<number>;
}

export default function ProfileHoverCard({
  className,
  projectProgress,
}: ProfileHoverCardProps) {
  return (
    <HeroPhotoCarousel
      images={[
        "/profile.jpg",
        "/images/hero/photo-2.jpg",
        "/images/hero/photo-3.jpg",
        "/images/hero/photo-4.jpg",
      ]}
      alt={`Portrait of ${profile.name}`}
      className={className}
      projectProgress={projectProgress}
    >
      <>
        <p className="profile-hover-kicker">
          B.Tech Computer Science Student
        </p>

        <div>
          <h2>{profile.name}</h2>

          <p className="profile-hover-description">
            Full-Stack Developer{" "}
            <span aria-hidden="true">·</span> Java Backend Developer{" "}
            <span aria-hidden="true">·</span> AI Enthusiast
          </p>
        </div>

        <div className="profile-hover-actions">
          <a href="#work">
            View My Projects <span aria-hidden="true">↗</span>
          </a>

          <a href={`mailto:${profile.email}`}>
            Contact Me <span aria-hidden="true">↗</span>
          </a>
        </div>
      </>
    </HeroPhotoCarousel>
  );
}
