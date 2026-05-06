import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-[1.2rem] border border-primary/12 bg-white/78 px-4 text-[0.98rem] text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:-translate-y-0.5 focus:border-primary/35 focus:ring-4 focus:ring-primary/10 dark:bg-white/5",
        className,
      )}
      {...props}
    />
  );
}
