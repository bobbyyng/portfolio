import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts, type BlogPost } from "@/lib/blog";
import { ChatButton } from "@/components/chat-button";
import { Calendar, ArrowRight, Clock, BookOpen } from "lucide-react";

function formatDate(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

function FeaturedPost({ post }: { post: BlogPost }) {
  const readTime = estimateReadingTime(post.content);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {post.metadata.coverImage ? (
        <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden">
          <Image
            src={post.metadata.coverImage}
            alt={post.metadata.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.metadata.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
              {post.metadata.title}
            </h2>
            {post.metadata.summary && (
              <p className="text-white/80 line-clamp-2 text-sm md:text-base">
                {post.metadata.summary}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <BookOpen className="w-32 h-32 text-white" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.metadata.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
              {post.metadata.title}
            </h2>
            {post.metadata.summary && (
              <p className="text-white/80 line-clamp-2 text-sm md:text-base">
                {post.metadata.summary}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
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
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
          Read article <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  const readTime = estimateReadingTime(post.content);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {post.metadata.coverImage ? (
        <div className="relative w-full h-40 sm:h-44 overflow-hidden">
          <Image
            src={post.metadata.coverImage}
            alt={post.metadata.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <BookOpen className="w-16 h-16 text-zinc-400 dark:text-zinc-500" />
          </div>
        </div>
      )}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.metadata.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {post.metadata.title}
        </h2>

        {post.metadata.summary && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 flex-1">
            {post.metadata.summary}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            {formatDate(post.metadata.date) && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.metadata.date)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime} min
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-3">
            Blog
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Study notes, learning journal, and technical insights
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-8 text-center">
            <BookOpen className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400">
              No blog posts yet. Add MDX files to{" "}
              <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
                content/blog/
              </code>
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {featured && <FeaturedPost post={featured} />}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ChatButton />
    </div>
  );
}
