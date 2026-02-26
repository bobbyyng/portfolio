import { getAllBlogPosts, getAllBlogTags } from "@/lib/blog";
import { ChatButton } from "@/components/chat-button";
import { BlogFilter } from "@/components/blog-filter";

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const allTags = getAllBlogTags();

  const postsData = posts.map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    date: post.metadata.date,
    tags: post.metadata.tags ?? [],
    summary: post.metadata.summary,
    coverImage: post.metadata.coverImage,
    readTime: estimateReadingTime(post.content),
  }));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-3">
            Blog
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Study notes, learning journal, and technical insights
          </p>
        </header>

        <BlogFilter posts={postsData} allTags={allTags} />
      </div>

      <ChatButton />
    </div>
  );
}
