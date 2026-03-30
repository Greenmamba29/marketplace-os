import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  size = 'md',
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          'relative w-full bg-concrete-900 border-0.5 border-concrete-700 rounded-xl shadow-2xl',
          'max-h-[90vh] overflow-auto',
          sizes[size],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  className,
  onClose,
}) => (
  <div className={cn('flex items-center justify-between px-6 py-4 border-b border-concrete-800', className)}>
    <div className="flex-1">{children}</div>
    {onClose && (
      <button
        onClick={onClose}
        className="ml-4 p-1 text-concrete-400 hover:text-concrete-200 transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
);

export interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalTitle: React.FC<ModalTitleProps> = ({ children, className }) => (
  <h2 className={cn('text-xl font-semibold text-concrete-100', className)}>
    {children}
  </h2>
);

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => (
  <div className={cn('px-6 py-4', className)}>{children}</div>
);

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => (
  <div
    className={cn(
      'flex items-center justify-end gap-3 px-6 py-4 border-t border-concrete-800',
      className
    )}
  >
    {children}
  </div>
);
