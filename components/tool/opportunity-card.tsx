"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Briefcase, User, Mail, CheckCircle2, XCircle } from "lucide-react";

interface OpportunityCardProps {
  companyName: string;
  roleDescription: string;
  contactName: string;
  contactEmail: string;
  timestamp?: string;
  success?: boolean;
}

export function OpportunityCard({
  companyName,
  roleDescription,
  contactName,
  contactEmail,
  timestamp,
  success = true,
}: OpportunityCardProps) {
  const handleEmailClick = () => {
    window.location.href = `mailto:${contactEmail}`;
  };

  const formatTimestamp = (ts?: string) => {
    if (!ts) return "";
    try {
      const date = new Date(ts);
      return date.toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return ts;
    }
  };

  return (
    <Card className="mt-3 max-w-md border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            工作機會
          </CardTitle>
          {success ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              <CheckCircle2 className="size-3 mr-1" />
              已記錄
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="size-3 mr-1" />
              失敗
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Building2 className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">公司名稱</p>
              <p className="text-sm font-medium break-words">{companyName}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Briefcase className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">職位描述</p>
              <p className="text-sm break-words">{roleDescription}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <User className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">聯絡人</p>
              <p className="text-sm break-words">{contactName}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Mail className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <button
                onClick={handleEmailClick}
                className="text-sm text-primary hover:underline break-all text-left"
              >
                {contactEmail}
              </button>
            </div>
          </div>

          {timestamp && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                記錄時間: {formatTimestamp(timestamp)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

