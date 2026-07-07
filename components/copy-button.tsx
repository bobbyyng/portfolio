"use client";

import { useRef, useState } from "react";
import { Copy, ChevronUp, Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  markdown: string;
  title: string;
}

function stripMarkdown(md: string): string {
  return md
    .replace(/^---[\s\S]*?---\n?/, "")
    .replace(/<[^>]+>/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/___(.+?)___/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/!\[.*?\]\(.+?\)/g, "")
    .replace(/^>\s+/gm, "")
    .replace(/^[-*_]{3,}\s*$/gm, "")
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function CopyButton({ markdown, title }: CopyButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"markdown" | "text" | null>(null);
  const closeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleClose() {
    closeRef.current = setTimeout(() => setOpen(false), 150);
  }

  function cancelClose() {
    if (closeRef.current) clearTimeout(closeRef.current);
  }

  async function copy(type: "markdown" | "text") {
    const content = type === "markdown" ? markdown : stripMarkdown(markdown);
    await navigator.clipboard.writeText(content);
    setCopied(type);
    setOpen(false);
    setTimeout(() => setCopied(null), 2000);
  }

  const isCopied = copied !== null;

  return (
    <div className="relative inline-flex">
      {/* Main button */}
      <button
        onClick={() => copy("markdown")}
        className={cn(
          "label-mono inline-flex cursor-pointer items-center gap-2 rounded-l-full border border-border bg-background/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          isCopied && "text-foreground"
        )}
      >
        {isCopied ? (
          <Check className="h-3.5 w-3.5 shrink-0" />
        ) : (
          <Copy className="h-3.5 w-3.5 shrink-0" />
        )}
        {isCopied ? "Copied!" : "Copy page"}
      </button>

      {/* Chevron toggle — hover opens dropdown */}
      <button
        onMouseEnter={() => { cancelClose(); setOpen(true); }}
        onMouseLeave={scheduleClose}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex cursor-pointer items-center rounded-r-full border border-l-0 border-border bg-background/60 px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="More copy options"
      >
        <ChevronUp className={cn("h-3.5 w-3.5 transition-transform duration-200", !open && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-border bg-background shadow-lg overflow-hidden"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <button
            onClick={() => copy("text")}
            className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
          >
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="label-mono text-xs font-medium text-foreground">Copy as text</p>
            </div>
          </button>
          <div className="mx-4 border-t border-border" />
          <button
            onClick={() => copy("markdown")}
            className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
          >
            <Copy className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="label-mono text-xs font-medium text-foreground">Copy as Markdown</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
