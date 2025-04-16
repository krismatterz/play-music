import React from 'react';
import { IconPlayerPlay } from '@tabler/icons-react';
import classNames from 'classnames';

export interface NavbarProps {
  variant?: 'transparent' | 'solid';
  className?: string;
  logo?: React.ReactNode;
  children?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  variant = 'transparent',
  className,
  logo,
  children,
}) => {
  const defaultLogo = (
    <div className="flex items-center gap-2">
      <IconPlayerPlay size={28} className="text-emerald-500" />
      <span className="text-white font-bold text-xl">play</span>
    </div>
  );

  return (
    <nav 
      className={classNames(
        'fixed top-0 left-0 right-0 z-50',
        variant === 'transparent' ? 'bg-black/10 backdrop-blur-xl' : 'bg-black',
        className
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {logo || defaultLogo}
        <div className="flex items-center gap-4">
          {children}
        </div>
      </div>
    </nav>
  );
};
