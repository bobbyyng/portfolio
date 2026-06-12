import { getAllBlogPosts } from "@/lib/blog";
import { BlogFilter } from "@/components/blog-filter";
import { Reveal } from "@/components/motion";

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPage() {
  const posts = getAllBlogPosts();

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
    <div className="min-h-screen py-16 lg:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <header className="mb-16">
            <p className="label-mono text-muted-foreground mb-4">Writing</p>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
              Blog.
            </h1>
            <p className="text-muted-foreground max-w-md">
              Study notes, learning journal, and technical insights
            </p>
          </header>
        </Reveal>

        <BlogFilter posts={postsData} />
      </div>

    </div>
  );
}
