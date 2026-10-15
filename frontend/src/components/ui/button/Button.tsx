import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-md hover:shadow-[0_8px_20px_-4px_rgba(var(--color-primary-rgb),0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 font-semibold focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:ring-offset-2 outline-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
    outline:
      "bg-white text-slate-700 border-[1.5px] border-slate-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/[0.06] shadow-xs hover:shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.18)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 font-semibold dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:border-[var(--color-primary)] dark:hover:bg-[var(--color-primary)]/10 dark:hover:text-white",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-xl transition cursor-pointer ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}

      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
