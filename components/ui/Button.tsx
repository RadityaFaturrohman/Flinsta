"use client"

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/utils";
import { HTMLMotionProps, motion } from "framer-motion"
import React from "react";

const buttonVariants = cva(
  "text-black text-sm font-medium transition-all rounded-full flex items-center gap-0.5 justify-center hover:ring-slate-100 hover:ring-2 disabled:opacity-75 disabled:pointer-events-none disabled:grayscale disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white",
        ghost: "bg-transparent ring-0 active:bg-slate-100 hover:bg-slate-100",
        nav: "bg-black text-white hover:bg-slate-100",
        icon: "bg-slate-200 bg-opacity-0 hover:bg-opacity-80",
        raw: "bg-transparent hover:ring-0",
      },
      size: {
        default: "py-1.5 px-3",
        iconBig: "w-9 h-9",
        icon: "w-11 h-11",
        iconSmall: "w-6 h-6",
        raw: "p-0 w-0 h-0",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    }
  }
)

export interface ButtonProps
  extends HTMLMotionProps<"button">,
  VariantProps<typeof buttonVariants> {
  scaleWhileTap?: number
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, scaleWhileTap, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileTap={{ scale: scaleWhileTap ?? .95, transition: { type: 'spring', duration: .2 } }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
);
Button.displayName = "Button";

export { Button, buttonVariants }