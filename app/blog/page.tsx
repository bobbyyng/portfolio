import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";
import { ChatButton } from "@/components/chat-button";
import { Calendar, ArrowRight } from "lucide-react";

function formatDate(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
            Blog
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Study notes, learning journal, and technical insights
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-8 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              No blog posts yet. Add MDX files to{" "}
              <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                content/blog/
              </code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-black dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.metadata.title}
                    </h2>
                    {formatDate(post.metadata.date) && (
                      <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap ml-4">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.metadata.date)}
                      </span>
                    )}
                  </div>

                  {post.metadata.summary && (
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {post.metadata.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.metadata.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-700 dark:text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
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
