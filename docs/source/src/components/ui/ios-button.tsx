import * as React from 'react'
import { IonButton } from '@ionic/react'
import { cn } from '../../lib/utils'

const variants = {
  default: 'pi-button-primary',
  secondary: 'pi-button-secondary',
  ghost: 'pi-button-ghost',
  light: 'pi-button-light',
} as const

const fills = { default: 'solid', secondary: 'outline', ghost: 'clear', light: 'solid' } as const
const sizes = { default: '', sm: 'pi-button-small', icon: 'pi-button-icon' } as const

export type IosButtonElement = HTMLIonButtonElement
export type IosButtonProps = Omit<React.ComponentPropsWithoutRef<typeof IonButton>, 'mode' | 'size'> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

/** Ionic supplies the iOS control; Placewise supplies its existing visual tokens. */
export const IosButton = React.forwardRef<IosButtonElement, IosButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', fill, expand, shape, children, ...props }, ref) => {
    const host = React.useRef<IosButtonElement | null>(null)
    const previousAttributes = React.useRef<string[]>([])
    const attachRef = React.useCallback((element: IosButtonElement | null) => {
      host.current = element
      if (typeof ref === 'function') ref(element)
      else if (ref) ref.current = element
    }, [ref])

    React.useLayoutEffect(() => {
      // Ionic's host is not the focusable button. Keep tabindex and changing
      // ARIA state on the actual control, including attributes Ionic copies once.
      const syncNativeAttributes = () => {
        const native = host.current?.shadowRoot?.querySelector<HTMLElement>('[part="native"]')
        if (!native) return
        if (props.tabIndex === undefined) native.removeAttribute('tabindex')
        else native.tabIndex = props.tabIndex
        const attributes = Object.entries(props).filter(([name, value]) => name.startsWith('aria-') && value != null)
        const names = attributes.map(([name]) => name)
        for (const name of previousAttributes.current) {
          if (!names.includes(name)) native.removeAttribute(name)
        }
        for (const [name, value] of attributes) native.setAttribute(name, String(value))
        previousAttributes.current = names
      }
      syncNativeAttributes()
      // The custom element can finish its first render after React commits.
      const frame = requestAnimationFrame(syncNativeAttributes)
      return () => cancelAnimationFrame(frame)
    })

    return <IonButton
      {...props}
      ref={attachRef}
      mode="ios"
      type={type}
      size={size === 'sm' ? 'small' : 'default'}
      fill={fill ?? fills[variant]}
      expand={expand ?? (className?.split(/\s+/).includes('pi-full') ? 'block' : undefined)}
      shape={shape ?? (size === 'icon' ? 'round' : undefined)}
      className={cn('pi-ios-button', variants[variant], sizes[size], className)}
    >{children}</IonButton>
  },
)
IosButton.displayName = 'IosButton'

export { IosButton as Button }
