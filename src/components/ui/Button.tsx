"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // base
          "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50",
          "active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
          // sizes
          size === "sm" && "text-xs px-4 py-2 h-8",
          size === "md" && "text-sm px-6 py-3 h-11",
          size === "lg" && "text-base px-8 py-4 h-14",
          // variants
          variant === "primary" &&
            "bg-amber-400 text-black hover:bg-amber-300 shadow-[0_0_0_0_#fbbf24] hover:shadow-[0_0_20px_2px_#fbbf2440]",
          variant === "secondary" &&
            "bg-white/8 text-white border border-white/12 hover:bg-white/14 hover:border-white/20 backdrop-blur-sm",
          variant === "ghost" &&
            "bg-transparent text-white/60 hover:text-white hover:bg-white/6",
          variant === "outline" &&
            "bg-transparent text-amber-400 border border-amber-400/40 hover:bg-amber-400/10 hover:border-amber-400/70",
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
export default Button;
