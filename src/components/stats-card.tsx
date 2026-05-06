import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatsCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="grain overflow-hidden">
      <CardContent className="relative flex min-h-52 flex-col justify-between gap-6 p-7">
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
}
