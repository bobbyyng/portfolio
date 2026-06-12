"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/components/motion";
import profile from "@/content/profile.json";
import carouselData from "@/content/carousel.json";
import {
  Mail,
  Linkedin,
  Github,
  Download,
  MapPin,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

type CarouselItemType = {
  type: "image" | "project";
  url?: string;
  projectSlug?: string;
  alt?: string;
  position: number;
};

export function HeroSection() {
  const [imageError, setImageError] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  // Sort carousel items by position
  const sortedItems = ([...carouselData] as CarouselItemType[]).sort(
    (a, b) => a.position - b.position
  );

  // Helper function to get project data by slug
  const getProjectBySlug = (slug: string) => {
    return profile.selectedProjects?.find((p) => p.slug === slug);
  };

  // Auto scroll functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        // Loop back to the first slide
        api.scrollTo(0);
      }
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Split the name so each word sits on its own line, Krobyte-style
  const nameLines = profile.name.split(" ");

  return (
    <section className="container mx-auto px-4 pt-10 pb-16 lg:pt-24 lg:pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Section - Text Content */}
        <motion.div
          className="space-y-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.95] mb-6">
              {nameLines.map((line, lineIndex) => {
                const text =
                  lineIndex === nameLines.length - 1 ? `${line}.` : line;
                return (
                  <span key={lineIndex} className="block overflow-hidden pb-[0.08em]">
                    {text.split("").map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        className="inline-block"
                        initial={{ y: "110%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: 0.7,
                          ease: [0.22, 1, 0.36, 1],
                          delay: 0.15 + lineIndex * 0.18 + charIndex * 0.035,
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                );
              })}
            </h1>
            <motion.p
              className="label-mono text-muted-foreground"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
            >
              {profile.title}
            </motion.p>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-5 max-w-md">
            <p className="text-muted-foreground leading-loose">
              {profile.summaryShort ?? profile.summary}
            </p>
            {profile.highlights && (
              <div className="flex flex-wrap gap-2">
                {profile.highlights.map((tag) => (
                  <span
                    key={tag}
                    className="label-mono rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Key Details */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-5 label-mono text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location}
            </span>
            <span className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5" />
              {profile.experience}
            </span>
          </motion.div>

          {/* Contact Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3"
          >
            <Button asChild size="lg" className="label-mono px-6 w-full sm:w-auto">
              <Link href={`mailto:${profile.contact.email}`}>
                Get in touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              size="lg"
              className="label-mono border-foreground/30 bg-transparent hover:bg-foreground hover:text-background px-6 w-full sm:w-auto"
            >
              <Link
                href={profile.contact.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" />
                Download CV
              </Link>
            </Button>
            <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-4 pt-2 sm:pt-0 sm:pl-2">
              <Link
                href={`mailto:${profile.contact.email}`}
                aria-label="Email"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
              <Link
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Section - Dark panel with carousel */}
        <motion.div
          className="flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <div className="relative w-full max-w-lg">
            <Carousel className="w-full" setApi={setApi}>
              <CarouselContent>
                {sortedItems.map((item: CarouselItemType, index: number) => {
                  if (item.type === "image" && item.url) {
                    return (
                      <CarouselItem key={index}>
                        <div className="relative w-full aspect-square overflow-hidden">
                          <Image
                            src={item.url}
                            alt={item.alt || profile.name}
                            fill
                            className="object-cover mix-blend-multiply [mask-image:radial-gradient(ellipse_75%_75%_at_center,black_55%,transparent_100%)]"
                            priority={index === 0}
                            onError={() => {
                              if (index === 0) setImageError(true);
                            }}
                          />
                          {imageError && index === 0 && (
                            <div className="flex items-center justify-center w-full h-full">
                              <span className="text-4xl text-muted-foreground">
                                {profile.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    );
                  } else if (item.type === "project" && item.projectSlug) {
                    const project = getProjectBySlug(item.projectSlug);
                    if (!project) return null;

                    return (
                      <CarouselItem key={index}>
                        <div className="space-y-3 p-8 aspect-square flex flex-col justify-center text-foreground">
                          <div className="space-y-3">
                            <p className="label-mono text-muted-foreground">
                              {project.category}
                            </p>
                            <h3 className="text-2xl font-semibold tracking-tight">
                              {project.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-4">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-x-3 gap-y-1">
                              {project.technologies?.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="label-mono text-muted-foreground"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          {project.slug && (
                            <Link
                              href={`/projects/${project.slug}`}
                              className="label-mono inline-flex items-center gap-2 text-foreground hover:gap-3 transition-all pt-3"
                            >
                              View details
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </CarouselItem>
                    );
                  }
                  return null;
                })}
              </CarouselContent>
              {sortedItems.length > 1 && (
                <>
                  <CarouselPrevious className="left-0 bg-transparent border-foreground/20 text-foreground/60 hover:bg-foreground hover:text-background" />
                  <CarouselNext className="right-0 bg-transparent border-foreground/20 text-foreground/60 hover:bg-foreground hover:text-background" />
                </>
              )}
            </Carousel>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
