"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/utils";
import { CustomDomComponent, HTMLMotionProps, motion } from "framer-motion"
import React from "react";
import { default as defLink } from "next/link";

const linkVariants = cva(
  "text-black text-sm font-medium transition-all duration-200 rounded-full flex items-center justify-center hover:ring-slate-100 hover:ring-2 disabled:opacity-75 disabled:pointer-events-none ",
  {
    variants: {
      variant: {
        default: "bg-white",
        ghost: "bg-transparent ring-0 active:bg-slate-100 hover:bg-slate-100",
        nav: "bg-black text-white hover:bg-slate-100",
        icon: "bg-black bg-opacity-0 hover:bg-opacity-10",
        raw: "bg-transparent border-0 border-opacity-0 outline-none ring-0 active:outline-none active:ring-0 hover:ring-0",
      },
      size: {
        default: "",
        icon: "w-11 h-11",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    }
  }
)

export interface LinkProps
  extends HTMLMotionProps<"a">,
  VariantProps<typeof linkVariants> {
  scaleWhileTap?: number,
  children: React.ReactNode
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, children, scaleWhileTap, ...props }, ref) => {
    const MotionLink = motion((defLink as unknown) as React.FC<LinkProps>);

    return (
      <MotionLink
        className={cn(linkVariants({ variant, size, className }))}
        ref={ref}
        whileTap={{ scale: scaleWhileTap ?? .98 }}
        {...props}
      >
        {children}
      </MotionLink>
    )
  }
);
Link.displayName = "Link";

export { Link, linkVariants }