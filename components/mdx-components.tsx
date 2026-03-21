import type { MDXComponents } from "mdx/types";
import { isValidElement, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/utils";

const tableShell =
  "overflow-x-auto my-6 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm";
const tableBase = "min-w-full border-collapse text-sm";
const thClassName =
  "border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 text-left font-semibold text-zinc-800 dark:text-zinc-200";
const tdClassName =
  "border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 align-top text-zinc-700 dark:text-zinc-300";
const theadClassName = "border-b border-zinc-200 dark:border-zinc-700";
const tbodyClassName =
  "[&_tr:nth-child(even)]:bg-zinc-50/70 dark:[&_tr:nth-child(even)]:bg-zinc-900/40";
const captionClassName =
  "caption-top px-4 pt-3 pb-2 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400";

type DataRow = Record<string, unknown>;

export type DataTableColumn =
  | string
  | {
      key: string;
      /** Column header; defaults to a title-cased key */
      header?: string;
    };

function humanizeKey(key: string): string {
  const spaced = key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim();
  if (!spaced) return key;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function resolveColumns(
  columns: DataTableColumn[] | undefined,
  sampleRow: DataRow
): { key: string; header: string }[] {
  if (columns?.length) {
    return columns.map((c) =>
      typeof c === "string"
        ? { key: c, header: humanizeKey(c) }
        : { key: c.key, header: c.header ?? humanizeKey(c.key) }
    );
  }
  return Object.keys(sampleRow).map((key) => ({ key, header: humanizeKey(key) }));
}

function formatCell(value: unknown): ReactNode {
  if (value == null) return <span className="text-zinc-400">—</span>;
  if (isValidElement(value)) return value;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number" || typeof value === "bigint") return String(value);
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

/**
 * Data-driven table for MDX: pass rows as objects; optional `columns` controls order and headers.
 * Use `<Table ... />` or `<DataTable ... />` (same component).
 */
export function DataTable(props: {
  caption?: string;
  columns?: DataTableColumn[];
  /** Omitted when `<Table />` has no props — treated as empty */
  data?: DataRow[];
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const { caption, columns, data } = props;
  const rows = data ?? [];
  if (!rows.length) {
    return (
      <div className={`${tableShell} px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400`}>
        No rows
      </div>
    );
  }

  const resolved = resolveColumns(columns, rows[0]);

  return (
    <div className={tableShell}>
      <table className={tableBase}>
        {caption ? <caption className={captionClassName}>{caption}</caption> : null}
        <thead className={theadClassName}>
          <tr>
            {resolved.map((col) => (
              <th key={col.key} className={thClassName}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={tbodyClassName}>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {resolved.map((col) => (
                <td key={col.key} className={tdClassName}>
                  {formatCell(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Alias for tutorials that use `<Table data={...} />` — not the HTML `<table>` element */
export const Table = DataTable;

/** Optional JSX wrapper for MDX tables — use with thead/tbody/tr/th/td inside. */
export function MDXTable({
  caption,
  children,
}: {
  caption?: string;
  children: ReactNode;
}) {
  return (
    <div className={tableShell}>
      <table className={tableBase}>
        {caption ? <caption className={captionClassName}>{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}

export type BilingualSolutionItem = {
  enLabel: string;
  en: string;
  zhLabel: string;
  zh: string;
};

/** Short EN + 中文 stacked paragraphs (e.g. phenomenon intro) */
export function BilingualParagraph(props: {
  en?: string;
  zh?: string;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const en = props.en ?? "";
  const zh = props.zh ?? "";
  if (!en && !zh) return null;
  return (
    <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300 leading-7">
      {en ? <p className="text-zinc-800 dark:text-zinc-200">{en}</p> : null}
      {zh ? <p className="text-zinc-600 dark:text-zinc-400">{zh}</p> : null}
    </div>
  );
}

/** EN + 中文 solution bullets: bold label then detail on two lines per item */
export function BilingualSolutionList(props: {
  items?: BilingualSolutionItem[];
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const items = props.items ?? [];
  return (
    <ul className="list-none space-y-4 mb-4 pl-0">
      {items.map((item, i) => (
        <li key={i} className="text-zinc-700 dark:text-zinc-300 leading-7">
          <p className="mb-1">
            <strong className="text-zinc-900 dark:text-zinc-100">{item.enLabel}:</strong>{" "}
            {item.en}
          </p>
          <p className="pl-0 text-zinc-600 dark:text-zinc-400">
            <strong className="text-zinc-800 dark:text-zinc-200">{item.zhLabel}：</strong>{" "}
            {item.zh}
          </p>
        </li>
      ))}
    </ul>
  );
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

export function createMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    // Customize heading styles
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-black dark:text-zinc-50">
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const id = slugify(extractTextFromChildren(children)) || undefined;
      return (
        <h2
          id={id}
          className="text-2xl font-semibold mt-6 mb-3 text-black dark:text-zinc-50 scroll-mt-24"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(extractTextFromChildren(children)) || undefined;
      return (
        <h3
          id={id}
          className="text-xl font-semibold mt-4 mb-2 text-black dark:text-zinc-50 scroll-mt-24"
        >
          {children}
        </h3>
      );
    },
    h4: ({ children }) => {
      const id = slugify(extractTextFromChildren(children)) || undefined;
      return (
        <h4
          id={id}
          className="text-lg font-semibold mt-4 mb-2 text-zinc-900 dark:text-zinc-100 scroll-mt-24"
        >
          {children}
        </h4>
      );
    },
    p: ({ children }) => (
      <p className="mb-4 text-zinc-700 dark:text-zinc-300 leading-7">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <Link
        href={href || "#"}
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        {children}
      </Link>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="ml-4 [&_p]:inline [&_p]:m-0 [&_p]:leading-7">
        {children}
      </li>
    ),
    code: ({ children }) => (
      <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-zinc-800 dark:text-zinc-200">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg overflow-x-auto mb-4">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic my-4 text-zinc-600 dark:text-zinc-400">
        {children}
      </blockquote>
    ),
    img: (props) => {
      const alt = typeof props.alt === "string" ? props.alt : "";
      const src =
        typeof props.src === "string"
          ? props.src
          : (props as { src?: { src?: string } }).src?.src ?? "";
      return (
        <figure className="my-6">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 w-full h-auto"
          />
          {alt && (
            <figcaption className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-2 italic">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    },
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
    hr: () => (
      <hr className="my-8 border-zinc-200 dark:border-zinc-700" />
    ),
    ...components,
  };
}

export const defaultMDXComponents = createMDXComponents();

