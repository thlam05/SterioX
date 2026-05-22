import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  label?: string;
}

const variantStyles = {
  primary: 'bg-primary hover:bg-primary-dark text-dark',
  secondary: 'bg-secondary hover:bg-secondary-dark text-white',
  danger: 'bg-danger hover:bg-danger-dark text-white',
};

export function Button({
  type = 'button',
  variant = 'primary',
  label,
  className = '',
  children,
  ...props
}: ButtonProps) {

  const baseLayout = 'px-4 py-2 font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClass = variantStyles[variant] || variantStyles.primary;

  const finalClassName = `${baseLayout} ${variantClass} ${className}`.trim();

  return (
    <button type={type} className={finalClassName} {...props}>
      {children ?? label}
    </button>
  );
}