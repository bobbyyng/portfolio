"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 sm:bottom-6 sm:right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground shadow-lg shadow-black/5 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:border-foreground/40 hover:shadow-xl",
        isVisible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-3"
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
