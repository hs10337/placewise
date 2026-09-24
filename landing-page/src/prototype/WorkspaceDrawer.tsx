import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Menu, Monitor, Moon, Sun, X } from 'lucide-react'
import { Button } from '../components/ui/button'
import type { ThemePreference } from '../lib/use-appearance'
import { navGroups, pageInfo, readPage } from '../design-system/navigation'
import { trapFocus } from '../lib/ios-focus'

export type WorkspaceView = 'mockup' | 'landpage' | 'design-system'
export function WorkspaceDrawer({ view, onViewChange, theme, onThemeChange, children, disabled }: {
  view: WorkspaceView; onViewChange: (view: WorkspaceView) => void
  theme: ThemePreference; onThemeChange: (theme: ThemePreference) => void
  children?: ReactNode; disabled: boolean
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const focusSection = useRef(false)
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState(readPage)
  useEffect(() => {
    const update = () => setSection(readPage())
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
      if (focusSection.current) {
        focusSection.current = false
        requestAnimationFrame(() => document.querySelector<HTMLElement>('#design-system-content h1')?.focus({ preventScroll: true }))
      } else trigger.current?.focus({ preventScroll: true })
    }} onKeyDown={event => trapFocus(event, event.currentTarget)} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX > rect.right || event.clientX < rect.left) close() } }}>
      <div className="workspace-drawer-heading"><h2 id="workspace-menu-title">Placewise <span>Studio</span></h2><Button variant="ghost" size="icon" aria-label="Close workspace menu" onClick={close}><X size={18} aria-hidden="true" /></Button></div>
      <div className="workspace-drawer-view">
        <label htmlFor="workspace-view">View</label>
        <select id="workspace-view" value={view} onChange={event => { onViewChange(event.target.value as WorkspaceView); if (event.target.value !== 'design-system') close() }}>
          <option value="mockup">Mockup</option><option value="landpage">Landpage</option><option value="design-system">Design system</option>
        </select>
      </div>
      <div className="workspace-drawer-body">
        {view === 'design-system' && <nav className="workspace-section-nav" aria-label="Design system sections">
          {navGroups.map((group, index) => <div className="workspace-section-group" key={index}>
            {group.label && <h3>{group.label}</h3>}
            {group.pages.map(key => <a key={key} href={`#ds-${key}`} aria-current={section === key ? 'page' : undefined} onClick={event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { focusSection.current = true; close() } }}>{pageInfo[key].title}</a>)}
          </div>)}
        </nav>}
        {children}
      </div>
      <div className="workspace-drawer-theme"><p id="workspace-theme-label">Theme</p><div role="group" aria-labelledby="workspace-theme-label">
        {(['light', 'dark', 'system'] as const).map(value => { const Icon = value === 'light' ? Sun : value === 'dark' ? Moon : Monitor; return <Button key={value} variant="ghost" aria-pressed={theme === value} onClick={() => onThemeChange(value)}><Icon size={16} aria-hidden="true" />{value[0].toUpperCase() + value.slice(1)}</Button> })}
      </div></div>
    </dialog>
  </>
}
