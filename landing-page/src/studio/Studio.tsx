import { useEffect, useRef, useState } from 'react'
import Mockup from './Mockup'
import DesignSystem from './DesignSystem'
import { Button } from '../components/ui/button'
import { mapboxTokenConfigured } from '../lib/mapbox'
import { ArrowUpRight, Monitor, Moon, RotateCcw, Sun } from 'lucide-react'

import { useAppearance } from '../lib/use-appearance'

export default function Studio() {
  const [page, setPage] = useState(() => /^(#design-system|#ds-)/.test(location.hash) ? 'design-system' : 'mockup')
  const { preference: themePreference, setPreference: setThemePreference, mode: resolvedMode } = useAppearance()
  const [visited, setVisited] = useState(false)
  const [resetRevision, setResetRevision] = useState(0)
  const heading = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const next = /^(#design-system|#ds-)/.test(location.hash) ? 'design-system' : 'mockup'
      if (next === 'design-system') setResetRevision(0)
      setPage(previous => {
        if (previous !== next) { setVisited(true); window.scrollTo(0, 0) }
        return next
      })
    }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useEffect(() => {
    document.title = `Placewise Studio | ${page === 'mockup' ? 'iPhone mockup' : 'Design system'}`
    if (visited) heading.current?.focus({ preventScroll: true })
  }, [page, visited])

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <main id="main-content" ref={heading} tabIndex={-1} className={`studio-main ${page === 'design-system' ? 'studio-main--docs' : 'studio-main--wireframe'}`}>
      <div id="mockup" className="studio-mockup-page" hidden={page !== 'mockup'}>
        <header className="studio-preview-heading">
          <p className="studio-preview-eyebrow">Placewise · iPhone</p>
          <h1>Map and chat</h1>
          <div className="studio-preview-actions">
            <Button type="button" variant="secondary" size="sm" onClick={() => setResetRevision(value => value + 1)}><RotateCcw size={14} aria-hidden="true" />Reset mockup</Button>
            <a href="#design-system">Design system<ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
          <div className="studio-preview-theme">
            <p id="studio-theme-label" className="studio-preview-eyebrow">Theme</p>
            <div role="group" aria-labelledby="studio-theme-label">
              {(['system', 'light', 'dark'] as const).map(preference => <Button key={preference} type="button" variant="ghost" size="sm" aria-pressed={themePreference === preference} onClick={() => setThemePreference(preference)}>{preference === 'system' ? <Monitor size={14} aria-hidden="true" /> : preference === 'light' ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}{preference[0].toUpperCase() + preference.slice(1)}</Button>)}
            </div>
          </div>
          {!mapboxTokenConfigured && <p className="studio-map-setup">Mapbox token needed. <a href="https://console.mapbox.com/account/access-tokens/" target="_blank" rel="noopener noreferrer">Set up</a></p>}
        </header>
        {page === 'mockup' && <Mockup key={resetRevision} freshStart={resetRevision > 0} mode={resolvedMode} />}
      </div>
      <div id="design-system" hidden={page !== 'design-system'}>{page === 'design-system' && <div id="ion-view-container-root"><DesignSystem mode={resolvedMode} themePreference={themePreference} onThemeChange={setThemePreference} /></div>}</div>
    </main>
  </>
}
