import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  label?: string;
}

export function Button({
  type = 'button',
  variant = 'primary',
  label,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClass = `bg-${variant}`;

  return (
    <button type={type} className={`${baseClass} ${className}`.trim()} {...props}>
      {children ?? label}
    </button>
  );
}
