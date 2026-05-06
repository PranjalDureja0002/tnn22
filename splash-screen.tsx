"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import logo from "@/assets/pwc-logo.png";

const STORAGE_KEY = "agentic_splash_seen";
const TYPE_TARGET = "Agentic Automation Portal";

export function SplashScreen() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "gone">("loading");
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(STORAGE_KEY)) {
      setPhase("gone");
      return;
    }

    // Typewriter — kicks in after the logo's fade-in (~500ms)
    let i = 0;
    const typer = setInterval(() => {
      i++;
      setTyped(TYPE_TARGET.slice(0, i));
      if (i >= TYPE_TARGET.length) clearInterval(typer);
    }, 52);

    const startLeave = setTimeout(() => setPhase("leaving"), 3000);
    const finish = setTimeout(() => {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
      setPhase("gone");
    }, 3500);

    return () => {
      clearInterval(typer);
      clearTimeout(startLeave);
      clearTimeout(finish);
    };
  }, []);

  if (phase === "gone") return null;

  function skip() {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    }
    setPhase("leaving");
    setTimeout(() => setPhase("gone"), 500);
  }

  return (
    <div
      onClick={skip}
      role="presentation"
      className={cn(
        "fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-white transition-all duration-500 ease-out",
        phase === "leaving" && "scale-[1.03] pointer-events-none opacity-0"
      )}
    >
      {/* Decorative parallelogram shutters — sweep from each side */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-[14%] h-28 w-40 -skew-x-[18deg] bg-pwc-orange-soft splash-shutter-l"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 bottom-[16%] h-20 w-32 -skew-x-[18deg] bg-pwc-burgundy/15 splash-shutter-r"
      />

      {/* Brand bar that grows below the title */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[62%] h-1 -translate-x-1/2 -skew-x-[18deg] bg-pwc-orange splash-bar"
      />

      <div className="relative px-8 text-center">
        <div className="splash-logo">
          <Image src={logo} alt="PwC" height={92} priority className="mx-auto" />
        </div>

        <h1 className="mt-10 min-h-[1.4em] font-display text-3xl font-semibold tracking-tightest text-pwc-ink md:text-5xl">
          {typed}
          <span className="ml-1 inline-block h-[0.9em] w-[3px] align-middle bg-pwc-orange splash-cursor" />
        </h1>

        <div className="mt-5 text-[10px] font-semibold uppercase tracking-[0.42em] text-pwc-steel splash-tagline">
          Agentic Automation Practice • PwC India
        </div>

        <div className="splash-hint absolute -bottom-20 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] text-pwc-smoke">
          Click to enter →
        </div>
      </div>
    </div>
  );
}
