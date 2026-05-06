import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-32 w-full rounded-[1.45rem] border bg-white/78 px-4 py-3 text-[0.98rem] outline-none transition-all duration-300 placeholder:text-muted-foreground focus:-translate-y-0.5 focus:border-primary/35 focus:ring-4 focus:ring-primary/10 dark:bg-white/5",
        className,
      )}
      {...props}
    />
  );
}
