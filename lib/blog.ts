import fs from "fs";
import path from "path";
import { slugify } from "./utils";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface BlogPostMetadata {
  title: string;
  date?: string;
  tags?: string[];
  summary?: string;
  coverImage?: string;
  [key: string]: string | string[] | number | boolean | undefined;
}

export interface BlogPost {
  slug: string;
  metadata: BlogPostMetadata;
  content: string;
}

const blogDirectory = path.join(process.cwd(), "content/blog");

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const lines = content.split("\n");
  const headingRegex = /^(#{2,3})\s+(.+)$/;

  for (const line of lines) {
    const match = line.match(headingRegex);
    if (!match) continue;

    const [, hashes, text] = match;
    const level = hashes.length === 2 ? (2 as const) : (3 as const);
    const cleanText = text.replace(/\s*\{.*?\}\s*$/g, "").trim();
    if (!cleanText) continue;

    const id = slugify(cleanText);
    if (!id) continue;

    headings.push({ id, text: cleanText, level });
  }

  return headings;
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(blogDirectory);
  return fileNames
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, ""));
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(blogDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const frontmatterRegex =
    /^(?:---|------)\s*\n([\s\S]*?)\n(?:---|------)\s*(?:\n([\s\S]*))?$/;
  const match = fileContents.match(frontmatterRegex);

  if (match) {
    const frontmatter = match[1];
    const content = match[2] || "";

    const metadata: BlogPostMetadata = { title: slug };
    frontmatter.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      const colonIndex = trimmedLine.indexOf(":");
      if (colonIndex > 0) {
        const key = trimmedLine.substring(0, colonIndex).trim();
        const value = trimmedLine
          .substring(colonIndex + 1)
          .trim()
          .replace(/^["']|["']$/g, "");

        if (key === "tags") {
          metadata[key] = value.split(",").map((t) => t.trim());
        } else {
          metadata[key] = value;
        }
      }
    });

    return { slug, metadata, content };
  }

  return { slug, metadata: { title: slug }, content: fileContents };
}

export function getAllBlogPosts(): BlogPost[] {
  const slugs = getAllBlogSlugs();
  return slugs
    .map((slug) => getBlogPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      const dateA = a.metadata.date ? new Date(a.metadata.date).getTime() : 0;
      const dateB = b.metadata.date ? new Date(b.metadata.date).getTime() : 0;
      return dateB - dateA;
    });
}

export function getAllBlogTags(): string[] {
  const allPosts = getAllBlogPosts();
  const tagsSet = new Set<string>();

  allPosts.forEach((post) => {
    const postTags = post.metadata.tags || [];
    postTags.forEach((tag) => {
      const normalizedTag = tag.trim();
      if (normalizedTag) {
        tagsSet.add(normalizedTag);
      }
    });
  });

  return Array.from(tagsSet).sort();
}
