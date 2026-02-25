import fs from "fs";
import path from "path";

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
