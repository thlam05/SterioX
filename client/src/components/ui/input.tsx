import { forwardRef, useState, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={actualType}
          className={`
            w-full px-3.5 py-2.5 text-sm font-normal rounded-xl border outline-none transition-all duration-200
            bg-surface text-surface-foreground placeholder:text-muted-foreground/60
            disabled:opacity-50 disabled:bg-muted disabled:cursor-not-allowed
            ${isPassword ? 'pr-12' : ''}
            
            ${error
              ? 'border-2 border-danger-light focus:border-danger'
              : 'border-2 border-accent focus:border-primary'
            }
            
            ${className}
          `.trim()}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-accent hover:text-foreground transition-colors duration-150 select-none focus:outline-none"
          >
            {showPassword ? 'Ẩn' : 'Hiện'}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';