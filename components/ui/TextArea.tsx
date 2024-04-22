import { cn } from "@/utils/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const textareaVariants = cva(
  "focus:outline-none focus:ring p-2 border-2 border-dark border-opacity-15 rounded-xl pl-3 text-[15px] font-medium text-dark hover:border-opacity-35 transition-all placeholder:text-sm placeholder:tracking-wide disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "",
        filled: "bg-light-grey bg-opacity-15 hover:bg-opacity-45 rounded-md border hover:border-opacity-15 font-normal",
      },
    },
    defaultVariants: {
      variant: 'default',
    }
  }
)

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {
  label?: string,
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, label, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-0.5'>
        <label htmlFor="desc" className='text-dark text-opacity-65 text-xs font-medium tracking-wide cursor-pointer'>Description</label>
        <textarea
          {...props}
          ref={ref}
          className={cn(textareaVariants({ variant, className }))}
        />
      </div>
    )
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };