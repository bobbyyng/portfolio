import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createMDXComponents } from "@/components/mdx-components";
import { Calendar, ArrowLeft, Clock } from "lucide-react";

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

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const readTime = estimateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {post.metadata.coverImage && (
        <div className="relative w-full h-64 sm:h-80 md:h-96">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.metadata.coverImage}
            alt={post.metadata.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-black via-transparent to-transparent" />
        </div>
      )}

      <div className="py-8 md:py-12 px-4">
        <article className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-8 md:p-12 -mt-16 relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <header className="mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-zinc-50 mb-4">
              {post.metadata.title}
            </h1>

            {post.metadata.summary && (
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-5">
                {post.metadata.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
              {formatDate(post.metadata.date) && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.metadata.date)}
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readTime} min read
              </span>

              {post.metadata.tags && post.metadata.tags.length > 0 && (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  <div className="flex flex-wrap gap-2">
                    {post.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-medium"
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
            <MDXRemote
              source={post.content}
              components={createMDXComponents()}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
