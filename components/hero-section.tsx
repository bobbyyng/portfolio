"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import profile from "@/content/profile.json";
import {
  Mail,
  Linkedin,
  Github,
  Download,
  MapPin,
  Briefcase,
  Circle,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

export function HeroSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Section - Text Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3">
              {profile.name}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              {profile.title}
            </p>
          </div>

          {/* Key Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{profile.experience}</span>
            </div>
            {profile.available && (
              <div className="flex items-center gap-2">
                <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                <span>Available for hire</span>
              </div>
            )}
          </div>

          {/* Contact Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/chat">
                <MessageCircle className="h-4 w-4" />
                Chat with AI Agent
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`mailto:${profile.contact.email}`}>
                <Mail className="h-4 w-4" />
                Email Me
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={profile.contact.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" />
                Download CV
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Section - Profile Picture */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md aspect-square">
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              {!imageError ? (
                <Image
                  src="/profile.jpg"
                  alt={profile.name}
                  fill
                  className="object-cover"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-4xl text-muted-foreground">
                    {profile.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
