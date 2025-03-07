import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 disabled:opacity-50 disabled:pointer-events-none",
          // Variants
          variant === "primary" && "bg-green-600 text-white hover:bg-green-700",
          variant === "secondary" && "bg-gray-100 text-gray-900 hover:bg-gray-200",
          variant === "outline" && "border border-gray-300 bg-transparent hover:bg-gray-50",
          variant === "ghost" && "bg-transparent hover:bg-gray-100",
          variant === "icon" && "bg-transparent hover:bg-gray-100 p-0",
          // Sizes
          size === "default" && "h-10 px-4 py-2 text-sm",
          size === "sm" && "h-8 px-3 py-1 text-xs",
          size === "lg" && "h-12 px-6 py-3 text-base",
          size === "icon" && "h-10 w-10 rounded-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
