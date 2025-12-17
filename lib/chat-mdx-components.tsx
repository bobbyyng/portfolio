import type { Components } from "react-markdown";

// MDX components for chat messages
export const chatMDXComponents: Components = {
  p: ({ children }) => (
    <p className="mb-2 first:mt-0 last:mb-0 leading-relaxed">
      {children}
    </p>
  ),
  h1: ({ children }) => (
    <h1 className="text-xl font-bold mt-3 mb-2 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold mt-3 mb-2 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold mt-2 mb-1 first:mt-0">{children}</h3>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>
  ),
  li: ({ children }) => <li className="ml-2">{children}</li>,
  code: ({ children, className }) => {
    const isInline = !className;
    return isInline ? (
      <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono wrap-break-word">
        {children}
      </code>
    ) : (
      <code className="block bg-black/10 dark:bg-white/10 p-2 rounded text-sm font-mono overflow-x-auto my-2">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-black/10 dark:bg-white/10 p-2 rounded overflow-x-auto my-2 text-sm">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-current/30 pl-3 italic my-2">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:no-underline opacity-90 hover:opacity-100"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  hr: () => <hr className="my-3 border-current/20" />,
  table: ({ children }) => (
    <table className="w-full border-collapse my-3 text-sm">{children}</table>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b last:border-0 border-muted">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="font-semibold text-left px-3 py-2 bg-muted/60">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 align-top">{children}</td>
  ),
};
