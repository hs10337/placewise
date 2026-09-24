import type { Coordinates, PlaceDetails } from './mockup-state'

// Keep this structural so callers can pass a Mapbox rendered feature directly.
export type RenderedPlaceFeature = {
  geometry: { type: string; coordinates?: unknown }
  properties: Record<string, unknown> | null
  layer?: { type?: string }
  source?: string
  sourceLayer?: string
  id?: string | number
}

const placeLayers = new Set(['poi_label', 'transit_stop_label', 'airport_label', 'natural_label', 'place_label'])
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

function label(value: unknown, limit = 300): string | undefined {
  if (typeof value !== 'string') return undefined
  const clean = value.replace(/[\u200B\uFEFF]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, limit).trim()
  return clean || undefined
}

function featureId(value: unknown): string | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : undefined
  if (typeof value !== 'string') return undefined
  const id = value.trim()
  // IDs are opaque: omitting an oversized ID is safer than truncating its identity.
  return id && id.length <= 300 ? id : undefined
}

/** Read identity only from a named place that is actually rendered on the map. */
export function namedMapLocation(feature: unknown): (Coordinates & { place: PlaceDetails }) | undefined {
  if (!isRecord(feature) || !isRecord(feature.layer) || feature.layer.type !== 'symbol'
    || typeof feature.sourceLayer !== 'string' || !placeLayers.has(feature.sourceLayer)) return undefined
  if (!isRecord(feature.geometry) || feature.geometry.type !== 'Point' || !Array.isArray(feature.geometry.coordinates)) return undefined

  const [longitude, latitude] = feature.geometry.coordinates
  if (typeof longitude !== 'number' || !Number.isFinite(longitude) || Math.abs(longitude) > 180
    || typeof latitude !== 'number' || !Number.isFinite(latitude) || Math.abs(latitude) > 90) return undefined

  const properties = isRecord(feature.properties) ? feature.properties : undefined
  const name = label(properties?.name_en) ?? label(properties?.name)
  if (!name) return undefined

  const category = ['category_en', 'type', 'class', 'maki', 'mode'].map(key => label(properties?.[key], 200)).find(Boolean)
  const mapboxId = featureId(properties?.mapbox_id)
  const sourceId = featureId(feature.id)
  const source = featureId(feature.source)
  const scopedId = source && sourceId ? `${source}:${feature.sourceLayer}:${sourceId}` : undefined
  const id = mapboxId ?? (scopedId && scopedId.length <= 300 ? scopedId : undefined)

  return {
    latitude,
    longitude,
    place: { name, ...(id ? { id } : {}), ...(category ? { category } : {}) },
  }
}
