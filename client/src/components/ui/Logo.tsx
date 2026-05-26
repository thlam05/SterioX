import React from 'react';
import { Link } from 'react-router';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = () => {

  return (
    <Link to="/" className="flex items-center gap-2.5 select-none group cursor-pointer">
      <div className="flex items-center gap-2.5 select-none group cursor-pointer">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-500 transition-colors duration-200 group-hover:bg-pink-600">
          <span className="text-white text-xl font-bold tracking-tight">
            S
          </span>
        </div>

        <div className="flex items-center font-bold text-xl tracking-tight">
          <span className="text-slate-800 transition-colors duration-200 group-hover:text-slate-900">
            Sterio
          </span>
          <span className="text-pink-500 ml-0.5">
            X
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;