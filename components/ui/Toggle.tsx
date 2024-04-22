import { cn } from "@/utils/utils"
import { VariantProps, cva } from "class-variance-authority"
import React from "react"

const switchVariants = cva(
  "",
  {
    variants: {
      variant: {
        'default': "",
      },
    }
  }
)

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof switchVariants> {
  label?: string,
  description?: string,
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, variant, label, description, ...props }, ref) => {
    return (
      <label className="inline-flex cursor-pointer">
        <input {...props} type="checkbox" className="sr-only peer" />
        <div className="relative w-11 h-6 border border-dark bg-black bg-opacity-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:-top-[1px] after:-start-[3px] after:bg-white after:border-dark after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-dark" />
        <div className="flex flex-col gap-2 ms-3">
          <span className="text-sm font-semibold text-dark tracking-wide text-opacity-75">{label}</span>

          <p className="text-dark text-xs tracking-wide">{description}</p>
        </div>
      </label>
    )
  }
)
Switch.displayName = 'SwitchToggle';

export { Switch, switchVariants }