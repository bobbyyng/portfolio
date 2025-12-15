"use client";

import profile from "@/content/profile.json";
import { Badge } from "@/components/ui/badge";

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

export function ContentSection() {
  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-12">
          <ProfessionalSummary />
          <Education />
        </div>
        <div className="col-span-12 lg:col-span-4">2</div>
      </div>
    </section>
  );
}
