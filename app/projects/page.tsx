import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import { ChatButton } from "@/components/chat-button";

export default function ProjectsPage() {
  const projects = getAllProjects();


  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
            Projects
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            A collection of my work and projects
          </p>
        </header>

        {projects.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-8 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              No projects yet. Add MDX files to <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">content/projects/</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                  {project.metadata.title}
                </h2>
                {project.metadata.description && (
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
                    {project.metadata.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {project.metadata.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-700 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <ChatButton />
    </div>
  );
}

