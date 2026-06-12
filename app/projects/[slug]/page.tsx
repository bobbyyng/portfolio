import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects";
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

  return (
    <div className="min-h-screen py-16 lg:py-20 px-4">
      <Reveal className="max-w-4xl mx-auto">
      <article>
        <header className="mb-10 pb-10 border-b border-foreground/20">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
            {project.metadata.title}
          </h1>
          {project.metadata.description && (
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
              {project.metadata.description}
            </p>
          )}
          {project.metadata.tags && project.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 label-mono text-muted-foreground">
              {project.metadata.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
        </header>

        {/* Project Images Carousel */}
        {images.length > 0 && (
          <ProjectCarousel images={images} title={project.metadata.title} />
        )}

        <div className="prose prose-zinc max-w-none">
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
    </div>
  );
}

