"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Home, FolderKanban, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/components/motion";

const quickLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/blog", label: "Blog", icon: BookOpen },
];

export function NotFoundContent() {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center py-16 lg:py-24 px-4">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-10"
        >
          <motion.div variants={fadeUp} className="space-y-6">
            <p className="label-mono text-muted-foreground">Error 404</p>

            <h1 className="text-[clamp(5rem,18vw,9rem)] font-bold tracking-tight text-foreground leading-[0.9]">
              {"404".split("").map((char, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1 + index * 0.12,
                  }}
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                className="inline-block text-muted-foreground/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                .
              </motion.span>
            </h1>

            <div className="space-y-4 max-w-lg">
              <p className="text-xl md:text-2xl font-medium tracking-tight text-foreground">
                This page doesn&apos;t exist.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The link may be broken, or the page may have moved. Either way,
                you&apos;re not lost — just off the map.
              </p>
            </div>
          </motion.div>

          {pathname && pathname !== "/404" && (
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card/60 px-4 py-2 label-mono text-xs text-muted-foreground">
                <span>Requested</span>
                <code className="text-foreground">{pathname}</code>
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="label-mono px-6">
              <Link href="/">
                Back to home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="label-mono border-foreground/30 bg-transparent hover:bg-foreground hover:text-background px-6"
            >
              <Link href="/projects">Browse projects</Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeUp}>
            <p className="label-mono text-muted-foreground mb-4">Quick links</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-4 transition-colors hover:border-foreground/20 hover:bg-card"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition-colors group-hover:border-foreground/20 group-hover:text-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="label-mono text-sm text-foreground">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
