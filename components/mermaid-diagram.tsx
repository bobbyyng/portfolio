"use client";

import { useEffect, useId, useRef, useState } from "react";

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;

        const isDark = document.documentElement.classList.contains("dark");
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          securityLevel: "loose",
          themeVariables: isDark
            ? {
                // Dark — zinc palette
                background: "#18181b",
                primaryColor: "#27272a",
                primaryTextColor: "#fafafa",
                primaryBorderColor: "#3f3f46",
                lineColor: "#71717a",
                secondaryColor: "#3f3f46",
                secondaryTextColor: "#d4d4d8",
                secondaryBorderColor: "#52525b",
                tertiaryColor: "#52525b",
                tertiaryTextColor: "#e4e4e7",
                tertiaryBorderColor: "#71717a",
                noteBkgColor: "#27272a",
                noteTextColor: "#d4d4d8",
                noteBorderColor: "#3f3f46",
                edgeLabelBackground: "#27272a",
                clusterBkg: "#27272a",
                clusterBorder: "#3f3f46",
                titleColor: "#fafafa",
                fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
              }
            : {
                // Light — warm zinc / paper palette
                background: "#f5f4f0",
                primaryColor: "#f4f4f5",
                primaryTextColor: "#18181b",
                primaryBorderColor: "#d4d4d8",
                lineColor: "#a1a1aa",
                secondaryColor: "#e4e4e7",
                secondaryTextColor: "#27272a",
                secondaryBorderColor: "#d4d4d8",
                tertiaryColor: "#fafafa",
                tertiaryTextColor: "#3f3f46",
                tertiaryBorderColor: "#e4e4e7",
                noteBkgColor: "#f4f4f5",
                noteTextColor: "#3f3f46",
                noteBorderColor: "#d4d4d8",
                edgeLabelBackground: "#f5f4f0",
                clusterBkg: "#f4f4f5",
                clusterBorder: "#d4d4d8",
                titleColor: "#18181b",
                fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
              },
        });

        const { svg } = await mermaid.render(`mermaid-${id}`, chart.trim());

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="my-6 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4">
        <p className="text-sm font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 [&_svg]:max-w-full"
    />
  );
}
