"use client";

import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/chat");
  };

  return (
    <Button
      onClick={handleClick}
      size="icon"
      className="fixed bottom-6 right-6 z-50 rounded-full size-14 shadow-lg hover:shadow-xl transition-all hover:scale-110 bg-primary text-primary-foreground"
      aria-label="Open chat"
    >
      <MessageCircle className="size-6" />
    </Button>
  );
}

