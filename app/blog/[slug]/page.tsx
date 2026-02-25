import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createMDXComponents } from "@/components/mdx-components";
import { Calendar, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-4">
      <article className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-8 md:p-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
            {post.metadata.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
            {formatDate(post.metadata.date) && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.metadata.date)}
              </span>
            )}

            {post.metadata.tags && post.metadata.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex flex-wrap gap-2">
                  {post.metadata.tags.map((tag) => (
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

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <MDXRemote source={post.content} components={createMDXComponents()} />
        </div>
      </article>
    </div>
  );
}
