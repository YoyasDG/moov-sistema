"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatsCard({
  label,
  value,
  helper,
  href,
  onClick,
}: {
  label: string;
  value: string;
  helper: string;
  href?: string;
  onClick?: () => void;
}) {
  const root = (
    <Card className="grain overflow-hidden transition-transform will-change-transform">
      <CardContent
        onClick={onClick}
        className="relative flex min-h-52 flex-col justify-between gap-6 p-7 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] cursor-pointer"
        role={href || onClick ? "button" : undefined}
      >
        <div className="flex items-center justify-between">
          <p className="max-w-[14ch] text-sm uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <div className="rounded-[1rem] bg-accent/28 p-3 text-primary shadow-[0_6px_18px_-8px_rgba(103,51,151,0.08)]">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-heading text-5xl leading-none tracking-tight">{value}</p>
          <p className="font-subtitle text-lg text-muted-foreground">{helper}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className="block">
        {root}
      </Link>
    );
  }

  return root;
}
