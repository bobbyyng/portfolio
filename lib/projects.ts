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

/**
 * Get related projects by tags
 * @param tags - Array of tags or a single tag string to match
 * @param excludeSlug - Optional slug to exclude from results (e.g., current project)
 * @param limit - Optional limit on number of results to return
 * @returns Array of projects sorted by relevance (more matching tags = higher relevance)
 */
export function getRelatedProjectsByTags(
  tags: string | string[],
  excludeSlug?: string,
  limit?: number
): Project[] {
  const tagsArray = Array.isArray(tags) ? tags : [tags];
  const normalizedTags = tagsArray.map((tag) => tag.trim().toLowerCase());

  const allProjects = getAllProjects();
  const projectsWithScores = allProjects
    .filter((project) => {
      // Exclude the specified project if provided
      if (excludeSlug && project.slug === excludeSlug) {
        return false;
      }

      // Only include projects that have tags
      const projectTags = project.metadata.tags || [];
      if (projectTags.length === 0) {
        return false;
      }

      // Check if project has at least one matching tag
      const normalizedProjectTags = projectTags.map((tag) =>
        tag.trim().toLowerCase()
      );
      return normalizedTags.some((searchTag) =>
        normalizedProjectTags.includes(searchTag)
      );
    })
    .map((project) => {
      // Calculate relevance score based on number of matching tags
      const projectTags = project.metadata.tags || [];
      const normalizedProjectTags = projectTags.map((tag) =>
        tag.trim().toLowerCase()
      );
      const matchingTagsCount = normalizedTags.filter((searchTag) =>
        normalizedProjectTags.includes(searchTag)
      ).length;

      return {
        project,
        score: matchingTagsCount,
      };
    })
    .sort((a, b) => {
      // Sort by relevance score (higher first), then by sorting field
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const sortingA = a.project.metadata.sorting || 0;
      const sortingB = b.project.metadata.sorting || 0;
      return sortingA - sortingB;
    })
    .map((item) => item.project);

  // Apply limit if specified
  if (limit && limit > 0) {
    return projectsWithScores.slice(0, limit);
  }

  return projectsWithScores;
}
