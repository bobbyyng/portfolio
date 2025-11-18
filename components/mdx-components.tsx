import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

export function createMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    // Customize heading styles
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-black dark:text-zinc-50">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3 text-black dark:text-zinc-50">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-4 mb-2 text-black dark:text-zinc-50">
        {children}
      </h3>
    ),
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
      <li className="ml-4">{children}</li>
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
    img: (props) => (
      <Image
        {...props}
        alt={props.alt || ""}
        width={800}
        height={600}
        className="rounded-lg my-4"
      />
    ),
    ...components,
  };
}

export const defaultMDXComponents = createMDXComponents();

