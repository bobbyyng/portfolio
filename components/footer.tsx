"use client";

import Link from "next/link";
import profile from "@/content/profile.json";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Left side - Name and Copyright */}
            <div className="flex flex-col sm:items-start items-center gap-1">
              <p className="font-semibold text-foreground">{profile.name}</p>
              <p className="text-sm text-muted-foreground">
                © {currentYear} All rights reserved.
              </p>
            </div>

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
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

