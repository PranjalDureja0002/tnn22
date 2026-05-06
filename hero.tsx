"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { FloatingCards } from "@/components/brand/floating-cards";

const HEADLINE_WORDS: { text: string; italic?: boolean }[] = [
  { text: "One" },
  { text: "place" },
  { text: "for" },
  { text: "everything" },
  { text: "your", italic: true },
  { text: "team", italic: true },
  { text: "has" },
  { text: "already" },
  { text: "built." },
];

export function Hero(_props?: { stats?: { engagements: number; assets: number; contributors: number } }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Magnetic search button
  const magnetRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const btn = magnetRef.current;
    if (!btn) return;
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const k = (1 - dist / 140) * 8;
        btn.style.transform = `translate(${(dx / dist) * k}px, ${(dy / dist) * k}px)`;
      } else {
        btn.style.transform = "translate(0, 0)";
      }
    };
    const onLeave = () => {
      btn.style.transform = "translate(0, 0)";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-pwc-mist bg-white">
      {/* Right-side parallelogram backdrop with depth */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] md:block">
        <div className="absolute inset-y-0 -right-32 w-[140%] -skew-x-[18deg] bg-gradient-to-br from-pwc-orange via-pwc-orange to-pwc-orange-hover" />
        <div className="absolute right-[6%] top-[10%] h-32 w-44 -skew-x-[18deg] bg-pwc-orange-hover/70 blur-[1px]" />
        <div className="absolute right-[2%] bottom-[12%] h-24 w-36 -skew-x-[18deg] bg-pwc-burgundy" />
        <div className="absolute right-[18%] bottom-[26%] h-3 w-32 -skew-x-[18deg] bg-white/60" />
      </div>

      {/* Subtle grid pattern, masked into top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-[0.045] md:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 30% 30%, black 0%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(ellipse at 30% 30%, black 0%, transparent 60%)",
        }}
      />

      <div className="container relative grid gap-12 py-16 md:grid-cols-12 md:py-24">
        {/* LEFT — animated headline + search */}
        <div className="md:col-span-7 md:pr-6">
          <div
            className="pwc-eyebrow opacity-0 animate-fade-up"
            style={{ animationDelay: "100ms", animationFillMode: "both" }}
          >
            Agentic Automation Practice • PwC India
          </div>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.12] tracking-tightest text-pwc-ink md:text-5xl lg:text-6xl">
            {HEADLINE_WORDS.map((w, i) => (
              <span key={i} className="word-reveal mr-[0.22em]">
                <span
                  style={{ animationDelay: `${200 + i * 75}ms` }}
                  className={cn("inline-block", w.italic && "italic text-pwc-orange")}
                >
                  {w.text}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="mt-6 max-w-xl text-base leading-relaxed text-pwc-steel opacity-0 animate-fade-up md:text-lg"
            style={{ animationDelay: "1100ms", animationFillMode: "both" }}
          >
            Search hundreds of engagement collaterals, demos, architectures, and lessons
            learned across the practice. When a new opportunity comes in, find what's been
            done before in seconds — not days.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
            className={cn(
              "mt-10 flex max-w-2xl items-stretch border-2 border-pwc-ink opacity-0 animate-fade-up transition-all duration-300",
              searchFocused && "shadow-[0_18px_60px_rgba(208,74,2,0.20)] -translate-y-0.5"
            )}
            style={{ animationDelay: "1300ms", animationFillMode: "both" }}
          >
            <Search
              className={cn(
                "ml-4 mr-2 h-5 w-5 self-center transition-colors",
                searchFocused ? "text-pwc-orange" : "text-pwc-smoke"
              )}
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search engagements, assets, lessons learned…"
              className="flex-1 border-0 bg-transparent px-2 py-4 text-base text-pwc-ink placeholder:text-pwc-smoke focus:outline-none"
            />
            <button
              ref={magnetRef}
              type="submit"
              className="flex items-center gap-2 bg-pwc-ink px-6 py-4 text-sm font-medium text-white hover:bg-pwc-orange"
              style={{ transition: "transform 200ms cubic-bezier(0.22,1,0.36,1), background-color 200ms" }}
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div
            className="mt-6 flex flex-wrap items-center gap-2 text-sm text-pwc-steel opacity-0 animate-fade-up"
            style={{ animationDelay: "1500ms", animationFillMode: "both" }}
          >
            <span className="text-xs uppercase tracking-wider">Try</span>
            {["Invoice processing", "Document extraction", "RFP responses", "GenAI agents"].map((s) => (
              <Link
                key={s}
                href={`/search?q=${encodeURIComponent(s)}`}
                className="rounded-full border border-pwc-mist px-3 py-1 text-xs transition-all hover:-translate-y-0.5 hover:border-pwc-orange hover:text-pwc-orange"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT — floating engagement preview cards */}
        <div className="relative z-10 hidden md:col-span-5 md:block">
          <div
            className="opacity-0 animate-fade-up"
            style={{ animationDelay: "700ms", animationFillMode: "both" }}
          >
            <FloatingCards />
          </div>
        </div>
      </div>
    </section>
  );
}
