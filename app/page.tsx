import { HeroSection } from "@/components/hero-section";
import { ContentSection } from "@/components/content-section";
import { ChatButton } from "@/components/chat-button";

export default function Home() {
  return (
    <main>
      <HeroSection />

      <ContentSection />
      
      <ChatButton />
    </main>
  );
}
