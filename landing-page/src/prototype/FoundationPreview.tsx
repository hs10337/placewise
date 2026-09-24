import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { IonItem, IonLabel, IonList, IonNote, IonToggle } from '@ionic/react'
import { Button } from '../components/ui/button'
import { IosButton } from '../components/ui/ios-button'
import { IosPopover } from '../components/ui/ios-popover'
import { IOSScreen } from '../components/ui/ios-screen'
import { IOSNavBar } from '../components/ui/ios-nav-bar'
import { IPhoneFrame } from './IPhoneFrame'
import { trapFocus } from '../lib/ios-focus'
import { KeyboardPreview } from './KeyboardPreview'
import { useAppearance } from '../lib/use-appearance'
import { WorkspaceDrawer, type WorkspaceView } from './WorkspaceDrawer'

const DesignSystem = lazy(() => import('../studio/DesignSystem'))

const typeRoles = ['largeTitle', 'title1', 'title2', 'title3', 'headline', 'body', 'callout', 'subheadline', 'footnote', 'caption1', 'caption2'] as const
const surfaces = ['background', 'grouped-background', 'label', 'tint', 'fill', 'separator'] as const

export default function FoundationPreview() {
  const { preference, setPreference, mode } = useAppearance()
  const dark = mode === 'dark'
  const readView = (): WorkspaceView => {
    const value = new URLSearchParams(location.search).get('view')
    return value === 'landpage' || value === 'design-system' ? value : 'mockup'
  }
  const [view, setView] = useState<WorkspaceView>(readView)
  function changeView(next: WorkspaceView) {
    const url = new URL(location.href)
    if (next === 'mockup') url.searchParams.delete('view')
    else url.searchParams.set('view', next)
    if (next !== 'design-system') url.hash = ''
    history.pushState(null, '', url)
    setView(next)
  }
  useEffect(() => {
    const update = () => {
      if (location.hash === '#mockup') {
        const url = new URL(location.href)
        url.searchParams.delete('view')
        url.hash = ''
        history.replaceState(null, '', url)
      }
      setView(readView())
    }
    window.addEventListener('popstate', update)
    window.addEventListener('hashchange', update)
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('hashchange', update) }
  }, [])
  useEffect(() => { document.title = `Placewise Studio | ${view === 'mockup' ? 'Mockup' : view === 'landpage' ? 'Landpage' : 'Design system'}` }, [view])
  const [framed, setFramed] = useState(true)
  const [overlay, setOverlay] = useState(false)
  const [notice, setNotice] = useState('')
  const [keyboardOpen, setKeyboardOpen] = useState(() => new URLSearchParams(location.search).has('keyboard'))
  const [draft, setDraft] = useState('')
  const input = useRef<HTMLTextAreaElement>(null)
  const nativeKeyboard = window.matchMedia('(pointer: coarse)').matches
  function showKeyboard() { setKeyboardOpen(true); input.current?.focus({ preventScroll: true }) }
  function hideKeyboard() { setKeyboardOpen(false); input.current?.blur() }
  function typeKey(key: string) {
    const start = input.current?.selectionStart ?? draft.length
    const end = input.current?.selectionEnd ?? draft.length
    const from = key === 'Backspace' && start === end ? Array.from(draft.slice(0, start)).slice(0, -1).join('').length : start
    const text = key === 'Backspace' ? '' : key
    const next = draft.slice(0, from) + text + draft.slice(end)
    if (next.length > 500) return
    setDraft(next)
    requestAnimationFrame(() => { input.current?.focus({ preventScroll: true }); input.current?.setSelectionRange(from + text.length, from + text.length) })
  }
  const phone = useRef<HTMLDivElement>(null)
  const anchor = useRef<HTMLIonButtonElement>(null)
  return <main className={`foundation-workspace ios-foundation workspace-view-${view}`}>
    <WorkspaceDrawer view={view} onViewChange={changeView} theme={preference} onThemeChange={setPreference} disabled={overlay}>
      {view === 'mockup' && <div className="workspace-preview-controls"><p>Preview</p><Button variant="ghost" aria-pressed={!framed} onClick={() => setFramed(value => !value)}>{framed ? 'Hide phone frame' : 'Show phone frame'}</Button><Button variant="ghost" onClick={showKeyboard}>Show keyboard</Button></div>}
    </WorkspaceDrawer>
    {view === 'landpage' && <iframe className="workspace-project-view" title="Placewise landing page" src="./index.html" />}
    {view === 'design-system' && <Suspense fallback={<p role="status">Loading design system…</p>}><DesignSystem embedded mode={mode} themePreference={preference} onThemeChange={setPreference} /></Suspense>}
    <div className="workspace-mockup" hidden={view !== 'mockup'}>
    <IPhoneFrame framed={framed}>
      <div className="foundation-phone-owner" ref={phone}>
        <div className="foundation-app" inert={overlay}>
          <IOSScreen className={keyboardOpen ? 'foundation-keyboard-open' : undefined} footer={<><div className="foundation-composer"><label htmlFor="keyboard-sample">Try the keyboard</label><textarea id="keyboard-sample" ref={input} rows={2} maxLength={500} value={draft} placeholder="Type something…" onChange={event => setDraft(event.target.value)} onFocus={() => setKeyboardOpen(true)} onClick={() => setKeyboardOpen(true)} onKeyDown={event => { if (event.key === 'Escape') hideKeyboard() }} /><span className="ios-caption">{nativeKeyboard ? 'Uses your device keyboard' : 'Desktop keyboard preview · Dictation unavailable'}</span></div>{keyboardOpen && !nativeKeyboard && <KeyboardPreview onType={typeKey} />}</>} header={<IOSNavBar title="Foundation" trailing={<IosButton ref={anchor} variant="ghost" onClick={() => setOverlay(true)}>About</IosButton>} />}>
            <div className="foundation-screen-content">
              <section className="foundation-welcome"><p className="ios-caption">PLACEWISE / NEW MOCKUP</p><h2>Ready to build.</h2><p>Start with the essentials. Make every screen feel at home on iPhone.</p></section>
              <section aria-labelledby="preview-heading"><h3 className="ios-section-label" id="preview-heading">Appearance</h3>
                <IonList inset mode="ios" className="ios-inset-list">
                  <IonItem mode="ios"><IonToggle mode="ios" checked={dark} onIonChange={event => setPreference(event.detail.checked ? 'dark' : 'light')}>Dark appearance</IonToggle></IonItem>
                  <IonItem mode="ios"><IonLabel>Platform</IonLabel><IonNote slot="end">iOS 18</IonNote></IonItem>
                  <IonItem mode="ios" lines="none"><IonLabel>Accent</IonLabel><IonNote slot="end">Oxblood</IonNote></IonItem>
                </IonList>
              </section>
              <section aria-labelledby="actions-heading"><h3 className="ios-section-label" id="actions-heading">Actions</h3><div className="foundation-actions">
                <IosButton expand="block" onClick={() => setNotice('Primary action works. Ready for a product flow.')}>Try primary action</IosButton>
                <IosButton expand="block" variant="secondary" onClick={() => setNotice('Secondary action works.')}>Secondary action</IosButton>
                <IosButton expand="block" disabled>Disabled action</IosButton>
                <p className="ios-caption foundation-feedback" role="status">{notice || 'Tap an action to check its response.'}</p>
              </div></section>
              <section aria-labelledby="colors-heading"><h3 className="ios-section-label" id="colors-heading">Semantic colors</h3><div className="foundation-swatches">{surfaces.map(role => <div key={role}><span style={{ background: `var(--ios-${role})` }} /><small>{role.replaceAll('-', ' ')}</small></div>)}</div></section>
              <section aria-labelledby="type-heading"><h3 className="ios-section-label" id="type-heading">Typography</h3><div className="foundation-type">{typeRoles.map(role => <div key={role}><small>{role}</small><p style={{ font: `var(--ios-type-${role})` }}>A sense of place.</p></div>)}</div></section>
              <p className="ios-caption foundation-end">End of preview. Every row stays reachable.</p>
            </div>
          </IOSScreen>
        </div>
        <IosPopover isOpen={overlay} phoneRef={phone} anchorRef={anchor} side="bottom" alignment="end" width={280} ariaLabel="About this foundation" onDidDismiss={() => setOverlay(false)}>
          <div className="foundation-about" role="dialog" aria-modal="true" aria-labelledby="foundation-about-title" onKeyDown={event => trapFocus(event, event.currentTarget)}><h2 id="foundation-about-title">Built for iPhone</h2><p>This is a component preview. Product screens come next.</p><IosButton expand="block" onClick={() => setOverlay(false)}>Done</IosButton></div>
        </IosPopover>
      </div>
    </IPhoneFrame>
    </div>
  </main>
}
