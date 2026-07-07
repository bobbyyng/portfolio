import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import {
  getProjectBySlug,
  getAllProjectSlugs,
  getProjectDescription,
} from "@/lib/projects";
import { extractHeadings } from "@/lib/blog";
import { createPageMetadata } from "@/lib/site";
import { TableOfContents } from "@/components/table-of-contents";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createMDXComponents } from "@/components/mdx-components";
import remarkGfm from "remark-gfm";
import { ProjectCarousel } from "@/components/project-carousel";
import { Reveal } from "@/components/motion";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  const { title, tags, images } = project.metadata;
  const description = getProjectDescription(project) ?? title;
  const image = Array.isArray(images)
    ? images[0]
    : typeof images === "string"
      ? images
      : undefined;

  return createPageMetadata({
    title,
    description,
    path: `/projects/${slug}`,
    image,
    imageAlt: title,
    tags,
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const images = Array.isArray(project.metadata.images)
    ? project.metadata.images
    : typeof project.metadata.images === "string"
    ? [project.metadata.images]
    : [];

  const headings = extractHeadings(project.content);
  const description = getProjectDescription(project);

  return (
    <div className="min-h-screen py-16 lg:py-20 px-4">
      <div className="max-w-6xl mx-auto flex gap-8 items-start">
      <Reveal className="flex-1 min-w-0">
      <article>
        <Link
          href="/projects"
          className="label-mono inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          All projects
        </Link>
        <header className="mb-10 pb-10 border-b border-border">
          {(project.metadata.startDate || project.metadata.endDate) && (
            <p className="label-mono flex items-center gap-2 text-muted-foreground mb-4">
              <Calendar className="h-3.5 w-3.5" />
              {[project.metadata.startDate, project.metadata.endDate]
                .filter(Boolean)
                .join(" — ")}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-5 leading-[1.05]">
            {project.metadata.title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-7 max-w-2xl">
              {description}
            </p>
          )}
          {project.metadata.tags && project.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="label-mono rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Project Images Carousel */}
        {images.length > 0 && (
          <ProjectCarousel images={images} title={project.metadata.title} />
        )}

        <div className="max-w-[72ch]">
          <MDXRemote
            source={project.content}
            components={createMDXComponents()}
            options={{
              blockJS: false,
              mdxOptions: { remarkPlugins: [remarkGfm] },
            }}
          />
        </div>
      </article>
      </Reveal>

      {headings.length > 0 && (
        <aside className="hidden xl:block w-56 shrink-0 sticky top-24">
          <TableOfContents headings={headings} />
        </aside>
      )}
      </div>
    </div>
  );
}

