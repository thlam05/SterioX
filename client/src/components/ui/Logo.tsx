import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: {
      container: 'space-x-1.5',
      badge: 'w-6 h-6 text-sm',
      text: 'text-lg'
    },
    md: {
      container: 'space-x-2',
      badge: 'w-8 h-8 text-base',
      text: 'text-2xl'
    },
    lg: {
      container: 'space-x-3',
      badge: 'w-11 h-11 text-xl',
      text: 'text-4xl'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center cursor-pointer select-none font-sans ${currentSize.container} ${className}`}>
      <div className={`${currentSize.badge} rounded-full bg-primary text-white font-bold flex items-center justify-center`}>
        S
      </div>
      <span className={`${currentSize.text} font-black tracking-tight text-foreground`}>
        SterioX
      </span>
    </div>
  );
};

export default Logo;