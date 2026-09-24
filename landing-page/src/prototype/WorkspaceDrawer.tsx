import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Menu, Monitor, Moon, Sun, X } from 'lucide-react'
import { Button } from '../components/ui/button'
import type { ThemePreference } from '../lib/use-appearance'
import { navGroups, pageInfo, readPage } from '../design-system/navigation'
import { trapFocus } from '../lib/ios-focus'
import { readMockupFlow, userFlowGroups } from '../lib/user-flows'
import { productChapters, brandChapters, goToPresentationChapter } from '../lib/presentation-chapters'

export type WorkspaceView = 'mockup' | 'landpage' | 'design-system' | 'product' | 'brand'
export function WorkspaceDrawer({ view, onViewChange, theme, onThemeChange, children, disabled, productChapter, brandChapter }: {
  view: WorkspaceView; onViewChange: (view: WorkspaceView) => void
  theme: ThemePreference; onThemeChange: (theme: ThemePreference) => void
  children?: ReactNode; disabled: boolean; productChapter: number; brandChapter: number
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const focusSection = useRef(false)
  const pendingChapter = useRef<{ view: 'product' | 'brand'; index: number } | null>(null)
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState(readPage)
  const [flow, setFlow] = useState(readMockupFlow)
  useEffect(() => {
    const update = () => { setSection(readPage()); setFlow(readMockupFlow()) }
    update()
    window.addEventListener('hashchange', update)
    window.addEventListener('popstate', update)
    return () => { window.removeEventListener('hashchange', update); window.removeEventListener('popstate', update) }
  }, [view])
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])
  function close() { dialog.current?.close() }
  return <>
    <Button ref={trigger} className="workspace-menu-trigger" variant="secondary" size="icon" aria-label="Open workspace menu" aria-controls="workspace-drawer" aria-expanded={open} disabled={disabled} onClick={() => { dialog.current?.showModal(); setOpen(true) }}><Menu size={20} aria-hidden="true" /></Button>
    <dialog ref={dialog} id="workspace-drawer" className="workspace-drawer" aria-labelledby="workspace-menu-title" onClose={() => {
      setOpen(false)
      if (pendingChapter.current !== null) {
        const chapter = pendingChapter.current
        pendingChapter.current = null
        requestAnimationFrame(() => goToPresentationChapter(chapter.view, chapter.index))
      } else if (focusSection.current) {
        focusSection.current = false
        requestAnimationFrame(() => document.querySelector<HTMLElement>(view === 'mockup' ? '#workspace-flow-title' : '#design-system-content h1')?.focus({ preventScroll: true }))
      } else trigger.current?.focus({ preventScroll: true })
    }} onKeyDown={event => trapFocus(event, event.currentTarget)} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX > rect.right || event.clientX < rect.left) close() } }}>
      <div className="workspace-drawer-heading"><h2 id="workspace-menu-title">Placewise <span>Studio</span></h2><Button variant="ghost" size="icon" aria-label="Close workspace menu" onClick={close}><X size={18} aria-hidden="true" /></Button></div>
      <div className="workspace-drawer-view">
        <select id="workspace-view" aria-label="View" value={view} onChange={event => { onViewChange(event.target.value as WorkspaceView); if (['landpage', 'product', 'brand'].includes(event.target.value)) close() }}>
          <option value="mockup">Mockup</option><option value="landpage">Landpage</option><option value="design-system">Design system</option><option value="product">Product</option><option value="brand">Brand</option>
        </select>
      </div>
      <div className="workspace-drawer-body">
        {(view === 'product' || view === 'brand') && <nav className="workspace-section-nav" aria-label="Presentation chapters">
          <div className="workspace-section-group workspace-product-chapters">
            <h3>{view === 'brand' ? 'The brand' : 'The product'}</h3>
            {(view === 'brand' ? brandChapters : productChapters).map(([id, label], index) => <a key={id} href={`#${view}-${id}`} aria-current={(view === 'brand' ? brandChapter : productChapter) === index ? 'step' : undefined} onClick={event => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
              event.preventDefault()
              pendingChapter.current = { view, index }
              close()
            }}><span>{String(index + 1).padStart(2, '0')}</span>{label}</a>)}
          </div>
        </nav>}
        {view === 'mockup' && <nav className="workspace-section-nav" aria-label="Mockup user flows">
          <div className="workspace-section-group"><a href="#mockup" aria-current={!flow ? 'page' : undefined} onClick={event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) close() }}>Map overview</a></div>
          {userFlowGroups.map(group => <div className="workspace-section-group" key={group.label}>
            <h3>{group.label}</h3>
            {group.flows.map(item => <a key={item.id} href={`#flow-${item.id}`} aria-current={flow?.id === item.id ? 'page' : undefined} onClick={event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { focusSection.current = true; close() } }}>{item.title}</a>)}
          </div>)}
        </nav>}
        {view === 'design-system' && <nav className="workspace-section-nav" aria-label="Design system sections">
          {navGroups.map((group, index) => <div className="workspace-section-group" key={index}>
            {group.label && <h3>{group.label}</h3>}
            {group.pages.map(key => <a key={key} href={`#ds-${key}`} aria-current={section === key ? 'page' : undefined} onClick={event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { focusSection.current = true; close() } }}>{pageInfo[key].title}</a>)}
          </div>)}
        </nav>}
        {children}
      </div>
      <div className="workspace-drawer-theme"><div role="group" aria-label="Theme">
        {(['light', 'dark', 'system'] as const).map(value => { const Icon = value === 'light' ? Sun : value === 'dark' ? Moon : Monitor; return <Button key={value} variant="ghost" aria-pressed={theme === value} onClick={() => onThemeChange(value)}><Icon size={16} aria-hidden="true" />{value[0].toUpperCase() + value.slice(1)}</Button> })}
      </div></div>
    </dialog>
  </>
}
