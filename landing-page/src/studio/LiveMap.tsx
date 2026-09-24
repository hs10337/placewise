import { useEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import mapboxgl from 'mapbox-gl'
import { IonIcon, IonSpinner } from '@ionic/react'
import { addOutline, compassOutline, locationSharp, mapOutline, navigateOutline, removeOutline } from 'ionicons/icons'
import 'mapbox-gl/dist/mapbox-gl.css'
import './live-map.css'
import { IosButton as Button } from '../components/ui/ios-button'
import { mapboxAccessToken, mapboxStyle, mapboxTokenConfigured } from '../lib/mapbox'
import { namedMapLocation } from '../lib/map-place'
import type { Coordinates, PlaceDetails } from '../lib/mockup-state'

export type MapLocation = Coordinates & { place?: PlaceDetails }
// The rest of the mockup uses latitude, longitude. Mapbox takes the reverse order.
export type MapViewport = { center: [number, number]; zoom: number; bearing?: number }
export const initialMapViewport = (): MapViewport => ({ center: [40.7523, -73.97625], zoom: 15.5, bearing: 0 })

// This prototype uses a fixed walking position and heading, not device GPS.
const demoLocation = { latitude: 40.75187, longitude: -73.97725, heading: 29 }

type Props = {
  selectedLocation?: MapLocation
  onSelectLocation: (location: MapLocation) => void
  viewport: RefObject<MapViewport>
  mode?: 'light' | 'dark'
}

const minZoom = 3
const maxZoom = 19

export default function LiveMap({ selectedLocation, onSelectLocation, viewport, mode = 'light' }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const locationPin = useRef<mapboxgl.Marker | null>(null)
  const selectLocation = useRef(onSelectLocation)
  selectLocation.current = onSelectLocation
  const appearance = useRef(mode)
  appearance.current = mode
  const appliedMode = useRef(mode)
  const [attempt, setAttempt] = useState(0)
  const [zoom, setZoom] = useState(viewport.current.zoom)
  const [bearing, setBearing] = useState(viewport.current.bearing ?? 0)
  const [status, setStatus] = useState<'missing-token' | 'loading' | 'ready' | 'failed'>(mapboxTokenConfigured ? 'loading' : 'missing-token')
  const [locationHost] = useState(() => {
    const host = document.createElement('div')
    host.className = 'pi-map-marker'
    host.style.pointerEvents = 'none'
    return host
  })
  const [userLocationHost] = useState(() => {
    const host = document.createElement('div')
    host.className = 'pi-user-location-marker'
    host.style.pointerEvents = 'none'
    return host
  })

  useEffect(() => {
    if (!mapboxTokenConfigured || !container.current) return
    let cancelled = false
    let hasLoaded = false
    let instance: mapboxgl.Map | undefined
    let userLocationPin: mapboxgl.Marker | undefined
    let resize: ResizeObserver | undefined
    let loadingTimeout: number | undefined
    let pressTimeout: number | undefined
    let press: { pointerId: number; x: number; y: number } | undefined
    const mapContainer = container.current

    const cancelPress = () => {
      window.clearTimeout(pressTimeout)
      press = undefined
    }
    const selectAt = (point: mapboxgl.PointLike, padding = 8) => {
      if (!instance || !hasLoaded) return
      const coordinate = instance.unproject(point)
      const screen = instance.project(coordinate)
      let selection: MapLocation = { latitude: coordinate.lat, longitude: coordinate.lng }
      try {
        // Prefer the label under the gesture. A small hit area makes labels
        // easier to select on touch screens without selecting nearby roads.
        const exact = instance.queryRenderedFeatures(screen).map(namedMapLocation).filter(item => item !== undefined)
        const candidates = exact.length ? exact : instance.queryRenderedFeatures([
          [screen.x - padding, screen.y - padding],
          [screen.x + padding, screen.y + padding],
        ]).map(namedMapLocation).filter(item => item !== undefined)
        const activeMap = instance
        candidates.sort((a, b) => activeMap.project([a.longitude, a.latitude]).dist(screen) - activeMap.project([b.longitude, b.latitude]).dist(screen))
        if (candidates[0]) selection = candidates[0]
      } catch { /* Keep coordinate selection available while map tiles update. */ }
      selectLocation.current(selection)
    }
    const doubleClick = (event: mapboxgl.MapMouseEvent) => {
      event.preventDefault()
      if ((event.originalEvent.target as Element | null)?.closest('.pi-map-marker')) return
      selectAt(event.point)
    }
    const keySelect = (event: KeyboardEvent) => {
      if (!instance || (event.key !== 'Enter' && event.key !== ' ')) return
      event.preventDefault()
      selectAt(instance.project(instance.getCenter()))
    }
    const pointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return
      cancelPress()
      if (!event.isPrimary || !instance) return
      const target = event.target as Element
      if (target !== instance.getCanvas()) return
      press = { pointerId: event.pointerId, x: event.clientX, y: event.clientY }
      const bounds = mapContainer.getBoundingClientRect()
      const point: [number, number] = [event.clientX - bounds.left, event.clientY - bounds.top]
      pressTimeout = window.setTimeout(() => {
        if (!press) return
        selectAt(point, 20)
        cancelPress()
      }, 550)
    }
    const pointerMove = (event: PointerEvent) => {
      if (press && event.pointerId === press.pointerId && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) cancelPress()
    }
    const contextMenu = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest('.pi-map-marker, .mapboxgl-canvas')) event.preventDefault()
    }

    const remember = () => {
      if (!instance || cancelled || !container.current?.clientWidth || !container.current.clientHeight) return
      const { lat, lng } = instance.getCenter()
      const currentZoom = instance.getZoom()
      const currentBearing = instance.getBearing()
      if (![lat, lng, currentZoom, currentBearing].every(Number.isFinite)) return
      viewport.current = { center: [lat, lng], zoom: currentZoom, bearing: currentBearing }
      setZoom(currentZoom)
      setBearing(currentBearing)
    }
    const rotate = () => {
      if (instance && !cancelled) setBearing(instance.getBearing())
    }
    const ready = () => {
      if (cancelled) return
      hasLoaded = true
      window.clearTimeout(loadingTimeout)
      instance?.getCanvas().setAttribute('tabindex', '0')
      setStatus('ready')
      remember()
    }
    const failed = () => {
      if (cancelled) return
      window.clearTimeout(loadingTimeout)
      setStatus('failed')
    }
    const mapError = (event: mapboxgl.ErrorEvent & { sourceId?: string }) => {
      const requestStatus = (event.error as { status?: number }).status
      // A recoverable tile/source failure must not interrupt the working map.
      // Authorization, initial-load and style-level errors still offer a retry.
      if (hasLoaded && event.sourceId && requestStatus !== 401 && requestStatus !== 403) return
      failed()
    }
    const styleReady = () => {
      // `load` fires once per instance; theme changes emit `style.load` instead.
      if (hasLoaded) ready()
    }

    setStatus('loading')
    try {
      const [latitude, longitude] = viewport.current.center
      appliedMode.current = appearance.current
      instance = new mapboxgl.Map({
        container: container.current,
        accessToken: mapboxAccessToken,
        style: mapboxStyle(appearance.current),
        center: [longitude, latitude],
        zoom: viewport.current.zoom,
        bearing: viewport.current.bearing ?? 0,
        minZoom,
        maxZoom,
        maxPitch: 0,
        dragRotate: true,
        touchPitch: false,
        pitchWithRotate: false,
        scrollZoom: true,
        doubleClickZoom: false,
        attributionControl: false,
        logoPosition: 'bottom-left',
        respectPrefersReducedMotion: true,
        performanceMetricsCollection: false,
      })
      map.current = instance
      instance.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')
      userLocationPin = new mapboxgl.Marker({ element: userLocationHost, anchor: 'center' })
        .setLngLat([demoLocation.longitude, demoLocation.latitude])
        .addTo(instance)
      userLocationHost.setAttribute('aria-label', 'Simulated current location near Grand Central, facing northeast')
      const canvas = instance.getCanvas()
      canvas.setAttribute('aria-label', 'Map around Grand Central. Double-click or touch and hold to add a location. Scroll to zoom. Use arrow keys to pan, Shift with left or right to rotate, and Enter to select the map center.')
      canvas.setAttribute('tabindex', '-1')
      canvas.addEventListener('keydown', keySelect)
      mapContainer.addEventListener('pointerdown', pointerDown)
      mapContainer.addEventListener('contextmenu', contextMenu)
      window.addEventListener('pointermove', pointerMove)
      window.addEventListener('pointerup', cancelPress)
      window.addEventListener('pointercancel', cancelPress)
      window.addEventListener('blur', cancelPress)

      instance.on('moveend', remember)
      instance.on('rotate', rotate)
      instance.on('dblclick', doubleClick)
      instance.on('load', ready)
      instance.on('style.load', styleReady)
      instance.on('error', mapError)
      instance.on('webglcontextlost', failed)
      instance.on('webglcontextrestored', ready)
      loadingTimeout = window.setTimeout(failed, 25000)

      // Sheets and hidden studio pages change the available size independently
      // of the browser viewport. Avoid caching the camera while hidden.
      resize = new ResizeObserver(() => {
        if (!instance || cancelled || !container.current?.clientWidth || !container.current.clientHeight) return
        instance.resize()
        remember()
      })
      resize.observe(container.current)
    } catch {
      failed()
    }

    return () => {
      remember()
      cancelled = true
      cancelPress()
      window.clearTimeout(loadingTimeout)
      resize?.disconnect()
      instance?.getCanvas().removeEventListener('keydown', keySelect)
      mapContainer.removeEventListener('pointerdown', pointerDown)
      mapContainer.removeEventListener('contextmenu', contextMenu)
      window.removeEventListener('pointermove', pointerMove)
      window.removeEventListener('pointerup', cancelPress)
      window.removeEventListener('pointercancel', cancelPress)
      window.removeEventListener('blur', cancelPress)
      instance?.off('moveend', remember)
      instance?.off('rotate', rotate)
      instance?.off('dblclick', doubleClick)
      instance?.off('load', ready)
      instance?.off('style.load', styleReady)
      instance?.off('error', mapError)
      instance?.off('webglcontextlost', failed)
      instance?.off('webglcontextrestored', ready)
      locationPin.current?.remove()
      locationPin.current = null
      userLocationPin?.remove()
      instance?.remove()
      map.current = null
    }
  }, [attempt, viewport, userLocationHost])

  useEffect(() => {
    if (!map.current || status !== 'ready' || !selectedLocation) {
      locationPin.current?.remove()
      locationPin.current = null
      return
    }
    const coordinate: [number, number] = [selectedLocation.longitude, selectedLocation.latitude]
    if (locationPin.current) locationPin.current.setLngLat(coordinate)
    else locationPin.current = new mapboxgl.Marker({ element: locationHost, anchor: 'bottom' }).setLngLat(coordinate).addTo(map.current)
    locationHost.setAttribute('aria-label', selectedLocation.place?.name || 'Selected location')
  }, [selectedLocation, status, locationHost])

  useEffect(() => {
    if (!map.current || appliedMode.current === mode) return
    appliedMode.current = mode
    // Keep the same map instance, markers, and camera when the theme changes.
    try {
      map.current.setStyle(mapboxStyle(mode), {
        diff: false,
        localFontFamily: undefined,
        localIdeographFontFamily: 'sans-serif',
      })
    } catch {
      setStatus('failed')
    }
  }, [mode])

  const changeZoom = (direction: number) => {
    const instance = map.current
    if (!instance || status !== 'ready') return
    instance.easeTo({ zoom: Math.max(minZoom, Math.min(maxZoom, instance.getZoom() + direction)), duration: 180 })
  }
  const recenter = () => {
    const instance = map.current
    if (!instance || status !== 'ready') return
    instance.easeTo({ center: [demoLocation.longitude, demoLocation.latitude], zoom: Math.max(16, instance.getZoom()), duration: 400 })
  }
  const resetNorth = () => {
    if (status === 'ready') map.current?.resetNorth({ duration: 250 })
  }

  return <>
    <div ref={container} className="pi-live-map" role="region" aria-label="Neighborhood map" />
    {status === 'ready' && createPortal(
      <div className="pi-user-location" role="img" aria-label="Simulated current location near Grand Central, facing northeast">
        <span className="pi-user-heading" style={{ transform: `rotate(${demoLocation.heading - bearing}deg)` }} aria-hidden="true" />
        <span className="pi-user-dot" aria-hidden="true" />
      </div>,
      userLocationHost,
    )}
    {status === 'ready' && selectedLocation && createPortal(
      <span className="pi-selected-pin" role="img" aria-current="location" aria-label={selectedLocation.place?.name || 'Selected location'}><IonIcon icon={locationSharp} aria-hidden="true" /></span>,
      locationHost,
    )}
    {status === 'ready' && <div className="pi-map-zoom" role="group" aria-label="Map zoom">
      <Button type="button" variant="ghost" size="icon" aria-label="Zoom in" disabled={zoom >= maxZoom - .01} onClick={() => changeZoom(1)}><IonIcon slot="icon-only" icon={addOutline} aria-hidden="true" /></Button>
      <Button type="button" variant="ghost" size="icon" aria-label="Zoom out" disabled={zoom <= minZoom + .01} onClick={() => changeZoom(-1)}><IonIcon slot="icon-only" icon={removeOutline} aria-hidden="true" /></Button>
    </div>}
    {status === 'ready' && <>
      <Button type="button" variant="secondary" size="icon" className="pi-map-compass" aria-label="Reset map to north" disabled={Math.abs(bearing) < .5} onClick={resetNorth}>
        <IonIcon slot="icon-only" icon={compassOutline} className="pi-compass-needle" style={{ transform: `rotate(${-45 - bearing}deg)` }} aria-hidden="true" />
      </Button>
      <Button type="button" variant="secondary" size="icon" className="pi-map-recenter" aria-label="Recenter on current location" aria-description="Uses a simulated walking location near Grand Central in this mockup." onClick={recenter}><IonIcon slot="icon-only" icon={navigateOutline} aria-hidden="true" /></Button>
    </>}
    {(status === 'missing-token' || status === 'loading') && <div className="pi-map-placeholder" role="status">{status === 'loading' ? <IonSpinner name="lines" aria-hidden="true" /> : <IonIcon icon={mapOutline} aria-hidden="true" />}<span>{status === 'loading' ? 'Loading map…' : 'Mapbox'}</span></div>}
    {status === 'failed' && <div className="pi-map-error" role="status"><span>Map couldn’t load.</span><Button type="button" variant="secondary" size="sm" onClick={() => setAttempt(value => value + 1)}>Retry</Button></div>}
  </>
}
