"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import profile from "@/content/profile.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function ProfessionalSummary() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground uppercase tracking-wide mb-2">
          Professional Summary
        </h2>
        <div className="w-full h-px bg-border"></div>
      </div>
      <p className="text-muted-foreground leading-relaxed">{profile.summary}</p>
    </div>
  );
}

function Education() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground uppercase tracking-wide mb-2">
          Education
        </h2>
        <div className="w-full h-px bg-border"></div>
      </div>
      <div className="space-y-6">
        {profile.education?.map((edu, index) => (
          <div key={index} className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1 text-md">
                {edu.institution}
              </h3>
              <p className="text-muted-foreground text-sm">{edu.degree}</p>
            </div>
            <div>
              <Badge variant="secondary" className="text-md">
                {edu.period}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectedProjects() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground uppercase tracking-wide">
          Selected Projects
        </h2>
        <Link
          href="/projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="w-full h-px bg-border"></div>
      <div className="space-y-6">
        {profile.selectedProjects?.map((project, index) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-lg font-semibold text-foreground">
                {project.title}
              </h3>
              <Badge variant="secondary">{project.category}</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech, techIndex) => (
                <Badge key={techIndex} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
            {project.slug && (
              <Link href={`/projects/${project.slug}`}>
                <Button variant="outline" size="sm" className="mt-2">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TechnicalSkills() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground uppercase tracking-wide mb-2">
          Technical Skills
        </h2>
        <div className="w-full h-px bg-border"></div>
      </div>
      <div className="space-y-6">
        {profile.skills &&
          Object.entries(profile.skills).map(([category, skills]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground uppercase">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function Languages() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground uppercase tracking-wide mb-2">
          Languages
        </h2>
        <div className="w-full h-px bg-border"></div>
      </div>
      <div className="space-y-4">
        {profile.languages?.map((language, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="font-medium text-foreground">{language.name}</span>
            <span className="text-sm text-muted-foreground">
              {language.proficiency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContentSection() {
  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-12">
          <ProfessionalSummary />
          <Education />
          <SelectedProjects />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-12">
          <TechnicalSkills />
          <Languages />
        </div>
      </div>
    </section>
  );
}
