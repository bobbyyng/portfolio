"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BLOG_LANG_STORAGE_KEY,
  DEFAULT_BLOG_LANG,
  type BlogLang,
} from "@/lib/blog-lang";
import { cn } from "@/lib/utils";

type BlogLangContextValue = {
  lang: BlogLang;
  setLang: (lang: BlogLang) => void;
};

const BlogLangContext = createContext<BlogLangContextValue | null>(null);

export function BlogLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<BlogLang>(DEFAULT_BLOG_LANG);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(BLOG_LANG_STORAGE_KEY);
      if (stored === "en" || stored === "zh") {
        setLangState(stored);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setLang = useCallback((next: BlogLang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(BLOG_LANG_STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return (
    <BlogLangContext.Provider value={value}>{children}</BlogLangContext.Provider>
  );
}

export function useBlogLang(): BlogLangContextValue {
  const ctx = useContext(BlogLangContext);
  if (!ctx) {
    return {
      lang: DEFAULT_BLOG_LANG,
      setLang: () => {},
    };
  }
  return ctx;
}

export function BlogLangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useBlogLang();

  return (
    <div
      role="group"
      aria-label="Blog language"
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background/60 p-0.5 label-mono text-xs",
        className
      )}
    >
      {(
        [
          { id: "en", label: "EN" },
          { id: "zh", label: "中文" },
        ] as const
      ).map((opt) => {
        const active = lang === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setLang(opt.id)}
            aria-pressed={active}
            className={cn(
              "cursor-pointer rounded-full px-2.5 py-1 transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
