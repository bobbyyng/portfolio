import type { MDXComponents } from "mdx/types";
import { Children, isValidElement, type ReactNode } from "react";
import Link from "next/link";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import {
  BilingualHeading,
  BilingualMarkdownHeading,
  BilingualParagraph,
  BilingualSolutionList,
  DataTable,
  MDXTable,
  MdxImage,
  Table,
  mdxTableStyles,
} from "@/components/mdx-bilingual";

export type {
  BilingualSolutionItem,
  DataTableColumn,
} from "@/components/mdx-bilingual";

export {
  BilingualHeading,
  BilingualParagraph,
  BilingualSolutionList,
  DataTable,
  MDXTable,
  Table,
};

/** Markdown wraps standalone images in <p>; MdxImage renders <figure> — unwrap to avoid invalid HTML. */
function isParagraphOnlyMedia(children: ReactNode): boolean {
  const nodes = Children.toArray(children).filter(
    (node) => !(typeof node === "string" && node.trim() === "")
  );
  if (nodes.length === 0) return false;
  return nodes.every((node) => {
    if (!isValidElement(node)) return false;
    if (node.type === MdxImage || node.type === "figure" || node.type === "img") {
      return true;
    }
    const props = node.props as { src?: unknown };
    return props.src != null;
  });
}

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    const element = children as React.ReactElement<{ children?: React.ReactNode }>;
    return extractTextFromChildren(element.props.children);
  }
  return "";
}

const {
  tableShell,
  tableBase,
  thClassName,
  tdClassName,
  theadClassName,
  tbodyClassName,
  captionClassName,
} = mdxTableStyles;

export function createMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    h1: ({ children }) => (
      <BilingualMarkdownHeading level={1}>{children}</BilingualMarkdownHeading>
    ),
    h2: ({ children }) => (
      <BilingualMarkdownHeading level={2}>{children}</BilingualMarkdownHeading>
    ),
    h3: ({ children }) => (
      <BilingualMarkdownHeading level={3}>{children}</BilingualMarkdownHeading>
    ),
    h4: ({ children }) => (
      <BilingualMarkdownHeading level={4}>{children}</BilingualMarkdownHeading>
    ),
    p: ({ children }) => {
      if (isParagraphOnlyMedia(children)) {
        return <>{children}</>;
      }
      return (
        <p className="mb-5 text-zinc-700 dark:text-zinc-300 leading-8">
          {children}
        </p>
      );
    },
    a: ({ href, children }) => (
      <Link
        href={href || "#"}
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        {children}
      </Link>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-outside pl-5 mb-6 space-y-2.5 marker:text-zinc-400 text-zinc-700 dark:text-zinc-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside pl-5 mb-6 space-y-2.5 marker:text-zinc-400 text-zinc-700 dark:text-zinc-300">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed [&_p]:inline [&_p]:m-0 [&_p]:leading-relaxed">
        {children}
      </li>
    ),
    code: ({ children }) => (
      <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-zinc-800 dark:text-zinc-200">
        {children}
      </code>
    ),
    pre: ({ children }) => {
      if (isValidElement(children)) {
        const child = children as React.ReactElement<{ className?: string; children?: ReactNode }>;
        if (child.props.className?.includes("language-mermaid")) {
          const chart = extractTextFromChildren(child.props.children);
          return <MermaidDiagram chart={chart} />;
        }
      }
      return (
        <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg overflow-x-auto mb-4">
          {children}
        </pre>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic my-4 text-zinc-600 dark:text-zinc-400">
        {children}
      </blockquote>
    ),
    img: MdxImage,
    table: ({ children }) => (
      <div className={tableShell}>
        <table className={tableBase}>{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className={theadClassName}>{children}</thead>,
    tbody: ({ children }) => <tbody className={tbodyClassName}>{children}</tbody>,
    tfoot: ({ children }) => (
      <tfoot className="border-t border-zinc-200 bg-zinc-50/90 dark:border-zinc-700 dark:bg-zinc-900/50">
        {children}
      </tfoot>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => <th className={thClassName}>{children}</th>,
    td: ({ children }) => <td className={tdClassName}>{children}</td>,
    caption: ({ children }) => <caption className={captionClassName}>{children}</caption>,
    MDXTable,
    Table,
    DataTable,
    BilingualParagraph,
    BilingualSolutionList,
    BilingualHeading,
    hr: () => (
      <hr className="my-8 border-zinc-200 dark:border-zinc-700" />
    ),
    ...components,
  };
}

export const defaultMDXComponents = createMDXComponents();
