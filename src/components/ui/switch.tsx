import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("inline-flex items-center gap-3", className)}>
      <input type="checkbox" className="sr-only peer" {...props} />
      <span className="w-11 h-6 rounded-full bg-muted-foreground/18 ring-0 transition-colors duration-200 ease-in-out peer-checked:bg-primary peer-focus-visible:outline-none peer-focus-visible:ring-4 peer-focus-visible:ring-primary/10" />
    </label>
  );
}
