
"use client";
import { useEffect, useState } from "react";
import DepthCard from "@/components/ui/depth-card";

type Shot = { src: string; caption: string };

type Props = {
  index: number;
  p: {
    title: string;
    blurb: string;
    points: string[];
    tags: string[];
    link: string;
    shots: Shot[];
  };
};

export default function Project({ p, index }: Props) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  const hasShots = p.shots && p.shots.length > 0;
  const shot = hasShots ? p.shots[current] : undefined;

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <DepthCard
        className={`project${index % 2 ? " flip" : ""}`}
        label={p.title}
        delay={index * 0.06}
      >
        <div className="info">
          <h3>{p.title}</h3>
          <p>{p.blurb}</p>

          <ul>
            {p.points.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <p className="stack mono">{p.tags.join(" / ")}</p>

          <p>
            <a href={p.link} target="_blank" rel="noreferrer">
              Source code on GitHub
            </a>
          </p>
        </div>

        {hasShots && shot && (
          <div className="shots">
            <button
              className="shot"
              onClick={() => setOpen(true)}
              aria-label={`Enlarge screenshot: ${shot.caption}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.src}
                alt={`${p.title}, ${shot.caption}`}
                loading="lazy"
              />
            </button>

            <div
              className="tabs mono"
              role="group"
              aria-label="Choose a screenshot"
            >
              {p.shots.map((s, k) => (
                <button
                  key={s.src}
                  aria-pressed={k === current}
                  onClick={() => setCurrent(k)}
                >
                  {s.caption}
                </button>
              ))}
            </div>
          </div>
        )}
      </DepthCard>

      {open && shot && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={shot.caption}
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shot.src} alt={shot.caption} />

          <p className="mono">
            {shot.caption}. Press Escape or click to close.
          </p>
        </div>
      )}
    </>
  );
}
