const focusableSelector = 'ion-button, ion-item, button, a[href], input:not([type="hidden"]), select, textarea, [tabindex]'

function nativeControl(element: HTMLElement): HTMLElement | null {
  if (element.matches('ion-button, ion-item')) {
    return element.shadowRoot?.querySelector<HTMLElement>('button[part="native"], a[part="native"]') ?? null
  }
  return element
}

/** Focus the actual control rather than an Ionic shadow host. */
export function focusElement(element: HTMLElement | null | undefined, options: FocusOptions = { preventScroll: true }): boolean {
  const target = element && nativeControl(element)
  if (!target || target.matches(':disabled') || element?.hasAttribute('disabled')) return false
  target.focus(options)
  return hasFocus(element)
}

/** Include both the shadow host and its nested active element in focus checks. */
export function hasFocus(element: HTMLElement | null | undefined): boolean {
  if (!element) return false
  let active = element.ownerDocument.activeElement
  while (active) {
    if (active === element || element.contains(active)) return true
    active = active.shadowRoot?.activeElement ?? null
  }
  return false
}

/** Return each visible control once, excluding Ionic's hidden form submit proxy. */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(element => {
    const target = nativeControl(element)
    if (!target || target.tabIndex < 0 || target.matches(':disabled') || element.hasAttribute('disabled')) return false
    if (element.getAttribute('aria-disabled') === 'true' || element.closest('[hidden], [inert], [aria-hidden="true"]')) return false
    if (!element.getClientRects().length || !target.getClientRects().length) return false
    return getComputedStyle(element).visibility !== 'hidden' && getComputedStyle(target).visibility !== 'hidden'
  })
}

type FocusKeyEvent = Pick<KeyboardEvent, 'key' | 'shiftKey' | 'preventDefault'>

/** Trap Tab within a contained dialog; accepts native or React keyboard events. */
export function trapFocus(event: FocusKeyEvent, container: HTMLElement): void {
  if (event.key !== 'Tab') return
  const controls = getFocusableElements(container)
  const first = controls[0]
  const last = controls[controls.length - 1]
  if (!first || !last) { event.preventDefault(); return }
  const activeIndex = controls.findIndex(hasFocus)
  if (event.shiftKey && activeIndex <= 0) {
    event.preventDefault()
    focusElement(last)
  } else if (!event.shiftKey && (activeIndex === -1 || activeIndex === controls.length - 1)) {
    event.preventDefault()
    focusElement(first)
  }
}
