"use client";

import { isValidElement, type ReactNode } from "react";
import Image from "next/image";
import { useBlogLang } from "@/components/blog-lang";
import {
  pickBilingual,
  splitBilingualLabel,
  type BilingualString,
} from "@/lib/blog-lang";
import { slugify } from "@/lib/utils";

export function MdxImage(props: {
  alt?: string;
  src?: string | { src?: string };
  [key: string]: unknown;
}) {
  const { lang } = useBlogLang();
  const rawAlt = typeof props.alt === "string" ? props.alt : "";
  const alt = pickBilingual(rawAlt, lang) ?? rawAlt;
  const src =
    typeof props.src === "string"
      ? props.src
      : props.src?.src ?? "";
  const isPhoneScreenshot = src.startsWith("/blog/");

  return (
    <figure
      className={
        isPhoneScreenshot
          ? "my-8 flex flex-col items-center"
          : "my-6"
      }
    >
      <div
        className={
          isPhoneScreenshot
            ? "w-full max-w-[260px] sm:max-w-[300px]"
            : "w-full"
        }
      >
        <Image
          src={src}
          alt={alt}
          width={isPhoneScreenshot ? 390 : 1200}
          height={isPhoneScreenshot ? 844 : 800}
          sizes={
            isPhoneScreenshot
              ? "(max-width: 640px) 260px, 300px"
              : "100vw"
          }
          className="rounded-xl border border-zinc-200 dark:border-zinc-700 w-full h-auto shadow-sm"
        />
      </div>
      {alt ? (
        <figcaption className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-2 italic max-w-md">
          {alt}
        </figcaption>
      ) : null}
    </figure>
  );
}

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
      header?: string | BilingualString;
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
  sampleRow: DataRow,
  lang: "en" | "zh"
): { key: string; header: string }[] {
  if (columns?.length) {
    return columns.map((c) => {
      if (typeof c === "string") {
        return { key: c, header: humanizeKey(c) };
      }
      const rawHeader = c.header ?? humanizeKey(c.key);
      return {
        key: c.key,
        header: pickBilingual(rawHeader, lang) ?? humanizeKey(c.key),
      };
    });
  }
  return Object.keys(sampleRow).map((key) => ({ key, header: humanizeKey(key) }));
}

function formatCell(value: unknown, lang: "en" | "zh"): ReactNode {
  if (value == null) return <span className="text-zinc-400">—</span>;
  if (isValidElement(value)) return value;

  const bilingual = pickBilingual(value, lang);
  if (bilingual != null) return bilingual;

  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number" || typeof value === "bigint") return String(value);
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

export function DataTable(props: {
  caption?: string | BilingualString;
  columns?: DataTableColumn[];
  data?: DataRow[];
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const { lang } = useBlogLang();
  const { caption, columns, data } = props;
  const rows = data ?? [];
  if (!rows.length) {
    return (
      <div className={`${tableShell} px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400`}>
        No rows
      </div>
    );
  }

  const resolved = resolveColumns(columns, rows[0], lang);
  const captionText = caption != null ? pickBilingual(caption, lang) : null;

  return (
    <div className={tableShell}>
      <table className={tableBase}>
        {captionText ? (
          <caption className={captionClassName}>{captionText}</caption>
        ) : null}
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
                  {formatCell(row[col.key], lang)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Table = DataTable;

export function MDXTable(props: {
  caption?: string | BilingualString;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const { lang } = useBlogLang();
  const { caption, children } = props;
  const captionText = caption != null ? pickBilingual(caption, lang) : null;
  return (
    <div className={tableShell}>
      <table className={tableBase}>
        {captionText ? (
          <caption className={captionClassName}>{captionText}</caption>
        ) : null}
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

const headingClassName: Record<1 | 2 | 3 | 4, string> = {
  1: "text-2xl md:text-3xl font-semibold tracking-tight mt-14 first:mt-0 mb-5 text-black dark:text-zinc-50 scroll-mt-24",
  2: "text-2xl font-semibold tracking-tight mt-10 mb-4 text-black dark:text-zinc-50 scroll-mt-24",
  3: "text-xl font-semibold tracking-tight mt-8 mb-3 text-black dark:text-zinc-50 scroll-mt-24",
  4: "text-lg font-semibold mt-4 mb-2 text-zinc-900 dark:text-zinc-100 scroll-mt-24",
};

export function BilingualHeading(props: {
  level?: 1 | 2 | 3 | 4;
  en?: string;
  zh?: string;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const { lang } = useBlogLang();
  const level = props.level ?? 2;
  const en = props.en ?? "";
  const zh = props.zh ?? "";
  const text = lang === "zh" ? zh || en : en || zh;
  if (!text) return null;

  const id = slugify(en || zh) || undefined;
  const Tag = (`h${level}` as "h1" | "h2" | "h3" | "h4");

  return (
    <Tag id={id} className={headingClassName[level]}>
      {text}
    </Tag>
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

export function BilingualMarkdownHeading({
  level,
  children,
}: {
  level: 1 | 2 | 3 | 4;
  children: ReactNode;
}) {
  const { lang } = useBlogLang();
  const raw = extractTextFromChildren(children).trim();
  const split = splitBilingualLabel(raw);
  const text = split
    ? lang === "zh"
      ? split.zh
      : split.en
    : raw;
  const id = slugify(split?.en ?? raw) || undefined;
  const Tag = (`h${level}` as "h1" | "h2" | "h3" | "h4");

  return (
    <Tag id={id} className={headingClassName[level]}>
      {text}
    </Tag>
  );
}

export function BilingualParagraph(props: {
  en?: string;
  zh?: string;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const { lang } = useBlogLang();
  const en = props.en ?? "";
  const zh = props.zh ?? "";
  const text = lang === "zh" ? zh || en : en || zh;
  if (!text) return null;
  return (
    <div className="mb-4 text-zinc-700 dark:text-zinc-300 leading-7">
      <p className="text-zinc-800 dark:text-zinc-200">{text}</p>
    </div>
  );
}

export function BilingualSolutionList(props: {
  items?: BilingualSolutionItem[];
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const { lang } = useBlogLang();
  const items = props.items ?? [];
  return (
    <ul className="list-none space-y-4 mb-4 pl-0">
      {items.map((item, i) => {
        const label = lang === "zh" ? item.zhLabel : item.enLabel;
        const detail = lang === "zh" ? item.zh : item.en;
        const punct = lang === "zh" ? "：" : ":";
        return (
          <li key={i} className="text-zinc-700 dark:text-zinc-300 leading-7">
            <p className="mb-1">
              <strong className="text-zinc-900 dark:text-zinc-100">
                {label}
                {punct}
              </strong>{" "}
              {detail}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export const mdxTableStyles = {
  tableShell,
  tableBase,
  thClassName,
  tdClassName,
  theadClassName,
  tbodyClassName,
  captionClassName,
};
