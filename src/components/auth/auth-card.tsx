"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AuthCard({ title, subtitle, children, className }: { title?: string; subtitle?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full max-w-md mx-auto px-4", className)}>
      <Card className="rounded-[1.2rem]">
        <CardHeader className="px-6 pt-6">
          {title ? <h1 className="font-heading text-2xl text-primary">{title}</h1> : null}
          {subtitle ? <p className="mt-1 text-muted-foreground">{subtitle}</p> : null}
        </CardHeader>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
