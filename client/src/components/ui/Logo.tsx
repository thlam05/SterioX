import React from 'react';
import { Link } from 'react-router';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = () => {
  return (
    <Link to="/" className="flex items-center select-none group">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8 text-pink-500"
      >
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        <path d="M8.5 8.5a5 5 0 0 0 0 7" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M5.5 5.5a9 9 0 0 0 0 13" />
        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
      </svg>
    </Link>
  );
};

export default Logo;
