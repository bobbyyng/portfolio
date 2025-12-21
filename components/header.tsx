"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import profile from "@/content/profile.json";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { href: "/", label: "CV" },
    { href: "/projects", label: "Projects" },
    { href: "/chat", label: "AI Portfolio Agent" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between relative">
        {/* Left: Logo with Avatar */}
        <Link
          href="/"
          className="flex items-center gap-3 font-bold text-xl hover:opacity-80 transition-opacity"
          onClick={closeMenu}
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {!imageError ? (
              <Image
                src="/profile.jpg"
                alt={profile.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-sm font-semibold text-muted-foreground">
                  {profile.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <span className="hidden sm:inline">{profile.name}</span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Social Icons & Contact Button */}
        <div className="hidden lg:flex items-center gap-4 ml-auto">
          <Link
            href={profile.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-6 h-6" />
          </Link>
          <Link
            href={profile.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin className="w-6 h-6" />
          </Link>
          <Button asChild>
            <Link href={`mailto:${profile.contact.email}`}>Email Me</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={cn(
                  "block text-sm font-medium transition-colors py-2",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-4 pb-4">
                <Link
                  href={profile.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-6 h-6" />
                </Link>
                <Link
                  href={profile.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </Link>
              </div>
              <Button asChild className="w-full">
                <Link href="/contact" onClick={closeMenu}>
                  Contact
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
