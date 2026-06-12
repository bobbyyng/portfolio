"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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
    { href: "/blog", label: "Blog" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between relative">
        {/* Left: Logo with Avatar */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          onClick={closeMenu}
        >
          <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-foreground flex-shrink-0">
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
                <span className="text-sm font-semibold text-background">
                  {profile.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <span className="hidden sm:inline label-mono font-semibold text-foreground">
            {profile.name}
          </span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "label-mono transition-colors duration-300",
                isActive(link.href)
                  ? "text-foreground underline underline-offset-8 decoration-2"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Availability pill & socials */}
        <div className="hidden lg:flex items-center gap-4 ml-auto">
          <Link
            href={profile.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </Link>
          <Link
            href={profile.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </Link>
          {profile.available ? (
            <Link
              href={`mailto:${profile.contact.email}`}
              className="label-mono flex items-center gap-2 rounded-full border border-foreground/30 px-4 py-2 text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
              Available for hire
            </Link>
          ) : (
            <Button asChild size="sm" className="rounded-md label-mono">
              <Link href={`mailto:${profile.contact.email}`}>Email Me</Link>
            </Button>
          )}
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
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    "block label-mono transition-colors py-2",
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
                <Button asChild className="w-full rounded-md label-mono">
                  <Link href={`mailto:${profile.contact.email}`} onClick={closeMenu}>
                    Get in touch →
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
