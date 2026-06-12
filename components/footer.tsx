"use client";

import Link from "next/link";
import profile from "@/content/profile.json";
import { Github, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-foreground/20">
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Left side - Copyright */}
            <p className="label-mono text-muted-foreground">
              © {currentYear} {profile.name}
            </p>

            {/* Right side - Social Icons */}
            <div className="flex items-center gap-4">
              <Link
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href={`mailto:${profile.contact.email}`}
                className="label-mono text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                {profile.contact.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

