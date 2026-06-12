import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getAllBlogSlugs, extractHeadings } from "@/lib/blog";
import { TableOfContents } from "@/components/table-of-contents";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createMDXComponents } from "@/components/mdx-components";
import { Calendar, ArrowLeft, Clock } from "lucide-react";
import remarkGfm from "remark-gfm";
import { Reveal } from "@/components/motion";

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
  const headings = extractHeadings(post.content);

  return (
    <div className="min-h-screen">
      {post.metadata.coverImage && (
        <div className="relative w-full h-64 sm:h-80 md:h-96">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.metadata.coverImage}
            alt={post.metadata.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.962_0.004_91)] via-transparent to-transparent" />
        </div>
      )}

      <div className="py-8 md:py-14 px-4">
        <div className="max-w-6xl mx-auto flex gap-8 items-start">
          <Reveal className="flex-1 min-w-0">
          <article className="relative z-10">
          <Link
            href="/blog"
            className="label-mono inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <header className="mb-10 pb-10 border-b border-foreground/20">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
              {post.metadata.title}
            </h1>

            {post.metadata.summary && (
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                {post.metadata.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 label-mono text-muted-foreground">
              {formatDate(post.metadata.date) && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(post.metadata.date)}
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {readTime} min read
              </span>

              {post.metadata.tags && post.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {post.metadata.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </header>

          <div className="prose prose-zinc max-w-none">
            <MDXRemote
              source={post.content}
              components={createMDXComponents()}
              options={{
                // Default true strips JSX attribute expressions (<Table data={[...]} />) — keep them for MDX components
                blockJS: false,
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </div>
        </article>
          </Reveal>

          {headings.length > 0 && (
            <aside className="hidden xl:block w-56 shrink-0">
              <TableOfContents headings={headings} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
