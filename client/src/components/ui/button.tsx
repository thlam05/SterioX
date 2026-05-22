import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  label?: string;
}

const variantStyles = {
  primary: 'bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foregroun',
};

export function Button({
  type = 'button',
  variant = 'primary',
  label,
  className = '',
  children,
  ...props
}: ButtonProps) {

  const baseLayout = `
    inline-flex items-center justify-center
    px-4 py-2 font-medium text-sm rounded-md 
    cursor-pointer
    transition-all duration-200 
    active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  `.replace(/\s+/g, ' ').trim();

  const variantClass = variantStyles[variant] || variantStyles.primary;
  const finalClassName = `${baseLayout} ${variantClass} ${className}`.trim();

  return (
    <button type={type} className={finalClassName} {...props}>
      {children ?? label}
    </button>
  );
}