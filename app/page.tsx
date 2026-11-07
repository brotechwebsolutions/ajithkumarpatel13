
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
import Experience from "@/components/Experience";
import Project from "@/components/Project";
import Questions from "@/components/Questions";
import DepthCard from "@/components/ui/depth-card";
import { certifications, profile, skills, projects } from "@/lib/data";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

function Head({ title, obj }: { title: string; obj: string }) {
  return (
    <div className="stage">
      <div className="anchor" data-obj={obj} aria-hidden="true" />
      <h2 className="sec-head">{title}</h2>
    </div>
  );
}

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="scene" aria-hidden="true"><Scene /></div>
      <a className="skip" href="#work">Skip to projects</a>
      <header className="nav">
        <span className="mono">Ajith Kumar R.</span>
        <nav aria-label="Main" className="mono">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#education">Education</a>
          <a href="#skills">Skills</a>
          <a href="#certifications">Certifications</a>
          <button
            className="nav-chat-button"
            type="button"
            onClick={() => setChatOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={chatOpen}
          >
            Ask me
          </button>
          <a href="#contact">Contact</a>
          {profile.resume && <a href={profile.resume} target="_blank" rel="noreferrer">Resume</a>}
        </nav>
      </header>

      <main>
        <section className="hero">
          <PerspectiveTunnelHero />
        </section>

        <section id="work" className="block"><div className="wrap">
          <Head title="Work" obj="bars" />
          {projects.map((p, i) => <Project key={p.title} p={p} index={i} />)}
        </div></section>

        <section id="about" className="block"><div className="wrap">
          <Head title="About" obj="donut" />
          <DepthCard className="prose depth-panel" label="About Ajith">
            <p>{profile.bio}</p>
            <p>I work in code rather than in design tools, so I judge a screen by building it and using it as a first-time visitor would.</p>
          </DepthCard>
        </div></section>

        <section id="experience" className="block"><div className="wrap">
          <Head title="Experience" obj="stack" />
          <Experience />
        </div></section>

        <section id="education" className="block"><div className="wrap">
          <Head title="Education" obj="education" />
          <DepthCard className="education-card" label="Education">
            <p className="education-kicker mono">Academic background</p>
            <p>{profile.education}</p>
          </DepthCard>
        </div></section>

        <section id="skills" className="block"><div className="wrap">
          <Head title="Skills" obj="lattice" />
          <dl className="skills">
            {skills.map((s, i) => (
              <DepthCard className="skill-depth" key={s.group} delay={i * 0.035}>
                <dt>{s.group}</dt>
                <dd>{s.items.join(", ")}</dd>
              </DepthCard>
            ))}
          </dl>
        </div></section>

        <section id="certifications" className="block"><div className="wrap">
          <Head title="Certifications" obj="certifications" />
          <div className="certification-grid">
            {certifications.map((cert, i) => (
              <DepthCard
                className="certification-card"
                key={`${cert.name}-${cert.issuer}`}
                delay={i * 0.05}
              >
                <p className="certification-year mono">{cert.year}</p>
                <h3>{cert.name}</h3>
                <p className="muted">{cert.issuer}</p>
              </DepthCard>
            ))}
          </div>
        </div></section>

        <section id="contact" className="block"><div className="wrap">
          <Head title="Contact" obj="stack-end" />
          <DepthCard className="contact-panel" label="Contact information">
            <a className="big" href={`mailto:${profile.email}`}>{profile.email}</a>
            <p className="muted">Email is the quickest way to reach me.</p>
            <dl className="contact">
              <div><dt className="mono">Phone</dt><dd>{profile.phone}</dd></div>
              <div><dt className="mono">Location</dt><dd>{profile.location}</dd></div>
              <div><dt className="mono">LinkedIn</dt><dd><a href={profile.linkedin} target="_blank" rel="noreferrer">ajith-kumar-rayeeshetti</a></dd></div>
              <div><dt className="mono">GitHub</dt><dd><a href={profile.github} target="_blank" rel="noreferrer">ajithkumarrayeeshetti</a></dd></div>
              {profile.resume && <div><dt className="mono">Resume</dt><dd><a href={profile.resume} target="_blank" rel="noreferrer">Open on Google Drive</a></dd></div>}
            </dl>
          </DepthCard>
        </div></section>
      </main>

      <footer className="foot mono">
        <div className="wrap">
          <span>Building ideas into reality, one line of code at a time.</span>
          <span>© 2026 Ajith Kumar R.</span>
        </div>
      </footer>
      <Questions
        open={chatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
}
