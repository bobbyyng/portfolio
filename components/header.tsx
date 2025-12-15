"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import profile from "@/content/profile.json";
import { Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/" className="font-bold text-xl">
          {profile.name}
        </Link>
        <div className="flex items-center gap-10">
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === "/"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              CV
            </Link>
            <Link
              href="/projects"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === "/projects" || pathname?.startsWith("/projects/")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Projects
            </Link>
          </nav>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-4">
            <Link href={profile.contact.github} target="_blank">
              <Github className="w-6 h-6 transition-opacity hover:opacity-80" />
            </Link>
            <Link href={profile.contact.linkedin} target="_blank">
              <Linkedin className="w-6 h-6 transition-opacity hover:opacity-80" />
            </Link>
            <Button asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
