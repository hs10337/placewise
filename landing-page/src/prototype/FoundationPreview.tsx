import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Button } from '../components/ui/button'
import { IPhoneFrame } from './IPhoneFrame'
import { useAppearance } from '../lib/use-appearance'
import { WorkspaceDrawer, type WorkspaceView } from './WorkspaceDrawer'
import LiveMap, { initialMapViewport, type MapLocation } from '../studio/LiveMap'
import { readMockupFlow } from '../lib/user-flows'

const DesignSystem = lazy(() => import('../studio/DesignSystem'))

export default function FoundationPreview() {
  const { preference, setPreference, mode } = useAppearance()
  const readView = (): WorkspaceView => {
    const value = new URLSearchParams(location.search).get('view')
    return value === 'landpage' || value === 'design-system' || value === 'product' || value === 'brand' ? value : 'mockup'
  }
  const [view, setView] = useState<WorkspaceView>(readView)
  const [flow, setFlow] = useState(readMockupFlow)
  function changeView(next: WorkspaceView) {
    const url = new URL(location.href)
    if (next === 'mockup') url.searchParams.delete('view')
    else url.searchParams.set('view', next)
    if (next !== 'design-system') url.hash = ''
    history.pushState(null, '', url)
    setView(next)
    setFlow(readMockupFlow())
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
      setFlow(readMockupFlow())
    }
    window.addEventListener('popstate', update)
    window.addEventListener('hashchange', update)
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('hashchange', update) }
  }, [])
  useEffect(() => { document.title = `Placewise Studio | ${view === 'mockup' ? flow?.title || 'Mockup' : view === 'design-system' ? 'Design system' : view[0].toUpperCase() + view.slice(1)}` }, [view, flow])
  const [framed, setFramed] = useState(true)
  const mapViewport = useRef(initialMapViewport())
  const [selectedLocation, setSelectedLocation] = useState<MapLocation>()
  useEffect(() => {
    const url = new URL(location.href)
    if (url.searchParams.has('keyboard')) {
      url.searchParams.delete('keyboard')
      history.replaceState(null, '', url)
    }
  }, [])
  return <main className={`foundation-workspace ios-foundation workspace-view-${view}`}>
    <WorkspaceDrawer view={view} onViewChange={changeView} theme={preference} onThemeChange={setPreference} disabled={false}>
      {view === 'mockup' && <div className="workspace-preview-controls"><p>Preview</p><Button variant="ghost" aria-pressed={!framed} onClick={() => setFramed(value => !value)}>{framed ? 'Hide phone frame' : 'Show phone frame'}</Button></div>}
    </WorkspaceDrawer>
    {view === 'landpage' && <iframe className="workspace-project-view" title="Placewise landing page" src="./index.html" />}
    {view === 'design-system' && <Suspense fallback={<p role="status">Loading design system…</p>}><DesignSystem embedded mode={mode} themePreference={preference} onThemeChange={setPreference} /></Suspense>}
    {(view === 'product' || view === 'brand') && <section className="workspace-flow-heading">
      <p>Placewise Studio</p>
      <h1>{view === 'product' ? 'Product' : 'Brand'}</h1>
      <p>{view === 'product' ? 'Product direction, audience and scope.' : 'Brand identity, voice and visual direction.'}</p>
      <Button asChild variant="secondary"><a href={`./source/docs/${view === 'product' ? 'product.md' : 'brand_guidelines.md'}`} download>{view === 'product' ? 'Download product brief' : 'Download brand guidelines'}</a></Button>
    </section>}
    {view === 'mockup' && flow && <header className="workspace-flow-heading">
      <p>Mockup / User flow · To design</p>
      <h1 id="workspace-flow-title" tabIndex={-1}>{flow.title}</h1>
      <p>{flow.description}</p>
    </header>}
    <div className="workspace-mockup" hidden={view !== 'mockup'}>
      <IPhoneFrame framed={framed}>
        <div className="ios-screen foundation-map-screen">
          <div className="pi-map foundation-map">
            <LiveMap mode={mode} viewport={mapViewport} selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />
            <span className="sr-only" role="status">{selectedLocation ? `Selected ${selectedLocation.place?.name || 'map location'}` : ''}</span>
          </div>
        </div>
      </IPhoneFrame>
    </div>
  </main>
}
