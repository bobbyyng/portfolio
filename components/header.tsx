"use client";

import { useEffect, useState } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Hysteresis: collapse and expand at different heights, otherwise the
    // header's own height change shifts the page and re-triggers the threshold
    const onScroll = () =>
      setIsScrolled((prev) => (prev ? window.scrollY > 24 : window.scrollY > 80));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Expanded while menu is open so the dropdown doesn't fight the collapse
  const collapsed = isScrolled && !isMenuOpen;

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
    <header className="sticky top-0 z-50 w-full lg:top-4 lg:px-4">
      <div
        className={cn(
          "mx-auto border-b border-border/60 bg-background/60 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5 lg:rounded-full lg:border lg:border-border/60 lg:bg-background/55 supports-[backdrop-filter]:lg:bg-background/45 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          collapsed ? "lg:max-w-sm" : "lg:max-w-4xl"
        )}
      >
      <div
        className={cn(
          "flex items-center px-4 lg:px-6 justify-between relative transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          collapsed ? "h-12" : "h-16"
        )}
      >
        {/* Left: Logo with Avatar */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 hover:opacity-80 transition-all duration-300",
            collapsed && "lg:opacity-0 lg:scale-75 lg:pointer-events-none lg:w-0 lg:overflow-hidden"
          )}
          onClick={closeMenu}
        >
          <div
            className={cn(
              "relative rounded-full overflow-hidden bg-foreground flex-shrink-0 transition-all duration-500",
              collapsed ? "w-7 h-7" : "w-9 h-9"
            )}
          >
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
          <span
            className={cn(
              "hidden sm:inline label-mono font-semibold text-foreground transition-all duration-300 overflow-hidden whitespace-nowrap max-w-[200px]",
              collapsed && "lg:opacity-0 lg:max-w-0"
            )}
          >
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
        <div
          className={cn(
            "hidden lg:flex items-center gap-4 ml-auto transition-all duration-300",
            collapsed && "lg:opacity-0 lg:scale-75 lg:pointer-events-none lg:w-0 lg:overflow-hidden lg:ml-0"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-4 transition-all duration-300 overflow-hidden",
              collapsed ? "opacity-0 max-w-0 gap-0" : "max-w-[100px]"
            )}
          >
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
          </div>
          {profile.available ? (
            <span className="label-mono flex items-center gap-2 text-muted-foreground whitespace-nowrap">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              Open to work
            </span>
          ) : (
            <Button asChild size="sm" className="label-mono">
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
            className="lg:hidden border-t border-border/60 overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-4">
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
                {profile.available && (
                  <span className="label-mono flex items-center gap-2 text-muted-foreground py-3">
                    <span className="relative flex w-2 h-2">
                      <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                    </span>
                    Open to work
                  </span>
                )}
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
                <Button asChild className="w-full label-mono">
                  <Link href={`mailto:${profile.contact.email}`} onClick={closeMenu}>
                    Get in touch →
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </header>
  );
}
