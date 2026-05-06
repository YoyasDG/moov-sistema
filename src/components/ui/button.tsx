"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[1.35rem] font-medium tracking-[0.01em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default:
          "bg-white text-primary border shadow-[0_6px_18px_-8px_rgba(16,16,24,0.06)] hover:brightness-102",
        secondary:
          "surface-panel text-primary hover:border-primary/12 hover:bg-white/98",
        ghost:
          "text-foreground hover:bg-white/98 hover:text-primary",
        outline:
          "border border-[rgba(16,16,24,0.06)] bg-white text-foreground hover:border-[rgba(103,51,151,0.08)] dark:bg-white/5",
        danger:
          "bg-white text-foreground border shadow-[0_6px_18px_-8px_rgba(16,16,24,0.06)] hover:brightness-102",
      },
      size: {
        default: "h-11 px-5 text-[0.95rem]",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 rounded-[1rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
