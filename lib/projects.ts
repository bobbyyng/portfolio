import fs from "fs";
import path from "path";

export interface ProjectMetadata {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  sorting?: number;
  show?: boolean | string;
  [key: string]: string | string[] | number | boolean | undefined;
}

export interface Project {
  slug: string;
  metadata: ProjectMetadata;
  content: string;
}

const projectsDirectory = path.join(process.cwd(), "content/projects");

export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getAllProjectFileNames(): string[] {
  if (!fs.existsSync(projectsDirectory)) return [];
  return fs
    .readdirSync(projectsDirectory)
    .filter((name) => name.endsWith(".mdx"));
}

export function getAllProjectSlugs(): string[] {
  return getAllProjectFileNames()
    .map((name) => {
      const project = getProjectByFileName(name);
      return project
        ? { slug: titleToSlug(project.metadata.title), sorting: project.metadata.sorting || 0 }
        : null;
    })
    .filter((item): item is { slug: string; sorting: number } => item !== null)
    .sort((a, b) => a.sorting - b.sorting)
    .map((item) => item.slug);
}

function getProjectByFileName(fileName: string): Project | null {
  const slug = fileName.replace(/\.mdx$/, "");
  const fullPath = path.join(projectsDirectory, fileName);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return parseProjectFile(slug, fileContents);
}

export function getProjectBySlug(slug: string): Project | null {
  const fileNames = getAllProjectFileNames();
  for (const fileName of fileNames) {
    const project = getProjectByFileName(fileName);
    if (project && titleToSlug(project.metadata.title) === slug) {
      return { ...project, slug };
    }
  }
  return null;
}

function parseProjectFile(slug: string, fileContents: string): Project | null {
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
        } else if (key === "images") {
          // Parse images as comma-separated array
          metadata[key] = value.split(",").map((t) => t.trim());
        } else if (key === "sorting") {
          metadata[key] = parseInt(value, 10) || 0;
        } else if (key === "show") {
          // Parse boolean values: true, false, "true", "false", "1", "0"
          const lowerValue = value.toLowerCase();
          metadata[key] = lowerValue === "true" || lowerValue === "1";
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
    .filter((project) => {
      // Show project if 'show' field is not set (default true) or explicitly set to true
      const show = project.metadata.show;
      if (show === undefined) return true; // Default: show
      if (show === true || show === "true" || show === "1") return true;
      if (show === false || show === "false" || show === "0") return false;
      return true; // Default to show if value is unclear
    })
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

/**
 * Get all unique tags from all projects
 * @returns Array of unique tags, sorted alphabetically
 */
export function getAllProjectTags(): string[] {
  const allProjects = getAllProjects();
  const tagsSet = new Set<string>();

  allProjects.forEach((project) => {
    const projectTags = project.metadata.tags || [];
    projectTags.forEach((tag) => {
      const normalizedTag = tag.trim();
      if (normalizedTag) {
        tagsSet.add(normalizedTag);
      }
    });
  });

  return Array.from(tagsSet).sort();
}
