import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-normal text-center rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80 shadow-sm hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-red-600/80 dark:hover:bg-red-600/90 dark:text-white shadow-sm hover:shadow-md",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-background/50 dark:border-border/50 dark:hover:bg-background/80 dark:hover:border-primary/50 dark:text-foreground dark:hover:text-primary shadow-sm hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary/70 dark:hover:text-secondary-foreground shadow-sm hover:shadow-md",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 dark:hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline dark:text-primary dark:hover:text-primary/80",
      },
      size: {
        default: "h-auto min-h-9 px-4 py-2 has-[>svg]:px-3 leading-tight",
        sm: "h-auto min-h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 leading-tight",
        lg: "h-auto min-h-10 rounded-md px-6 has-[>svg]:px-4 leading-tight",
        icon: "size-9 rounded-md p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };