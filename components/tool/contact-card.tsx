"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Linkedin, Github, FileText } from "lucide-react";
import profile from "@/content/profile.json";

export function ContactCard() {
  const contactInfo = profile.contact;

  const handleEmailClick = () => {
    if (contactInfo.email) {
      window.location.href = `mailto:${contactInfo.email}`;
    }
  };

  const handlePhoneClick = () => {
    if (contactInfo.phone) {
      window.location.href = `tel:${contactInfo.phone.replace(/\s/g, "")}`;
    }
  };

  const handleLinkedInClick = () => {
    if (contactInfo.linkedin) {
      window.open(contactInfo.linkedin, "_blank", "noopener,noreferrer");
    }
  };

  const handleGithubClick = () => {
    if (contactInfo.github) {
      window.open(contactInfo.github, "_blank", "noopener,noreferrer");
    }
  };

  const handleCVClick = () => {
    if (contactInfo.cvUrl) {
      window.open(contactInfo.cvUrl, "_blank", "noopener,noreferrer");
    }
  };

  // All contact buttons rendered in a single row
  return (
    <Card className="mt-3 max-w-md border-2 shadow-lg py-4 px-0">
      <CardContent>
        <div className="grid grid-cols-5 gap-4 justify-items-center">
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              size="icon"
              className="mb-1 rounded-full size-12 flex justify-center items-center"
              onClick={handleEmailClick}
              aria-label="Email"
            >
              <Mail className="size-6" />
            </Button>
            <span className="text-xs text-muted-foreground">Email</span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              size="icon"
              className="mb-1 rounded-full size-12 flex justify-center items-center"
              onClick={handlePhoneClick}
              aria-label="電話"
            >
              <Phone className="size-6" />
            </Button>
            <span className="text-xs text-muted-foreground">電話</span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              size="icon"
              className="mb-1 rounded-full size-12 flex justify-center items-center"
              onClick={handleLinkedInClick}
              aria-label="LinkedIn"
            >
              <Linkedin className="size-6" />
            </Button>
            <span className="text-xs text-muted-foreground">LinkedIn</span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              size="icon"
              className="mb-1 rounded-full size-12 flex justify-center items-center"
              onClick={handleGithubClick}
              aria-label="GitHub"
            >
              <Github className="size-6" />
            </Button>
            <span className="text-xs text-muted-foreground">GitHub</span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              variant="default"
              size="icon"
              className="mb-1 rounded-full size-12 flex justify-center items-center bg-primary hover:bg-primary/90 transition-colors"
              onClick={handleCVClick}
              aria-label="下載我的 CV"
            >
              <FileText className="size-6" />
            </Button>
            <span className="text-xs text-muted-foreground">CV</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
