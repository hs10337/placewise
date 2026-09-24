import { lazy, Suspense, useEffect, useState } from 'react'
import { IPhoneFrame } from './IPhoneFrame'
import { useAppearance } from '../lib/use-appearance'
import { WorkspaceDrawer, type WorkspaceView } from './WorkspaceDrawer'
import FoundationMap from './FoundationMap'
import { readMockupFlow } from '../lib/user-flows'

const DesignSystem = lazy(() => import('../studio/DesignSystem'))
const ProductPresentation = lazy(() => import('./ProductPresentation'))
const BrandPresentation = lazy(() => import('./BrandPresentation'))

export default function FoundationPreview() {
  const { preference, setPreference, mode } = useAppearance()
  const readView = (): WorkspaceView => {
    const value = new URLSearchParams(location.search).get('view')
    return value === 'landpage' || value === 'design-system' || value === 'product' || value === 'brand' ? value : 'mockup'
  }
  const [view, setView] = useState<WorkspaceView>(readView)
  const [flow, setFlow] = useState(readMockupFlow)
  const [productChapter, setProductChapter] = useState(0)
  const [brandChapter, setBrandChapter] = useState(0)
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
  useEffect(() => {
    const url = new URL(location.href)
    if (url.searchParams.has('keyboard')) {
      url.searchParams.delete('keyboard')
      history.replaceState(null, '', url)
    }
  }, [])
  return <main className={`foundation-workspace ios-foundation workspace-view-${view}`}>
    <WorkspaceDrawer view={view} onViewChange={changeView} theme={preference} onThemeChange={setPreference} disabled={false} productChapter={productChapter} brandChapter={brandChapter} />
    {view === 'landpage' && <iframe className="workspace-project-view" title="Placewise landing page" src="./index.html" />}
    {view === 'design-system' && <Suspense fallback={<p role="status">Loading design system…</p>}><DesignSystem embedded mode={mode} themePreference={preference} onThemeChange={setPreference} /></Suspense>}
    {view === 'product' && <Suspense fallback={<p role="status">Loading product presentation…</p>}><ProductPresentation active={productChapter} onChapterChange={setProductChapter} /></Suspense>}
    {view === 'brand' && <Suspense fallback={<p role="status">Loading brand presentation…</p>}><BrandPresentation active={brandChapter} onChapterChange={setBrandChapter} /></Suspense>}
    {view === 'mockup' && flow && <header className="workspace-flow-heading">
      <p>Mockup / User flow · To design</p>
      <h1 id="workspace-flow-title" tabIndex={-1}>{flow.title}</h1>
      <p>{flow.description}</p>
    </header>}
    <div className="workspace-mockup" hidden={view !== 'mockup'}>
      <IPhoneFrame framed>
        <div className="ios-screen foundation-map-screen">
          <FoundationMap mode={mode} active={view === 'mockup'} />
        </div>
      </IPhoneFrame>
    </div>
  </main>
}
