import { createAnimation, type AnimationBuilder, type PopoverOptions } from '@ionic/core'

export type OverlayElementRef = { readonly current: HTMLElement | null }
export type PhonePopoverLayout = {
  side?: 'top' | 'bottom'
  alignment?: 'start' | 'center' | 'end'
  width?: number
  gap?: number
}

type OverlayLayout = { cleanup: () => void }
const layouts = new WeakMap<HTMLElement, OverlayLayout>()

export function disposePhonePopover(overlay: HTMLElement): void {
  layouts.get(overlay)?.cleanup()
  layouts.delete(overlay)
}

/** Position Ionic's own popover content in phone coordinates, including preview scaling. */
function positionPhonePopover(overlay: HTMLElement, anchor: HTMLElement | null, layout: PhonePopoverLayout): void {
  const content = overlay.shadowRoot?.querySelector<HTMLElement>('[part="content"]')
  if (!content || !overlay.clientWidth || !overlay.clientHeight) return
  const bounds = overlay.getBoundingClientRect()
  const scaleX = bounds.width / overlay.clientWidth || 1
  const scaleY = bounds.height / overlay.clientHeight || 1
  const anchorBounds = anchor?.getBoundingClientRect()
  const reference = anchorBounds ? {
    left: (anchorBounds.left - bounds.left) / scaleX,
    right: (anchorBounds.right - bounds.left) / scaleX,
    top: (anchorBounds.top - bounds.top) / scaleY,
    bottom: (anchorBounds.bottom - bounds.top) / scaleY,
  } : {
    left: overlay.clientWidth / 2, right: overlay.clientWidth / 2,
    top: overlay.clientHeight / 2, bottom: overlay.clientHeight / 2,
  }
  const margin = 16
  const gap = layout.gap ?? 8
  const maxWidth = Math.max(0, overlay.clientWidth - margin * 2)
  if (layout.width !== undefined) overlay.style.setProperty('--width', `${Math.min(layout.width, maxWidth)}px`)
  content.style.maxWidth = `${maxWidth}px`
  content.style.maxHeight = `${Math.max(0, overlay.clientHeight - margin * 2)}px`
  const naturalHeight = content.getBoundingClientRect().height / scaleY
  const above = Math.max(0, reference.top - gap - margin)
  const below = Math.max(0, overlay.clientHeight - margin - reference.bottom - gap)
  let side = layout.side ?? 'top'
  if (side === 'top' && naturalHeight > above && below > above) side = 'bottom'
  else if (side === 'bottom' && naturalHeight > below && above > below) side = 'top'
  const availableHeight = Math.min(overlay.clientHeight - margin * 2, side === 'top' ? above : below)
  content.style.maxHeight = `${Math.max(0, availableHeight)}px`
  const width = content.getBoundingClientRect().width / scaleX
  const height = content.getBoundingClientRect().height / scaleY
  const rtl = getComputedStyle(overlay).direction === 'rtl'
  const alignment = layout.alignment ?? 'start'
  const alignRight = alignment === 'end' ? !rtl : rtl
  const desiredLeft = alignment === 'center'
    ? (reference.left + reference.right - width) / 2
    : alignRight ? reference.right - width : reference.left
  const left = Math.max(margin, Math.min(desiredLeft, overlay.clientWidth - margin - width))
  const desiredTop = side === 'top' ? reference.top - gap - height : reference.bottom + gap
  const top = Math.max(margin, Math.min(desiredTop, overlay.clientHeight - margin - height))
  content.style.left = `${left}px`
  content.style.top = `${top}px`
  content.style.removeProperty('bottom')
  content.style.transformOrigin = `${alignment === 'center' ? 'center' : alignRight ? 'right' : 'left'} ${side === 'top' ? 'bottom' : 'top'}`
  overlay.dataset.placement = side
}

function keepPhonePopoverPositioned(overlay: HTMLElement, phone: HTMLElement, anchorRef: OverlayElementRef, layout: PhonePopoverLayout): void {
  disposePhonePopover(overlay)
  let frame = 0
  const position = () => positionPhonePopover(overlay, anchorRef.current, layout)
  const schedule = () => {
    if (frame) return
    frame = requestAnimationFrame(() => { frame = 0; position() })
  }
  const observer = new ResizeObserver(schedule)
  observer.observe(phone)
  if (anchorRef.current) observer.observe(anchorRef.current)
  const viewport = overlay.querySelector<HTMLElement>('.popover-viewport')
  if (viewport) observer.observe(viewport)
  const scrollRoots: (HTMLElement | ShadowRoot)[] = [phone]
  phone.querySelectorAll('ion-content').forEach(content => {
    if (content.shadowRoot) scrollRoots.push(content.shadowRoot)
  })
  scrollRoots.forEach(root => root.addEventListener('scroll', schedule, true))
  window.addEventListener('resize', schedule)
  const cleanup = () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    scrollRoots.forEach(root => root.removeEventListener('scroll', schedule, true))
    window.removeEventListener('resize', schedule)
    overlay.removeEventListener('ionPopoverDidDismiss', cleanup)
  }
  overlay.addEventListener('ionPopoverDidDismiss', cleanup, { once: true })
  layouts.set(overlay, { cleanup })
  position()
}

/** Ionic keeps its lifecycle and interactions; only its viewport-based placement changes. */
export function phonePopoverEnterAnimation(phoneRef: OverlayElementRef, anchorRef: OverlayElementRef, layout: PhonePopoverLayout = {}): AnimationBuilder {
  return (overlay: HTMLElement) => {
    const phone = phoneRef.current
    if (phone && overlay.parentElement !== phone) phone.appendChild(overlay)
    overlay.classList.add('pi-phone-popover')
    if (phone) keepPhonePopoverPositioned(overlay, phone, anchorRef, layout)
    const root = overlay.shadowRoot
    const content = root?.querySelector<HTMLElement>('[part="content"]')
    const backdrop = root?.querySelector<HTMLElement>('[part="backdrop"]')
    const animation = createAnimation().duration(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 100).easing('ease')
    if (content) animation.addAnimation(createAnimation().addElement(content).fromTo('opacity', .01, 1))
    if (backdrop) animation.addAnimation(createAnimation().addElement(backdrop).fromTo('opacity', .01, 'var(--backdrop-opacity)'))
    return animation
  }
}

export const phonePopoverLeaveAnimation: AnimationBuilder = (overlay: HTMLElement) => {
  disposePhonePopover(overlay)
  const root = overlay.shadowRoot
  const content = root?.querySelector<HTMLElement>('[part="content"]')
  const backdrop = root?.querySelector<HTMLElement>('[part="backdrop"]')
  const animation = createAnimation().duration(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300).easing('ease')
  if (content) animation.addAnimation(createAnimation().addElement(content).fromTo('opacity', .99, 0))
  if (backdrop) animation.addAnimation(createAnimation().addElement(backdrop).fromTo('opacity', 'var(--backdrop-opacity)', 0))
  return animation
}

/** Pass to IonSelect with interface="popover"; each field keeps its own phone/anchor. */
export function phoneSelectInterfaceOptions(phoneRef: OverlayElementRef, anchorRef: OverlayElementRef, layout: PhonePopoverLayout = {}): Omit<PopoverOptions, 'component'> {
  return {
    mode: 'ios', cssClass: 'pi-phone-popover', arrow: false, focusTrap: true,
    side: layout.side ?? 'bottom', alignment: layout.alignment ?? 'start',
    enterAnimation: phonePopoverEnterAnimation(phoneRef, anchorRef, { side: 'bottom', ...layout }),
    leaveAnimation: phonePopoverLeaveAnimation,
  }
}
