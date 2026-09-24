import { forwardRef, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

/** Owns safe areas and one scrolling content region in both preview and browser. */
export const IOSScreen = forwardRef<HTMLDivElement, { children: ReactNode; header: ReactNode; footer?: ReactNode; className?: string }>(
  ({ children, header, footer, className }, ref) => <div ref={ref} className={cn('ios-screen', className)}>
    <header className="ios-screen-header">{header}</header>
    <div className="ios-screen-scroll" tabIndex={0} aria-label="Scrollable preview">{children}</div>
    {footer && <footer className="ios-screen-footer">{footer}</footer>}
  </div>,
)
IOSScreen.displayName = 'IOSScreen'
