"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import profile from "@/content/profile.json";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";

function SectionHeading({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-foreground/20 pt-5">
      <p className="label-mono text-muted-foreground mb-2">{number}</p>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        {children}
      </h2>
    </div>
  );
}

function ProfessionalSummary() {
  return (
    <Reveal className="space-y-5">
      <SectionHeading number="01">Professional Summary</SectionHeading>
      <p className="text-muted-foreground leading-relaxed text-lg text-justify">
        {profile.summary}
      </p>
    </Reveal>
  );
}

function WorkExperience() {
  return (
    <div className="space-y-8">
      <Reveal>
        <SectionHeading number="02">Work Experience</SectionHeading>
      </Reveal>
      <RevealGroup className="divide-y divide-border">
        {profile.workExperience?.map((work, index) => (
          <RevealItem key={index} className="space-y-4 py-7 first:pt-0">
            <div className="flex justify-between items-baseline gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold tracking-tight text-foreground mb-1">
                  {work.company}
                </h3>
                <p className="text-muted-foreground text-sm">{work.position}</p>
                {work.previousPositions && work.previousPositions.length > 0 && (
                  <p className="text-muted-foreground text-xs mt-1">
                    Previously: {work.previousPositions.join(", ")}
                  </p>
                )}
              </div>
              <span className="label-mono text-muted-foreground whitespace-nowrap">
                {work.period}
              </span>
            </div>
            {work.description && work.description.length > 0 && (
              <ul className="space-y-2.5 list-none pl-0">
                {work.description.map((desc, descIndex) => (
                  <li
                    key={descIndex}
                    className="text-muted-foreground text-sm leading-relaxed flex items-start gap-3"
                  >
                    <span className="text-foreground/50 text-xs mt-1.5 shrink-0">
                      —
                    </span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            )}
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

function Education() {
  return (
    <div className="space-y-8">
      <Reveal>
        <SectionHeading number="03">Education</SectionHeading>
      </Reveal>
      <RevealGroup className="divide-y divide-border">
        {profile.education?.map((edu, index) => (
          <RevealItem
            key={index}
            className="flex justify-between items-baseline gap-4 py-6 first:pt-0"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-1">
                {edu.institution}
              </h3>
              <p className="text-muted-foreground text-sm">{edu.degree}</p>
            </div>
            <span className="label-mono text-muted-foreground whitespace-nowrap">
              {edu.period}
            </span>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

function SelectedProjects() {
  return (
    <div className="space-y-8">
      <Reveal className="flex justify-between items-end gap-4">
        <SectionHeading number="04">Selected Projects</SectionHeading>
        <Link
          href="/projects"
          className="label-mono text-foreground hover:gap-3 transition-all flex items-center gap-2 whitespace-nowrap pb-1"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
      <RevealGroup className="divide-y divide-border">
        {profile.selectedProjects?.map((project, index) => {
          const projectNum = project.slug?.match(/^(\d+)\./)?.[1];
          const coverSrc = projectNum
            ? `/projects/covers/project_${projectNum}_cover.png`
            : null;
          return (
          <RevealItem key={index} className="py-7 first:pt-0 space-y-4">
            {/* Mobile: cover on top; md+: side by side */}
            {coverSrc && (
              <div className="md:hidden w-full overflow-hidden rounded-lg border border-border aspect-video relative">
                <Image
                  src={coverSrc}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            )}
            <div className="flex gap-5 items-start">
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1">
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                    {project.title}
                  </h3>
                  <span className="label-mono text-muted-foreground whitespace-nowrap">
                    {project.category}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="label-mono rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.slug && (
                  <Link href={`/projects/${project.slug}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 label-mono border-foreground/30 bg-transparent hover:bg-foreground hover:text-background"
                    >
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
              {coverSrc && (
                <div className="hidden md:block shrink-0 w-44 lg:w-52 overflow-hidden rounded-lg border border-border aspect-video relative">
                  <Image
                    src={coverSrc}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 176px, 208px"
                  />
                </div>
              )}
            </div>
          </RevealItem>
          );
        })}
      </RevealGroup>
    </div>
  );
}

function TechnicalSkills() {
  return (
    <Reveal className="space-y-6">
      <SectionHeading number="05">Technical Skills</SectionHeading>
      <div className="space-y-6">
        {profile.skills &&
          Object.entries(profile.skills).map(([category, skills]) => (
            <div key={category} className="space-y-2">
              <h3 className="label-mono text-foreground">{category}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {skills.join(" · ")}
              </p>
            </div>
          ))}
      </div>
    </Reveal>
  );
}

function Languages() {
  return (
    <Reveal className="space-y-6">
      <SectionHeading number="06">Languages</SectionHeading>
      <div className="divide-y divide-border">
        {profile.languages?.map((language, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-3 first:pt-0"
          >
            <span className="font-medium text-foreground">{language.name}</span>
            <span className="label-mono text-muted-foreground">
              {language.proficiency}
            </span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export function ContentSection() {
  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-8 space-y-20">
          <ProfessionalSummary />
          <WorkExperience />
          <Education />
          <SelectedProjects />
        </div>
        <div className="lg:col-span-4 space-y-20">
          <TechnicalSkills />
          <Languages />
        </div>
      </div>
    </section>
  );
}
