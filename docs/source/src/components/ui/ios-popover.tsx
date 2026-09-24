import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { popoverController, type OverlayEventDetail } from '@ionic/core'
import { defineCustomElement } from '@ionic/core/components/ion-popover.js'
import { focusElement, getFocusableElements } from '../../lib/ios-focus'
import {
  disposePhonePopover, phonePopoverEnterAnimation, phonePopoverLeaveAnimation,
  type OverlayElementRef, type PhonePopoverLayout,
} from '../../lib/ios-overlays'
import '../../studio/ios-overlays.css'

defineCustomElement()

export type IosPopoverProps = PhonePopoverLayout & {
  isOpen: boolean
  phoneRef: OverlayElementRef
  anchorRef: OverlayElementRef
  children: ReactNode
  className?: string
  ariaLabel: string
  dismissOnSelect?: boolean
  onDidDismiss: (event: CustomEvent<OverlayEventDetail>) => void
  onDidPresent?: () => void
}

type Session = { overlay: HTMLIonPopoverElement; content: HTMLDivElement; presented: boolean }

/** A real Ionic popover with an explicit phone owner instead of the first global IonApp. */
export function IosPopover(props: IosPopoverProps) {
  const { isOpen, phoneRef, children } = props
  const latest = useRef(props)
  latest.current = props
  const mounted = useRef(false)
  const generation = useRef(0)
  const active = useRef<Session | null>(null)
  const restoreFocusFrame = useRef(0)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      cancelAnimationFrame(restoreFocusFrame.current)
    }
  }, [])

  useEffect(() => {
    if (!isOpen || !phoneRef.current) return
    let cancelled = false
    let created: Session | null = null
    let dismissFrame = 0
    const currentGeneration = ++generation.current
    const options = latest.current
    const anchor = options.anchorRef.current
    cancelAnimationFrame(restoreFocusFrame.current)
    const content = document.createElement('div')
    content.className = 'pi-popover-content'
    void popoverController.create({
      component: content,
      mode: 'ios', arrow: false, focusTrap: true, keyboardClose: true,
      backdropDismiss: true, dismissOnSelect: options.dismissOnSelect ?? false,
      cssClass: ['pi-phone-popover', ...(options.className ? [options.className] : [])],
      htmlAttributes: { 'aria-label': options.ariaLabel },
      side: options.side ?? 'top', alignment: options.alignment ?? 'start',
      enterAnimation: phonePopoverEnterAnimation(phoneRef, options.anchorRef, options),
      leaveAnimation: phonePopoverLeaveAnimation,
    }).then(overlay => {
      if (cancelled || !phoneRef.current?.isConnected) { overlay.remove(); return }
      // Controller-created overlays are not React-owned nodes, so moving this
      // one before present preserves both Ionic and React event delegation.
      phoneRef.current.appendChild(overlay)
      created = { overlay, content, presented: false }
      active.current = created
      overlay.addEventListener('ionPopoverDidPresent', () => {
        if (!mounted.current || currentGeneration !== generation.current) return
        focusElement(getFocusableElements(content)[0])
        latest.current.onDidPresent?.()
      })
      overlay.addEventListener('ionPopoverWillDismiss', () => { content.inert = true }, { once: true })
      overlay.addEventListener('ionPopoverDidDismiss', event => {
        disposePhonePopover(overlay)
        if (active.current?.overlay === overlay) active.current = null
        if (!mounted.current || currentGeneration !== generation.current) return
        setSession(current => current?.overlay === overlay ? null : current)
        // Ionic restores trigger focus and detaches the overlay after emitting
        // didDismiss. Run navigation actions after that work has finished.
        dismissFrame = requestAnimationFrame(() => {
          if (!mounted.current || currentGeneration !== generation.current) return
          latest.current.onDidDismiss(event as CustomEvent<OverlayEventDetail>)
          // React must first remove inert from the main content. A navigation
          // callback may also remove this anchor or present another overlay.
          restoreFocusFrame.current = requestAnimationFrame(() => {
            if (!mounted.current || currentGeneration !== generation.current || latest.current.isOpen || !anchor?.isConnected) return
            const pendingOverlay = phoneRef.current?.querySelector('ion-popover, ion-alert, ion-modal, ion-action-sheet, ion-loading, ion-picker')
            if (active.current || pendingOverlay) return
            const focused = anchor.ownerDocument.activeElement
            if (!focused || focused === anchor.ownerDocument.body) focusElement(anchor)
          })
        })
      }, { once: true })
      setSession(created)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(dismissFrame)
      if (created) {
        const overlay = created.overlay
        created.content.inert = true
        if (active.current?.overlay === overlay) active.current = null
        void overlay.dismiss().finally(() => { disposePhonePopover(overlay); overlay.remove() })
      }
    }
  }, [isOpen, phoneRef])

  useLayoutEffect(() => {
    if (!session || session.presented || !isOpen) return
    session.presented = true
    // The portal's children have now committed into the content element.
    void session.overlay.present()
  }, [session, isOpen])

  return session ? createPortal(children, session.content) : null
}
