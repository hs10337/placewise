import type { PointerEvent, ReactNode } from 'react'

/** Decorative hardware only; IOSScreen consumes the preview inset contract. */
export function IPhoneFrame({ children, framed }: { children: ReactNode; framed: boolean }) {
  function updatePointer(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse') event.currentTarget.dataset.pointer = 'mouse'
    else delete event.currentTarget.dataset.pointer
  }
  return <div className="iphone-frame" data-framed={framed}>
    <div className="iphone-display" onPointerOver={updatePointer} onPointerMove={updatePointer} onPointerDownCapture={updatePointer} onPointerLeave={event => { delete event.currentTarget.dataset.pointer }} onPointerCancel={event => { delete event.currentTarget.dataset.pointer }}>
      <div className="iphone-status iphone-system-chrome" aria-hidden="true">
        <span>9:41</span><span className="iphone-island" />
        <div className="iphone-status-icons"><i className="iphone-cellular" /><i className="iphone-wifi" /><i className="iphone-battery" /></div>
      </div>
      {children}
      <div className="iphone-home iphone-system-chrome" aria-hidden="true"><span /></div>
    </div>
  </div>
}
