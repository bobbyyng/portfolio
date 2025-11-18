import fs from "fs";
import path from "path";

export interface ProjectMetadata {
  title: string;
  tags?: string[];
  sorting?: number;
  [key: string]: string | string[] | number | undefined;
}

export interface Project {
  slug: string;
  metadata: ProjectMetadata;
  content: string;
}

const projectsDirectory = path.join(process.cwd(), "content/projects");

export function getAllProjectSlugs(): string[] {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(projectsDirectory);
  return fileNames
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, ""))
    .sort((a, b) => {
      const sortingA = getProjectBySlug(a)?.metadata.sorting || 0;
      const sortingB = getProjectBySlug(b)?.metadata.sorting || 0;
      return sortingA - sortingB;
    });
}

export function getProjectBySlug(slug: string): Project | null {
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Extract frontmatter - support both --- and ------ as opening and closing markers
  // Also handle cases where there's no content after frontmatter
  const frontmatterRegex = /^(?:---|------)\s*\n([\s\S]*?)\n(?:---|------)\s*(?:\n([\s\S]*))?$/;
  const match = fileContents.match(frontmatterRegex);

  if (match) {
    const frontmatter = match[1];
    const content = match[2] || "";

    // Parse frontmatter (simple YAML-like parsing)
    const metadata: ProjectMetadata = { title: slug };
    frontmatter.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return; // Skip empty lines
      
      const colonIndex = trimmedLine.indexOf(":");
      if (colonIndex > 0) {
        const key = trimmedLine.substring(0, colonIndex).trim();
        const value = trimmedLine
          .substring(colonIndex + 1)
          .trim()
          .replace(/^["']|["']$/g, "");
        
        if (key === "tags") {
          metadata[key] = value.split(",").map((t) => t.trim());
        } else if (key === "sorting") {
          metadata[key] = parseInt(value, 10) || 0;
        } else {
          metadata[key] = value;
        }
      }
    });

    return {
      slug,
      metadata,
      content,
    };
  }

  return {
    slug,
    metadata: { title: slug },
    content: fileContents,
  };
}

export function getAllProjects(): Project[] {
  const slugs = getAllProjectSlugs();
  return slugs
    .map((slug) => getProjectBySlug(slug))
    .filter((project): project is Project => project !== null)
    .sort((a, b) => {
      const sortingA = a.metadata.sorting || 0;
      const sortingB = b.metadata.sorting || 0;
      return sortingA - sortingB;
    });
}
