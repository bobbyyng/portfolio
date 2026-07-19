import { BlogLangProvider } from "@/components/blog-lang";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BlogLangProvider>{children}</BlogLangProvider>;
}
