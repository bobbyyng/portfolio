declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";
  let MDXComponent: (props: MDXProps) => JSX.Element;
  export default MDXComponent;
}

// Provides MDXComponents for mdx-components and @mdx-js/react compatibility
declare module "mdx/types" {
  import type { ComponentType, ReactNode } from "react";

  export type MDXComponents = Record<
    string,
    | ComponentType<{ children?: ReactNode; [key: string]: unknown }>
    | undefined
  >;

  export interface MDXProps {
    [key: string]: unknown;
    components?: MDXComponents;
  }
}

declare module "mdx/types.js" {
  import type { ComponentType, ReactNode } from "react";

  export type MDXComponents = Record<
    string,
    | ComponentType<{ children?: ReactNode; [key: string]: unknown }>
    | undefined
  >;

  export interface MDXProps {
    [key: string]: unknown;
    components?: MDXComponents;
  }
}

