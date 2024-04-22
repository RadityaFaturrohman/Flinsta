import React from "react";
import { cn } from "@/utils/utils";
import { VariantProps, cva } from "class-variance-authority";
import { MotionProps } from "framer-motion";

const inputVariants = cva(
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

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  label?: string,
}

const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, label, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-1'>
        <label htmlFor={props.id} className='text-dark text-opacity-65 text-xs font-medium tracking-wide cursor-pointer ml-1'>{label}</label>
        <input
          {...props}
          ref={ref}
          className={cn(inputVariants({ variant, className }))}
        />
      </div>
    )
  }
);
TextInput.displayName = "TextInput";

export { TextInput, inputVariants };