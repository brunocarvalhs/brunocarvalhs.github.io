import React from 'react';
import { cn } from '@/lib/utils';

interface HomePanelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * One full-viewport "page" of the desktop horizontal-scroll Home layout.
 * Sized to exactly fill the viewport and snaps into place as the user pages
 * through; if a section's content is taller than the viewport it scrolls
 * internally rather than breaking the one-panel-per-section model.
 *
 * Purely presentational — the section inside keeps its own `id`, used by
 * Header/PanelNav's `scrollIntoView` calls to jump here.
 */
const HomePanel = React.forwardRef<HTMLDivElement, HomePanelProps>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'h-screen w-screen shrink-0 snap-start snap-always overflow-y-auto',
        className
      )}
    >
      {children}
    </div>
  )
);
HomePanel.displayName = 'HomePanel';

export default HomePanel;
