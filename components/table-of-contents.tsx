"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import type { Heading } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const updateActiveId = () => {
      const offset = 100;
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter((el): el is HTMLElement => el !== null);

      let active: string | null = null;
      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset) {
          active = el.id;
        }
      }
      setActiveId(active ?? headings[0]?.id ?? null);
    };

    updateActiveId();
    window.addEventListener("scroll", updateActiveId, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveId);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      className="sticky top-24 w-56"
      aria-label="On this page"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
        <Menu className="w-4 h-4" />
        <span>On this page</span>
      </div>
      <ul className="space-y-1 text-sm">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li
              key={heading.id}
              className={cn(
                "relative border-l-2 border-transparent pl-3",
                heading.level === 3 && "pl-5",
                isActive && "border-l-zinc-900 dark:border-l-zinc-100"
              )}
            >
              <Link
                href={`#${heading.id}`}
                className={cn(
                  "block py-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors",
                  isActive && "font-medium text-zinc-900 dark:text-zinc-100"
                )}
              >
                {heading.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
