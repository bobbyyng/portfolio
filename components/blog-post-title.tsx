"use client";

import { useBlogLang } from "@/components/blog-lang";
import { pickBilingualTitle } from "@/lib/blog-lang";

export function BlogPostTitle({ title }: { title: string }) {
  const { lang } = useBlogLang();
  return (
    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
      {pickBilingualTitle(title, lang)}
    </h1>
  );
}
