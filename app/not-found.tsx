import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found-content";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Page Not Found",
  description: "The page you are looking for does not exist or may have moved.",
  path: "/404",
});

export default function NotFound() {
  return <NotFoundContent />;
}
