import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ajith Kumar Rayeeshetti, Aspiring Software Engineer , Fullstack Developer",
  description: "Projects and background of Ajith Kumar Rayeeshetti: React, Next.js and TypeScript interfaces connected to Spring Boot APIs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
