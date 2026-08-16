import type { InputHTMLAttributes, ReactNode } from "react";

type InputSize = "sm" | "md" | "lg";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  fullWidth?: boolean;
  inputSize?: InputSize;
};

const inputBaseClasses =
  "w-full rounded-xl border border-border bg-accent px-3 py-2 text-foreground outline-none transition-all duration-200 placeholder:text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

const sizeClasses: Record<InputSize, string> = {
  sm: "h-9 text-sm",
  md: "h-10 text-sm",
  lg: "h-11 text-base",
};

export function Input({
  label,
  helperText,
  error,
  fullWidth = false,
  inputSize = "md",
  className,
  id,
  disabled,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  const hasError = Boolean(error);

  return (
    <label
      className={["flex flex-col gap-1.5", fullWidth && "w-full"]
        .filter(Boolean)
        .join(" ")}
    >
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}

      <input
        id={inputId}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        aria-describedby={
          hasError || helperText
            ? inputId
              ? `${inputId}-message`
              : undefined
            : undefined
        }
        className={[
          inputBaseClasses,
          sizeClasses[inputSize],
          hasError && "border-danger focus:border-danger focus:ring-danger/20",
          fullWidth && "w-full",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />

      {hasError ? (
        <span
          id={inputId ? `${inputId}-message` : undefined}
          className="text-sm text-danger"
        >
          {error}
        </span>
      ) : helperText ? (
        <span
          id={inputId ? `${inputId}-message` : undefined}
          className="text-sm text-secondary"
        >
          {helperText}
        </span>
      ) : null}
    </label>
  );
}
