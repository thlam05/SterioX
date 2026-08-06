import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "live"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "ghost";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
};

const baseClasses =
  "inline-flex flex-row items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-accent-foreground font-semibold transition-all duration-200 outline-none active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-95 active:brightness-90",

  secondary:
    "bg-secondary text-secondary-foreground hover:brightness-95 active:brightness-90",

  live: "bg-live text-white hover:brightness-95 active:brightness-90",

  success: "bg-success text-white hover:brightness-95 active:brightness-90",

  danger: "bg-danger text-white hover:brightness-95 active:brightness-90",

  warning: "bg-warning text-white hover:brightness-95 active:brightness-90",

  info: "bg-info text-white hover:brightness-95 active:brightness-90",

  ghost:
    "bg-accent text-accent-foreground hover:bg-primary-light hover:text-foreground active:brightness-95",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-2 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-4 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className,
  disabled,
  type = "button",
  icon,
  iconPosition = "left",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {loading && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}

        {!loading && icon && iconPosition === "left" && (
          <span className="flex items-center justify-center">{icon}</span>
        )}

        {children}

        {!loading && icon && iconPosition === "right" && (
          <span className="flex items-center justify-center">{icon}</span>
        )}
      </span>
    </button>
  );
}
