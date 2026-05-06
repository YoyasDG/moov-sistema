import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-5 md:flex-row md:items-end md:justify-between", className)}>
      <div className="space-y-3">
        {eyebrow ? <p className="font-subtitle text-lg text-primary">{eyebrow}</p> : null}
        <h1 className="font-heading text-5xl leading-[0.92] text-balance md:text-6xl">{title}</h1>
        {description ? <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
