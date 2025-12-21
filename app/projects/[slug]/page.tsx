import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createMDXComponents } from "@/components/mdx-components";
import { ProjectCarousel } from "@/components/project-carousel";

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
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-4">
      <article className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-8 md:p-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
            {project.metadata.title}
          </h1>
          {project.metadata.description && (
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-4">
              {project.metadata.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 text-sm text-zinc-500 dark:text-zinc-500">
            {project.metadata.tags && project.metadata.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex flex-wrap gap-2">
                  {project.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>
        
        {/* Project Images Carousel */}
        {images.length > 0 && (
          <ProjectCarousel images={images} title={project.metadata.title} />
        )}

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <MDXRemote source={project.content} components={createMDXComponents()} />
        </div>
      </article>
    </div>
  );
}

