
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 hover:shadow-lg",
        outline:
          "border border-input bg-background hover:bg-hc-soft hover:text-hc-primary hover:border-hc-primary hover:scale-105",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:scale-105",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105",
        // Healing-focused therapeutic variants
        "hc-primary": "bg-hc-primary text-white hover:bg-hc-primary/90 hover:scale-105 hover:shadow-xl",
        "hc-accent": "bg-hc-accent text-slate-800 hover:bg-hc-accent/90 hover:scale-105 hover:shadow-xl",
        "hc-secondary": "bg-hc-secondary text-white hover:bg-hc-secondary/90 hover:scale-105 hover:shadow-lg",
        "hc-warm": "bg-hc-warm text-slate-800 hover:bg-hc-warm/90 hover:scale-105 hover:shadow-lg",
        "hc-success": "bg-hc-success text-white hover:bg-hc-success/90 hover:scale-105 hover:shadow-lg",
        "hc-soft": "bg-hc-soft text-slate-800 hover:bg-hc-soft/80 hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // Add custom size
        xl: "h-14 rounded-xl px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
