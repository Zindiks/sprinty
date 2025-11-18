import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink = ({ href, children, className }: SkipLinkProps) => {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only',
        'focus:fixed focus:top-4 focus:left-4 focus:z-50',
        'focus:px-4 focus:py-2',
        'focus:bg-primary focus:text-primary-foreground',
        'focus:rounded-md focus:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'transition-all',
        className,
      )}
    >
      {children}
    </a>
  );
};

// Screen reader only text component
export const ScreenReaderOnly = ({
  children,
  as: Component = 'span',
}: {
  children: React.ReactNode;
  as?: React.ElementType;
}) => {
  return <Component className="sr-only">{children}</Component>;
};

// Live region for announcements
export const LiveRegion = ({
  children,
  priority = 'polite',
}: {
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
}) => {
  return (
    <div role="status" aria-live={priority} aria-atomic="true" className="sr-only">
      {children}
    </div>
  );
};

// Visually hidden but accessible to screen readers
export const VisuallyHidden = ({ children }: { children: React.ReactNode }) => {
  return (
    <span
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0,
      }}
    >
      {children}
    </span>
  );
};
