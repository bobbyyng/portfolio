"use client";

import profile from "@/content/profile.json";

function ProfessionalSummary() {
  return (
    <div className="space-y-4">
    <div>
      <h2 className="text-2xl font-bold text-foreground uppercase tracking-wide mb-2">
        Professional Summary
      </h2>
      <div className="w-full h-px bg-border"></div>
    </div>
    <p className="text-muted-foreground leading-relaxed">
      {profile.summary}
    </p>
  </div>
  );
}

export function ContentSection() {
  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-12">
          <ProfessionalSummary />
        </div>
        <div className="col-span-12 lg:col-span-4">2</div>
      </div>
    </section>
  );
}
