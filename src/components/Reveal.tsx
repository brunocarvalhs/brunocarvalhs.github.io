import React from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
}

/**
 * Fades + slides children into view the first time they cross into the
 * viewport. Subtle by design — respects prefers-reduced-motion.
 */
const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
  ({ children, className, delay = 0, style, ...props }, forwardedRef) => {
    const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

    return (
      <div
        ref={(node) => {
          ref.current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn('reveal', isVisible && 'is-visible', className)}
        style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms', ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Reveal.displayName = 'Reveal';

export default Reveal;
