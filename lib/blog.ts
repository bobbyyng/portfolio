import fs from "fs";
import path from "path";
import { splitBilingualLabel } from "./blog-lang";
import { slugify } from "./utils";

export interface Heading {
  id: string;
  text: string;
  textEn?: string;
  textZh?: string;
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

function headingFromParts(
  en: string,
  zh: string | undefined,
  level: 2 | 3
): Heading | null {
  const textEn = en.trim();
  const textZh = zh?.trim() || undefined;
  if (!textEn && !textZh) return null;

  const idSource = textEn || textZh || "";
  const id = slugify(idSource);
  if (!id) return null;

  const text = textZh ? `${textEn} · ${textZh}` : textEn;
  return { id, text, textEn: textEn || undefined, textZh, level };
}

function parseBilingualHeadingAttrs(attrs: string): Heading | null {
  const levelMatch = attrs.match(/\blevel=\{(\d)\}/);
  const levelNum = levelMatch ? Number(levelMatch[1]) : 2;
  if (levelNum !== 2 && levelNum !== 3) return null;

  const enMatch = attrs.match(/\ben=["']([^"']+)["']/);
  const zhMatch = attrs.match(/\bzh=["']([^"']+)["']/);
  return headingFromParts(enMatch?.[1] ?? "", zhMatch?.[1], levelNum);
}

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const tokenRe =
    /^(#{2,3})\s+(.+)$|<BilingualHeading\b([\s\S]*?)\/>/gm;
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(content)) !== null) {
    if (match[1] && match[2]) {
      const level = match[1].length === 2 ? (2 as const) : (3 as const);
      const cleanText = match[2].replace(/\s*\{.*?\}\s*$/g, "").trim();
      if (!cleanText) continue;

      const split = splitBilingualLabel(cleanText);
      if (split) {
        const heading = headingFromParts(split.en, split.zh, level);
        if (heading) headings.push(heading);
        continue;
      }

      const id = slugify(cleanText);
      if (!id) continue;
      headings.push({ id, text: cleanText, textEn: cleanText, level });
      continue;
    }

    if (match[3] != null) {
      const heading = parseBilingualHeadingAttrs(match[3]);
      if (heading) headings.push(heading);
    }
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

export type BlogTagCount = {
  tag: string;
  count: number;
};

/** Tags sorted by how many posts use them (most common first). */
export function getBlogTagsByFrequency(): BlogTagCount[] {
  const counts = new Map<string, number>();

  getAllBlogPosts().forEach((post) => {
    (post.metadata.tags ?? []).forEach((tag) => {
      const normalized = tag.trim();
      if (normalized) {
        counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
      }
    });
  });

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
