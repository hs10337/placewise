import test from 'node:test'
import assert from 'node:assert/strict'
import { namedMapLocation } from '../src/lib/map-place.ts'
import { makeMapAttachment } from '../src/lib/mockup-state.ts'

const feature = (overrides = {}) => ({
  geometry: { type: 'Point', coordinates: [-73.9772, 40.7527] },
  properties: { name: 'Grand Central Terminal', type: 'Railway station' },
  layer: { type: 'symbol' },
  source: 'composite',
  sourceLayer: 'transit_stop_label',
  id: 42,
  ...overrides,
})

test('rendered place labels retain their names, coordinates and available metadata', () => {
  assert.deepEqual(namedMapLocation(feature()), {
    latitude: 40.7527,
    longitude: -73.9772,
    place: { name: 'Grand Central Terminal', category: 'Railway station', id: 'composite:transit_stop_label:42' },
  })
  for (const sourceLayer of ['poi_label', 'transit_stop_label', 'airport_label', 'natural_label', 'place_label']) {
    assert.ok(namedMapLocation(feature({ sourceLayer })))
  }
})

test('selection excludes roads, buildings, unnamed features and non-symbol layers', () => {
  for (const malformed of [null, undefined, 7, 'place', [], {}, feature({ geometry: null }), feature({ properties: [] })]) {
    assert.equal(namedMapLocation(malformed), undefined)
  }
  for (const sourceLayer of ['road', 'road_label', 'building', 'waterway_label', 'unknown']) {
    assert.equal(namedMapLocation(feature({ sourceLayer })), undefined)
  }
  assert.equal(namedMapLocation(feature({ layer: { type: 'fill' } })), undefined)
  assert.equal(namedMapLocation(feature({ layer: undefined })), undefined)
  assert.equal(namedMapLocation(feature({ sourceLayer: undefined })), undefined)
  for (const properties of [null, {}, { name: '' }, { name: ' \n\u200B ' }, { name: 7 }]) {
    assert.equal(namedMapLocation(feature({ properties })), undefined)
  }
})

test('English names take precedence, with clean localized-name fallback and bounded labels', () => {
  assert.equal(namedMapLocation(feature({ properties: { name_en: ' \nGrand\u200B Central\n\tTerminal ', name: 'Other' } })).place.name, 'Grand Central Terminal')
  assert.equal(namedMapLocation(feature({ properties: { name_en: ' ', name: 'Estación\uFEFF Central' } })).place.name, 'Estación Central')
  assert.equal(namedMapLocation(feature({ properties: { name_en: 123, name: 'Station' } })).place.name, 'Station')
  assert.equal(namedMapLocation(feature({ properties: { name: 'x'.repeat(1100) } })).place.name.length, 300)
})

test('available category properties have a stable priority and missing categories stay absent', () => {
  const choices = ['category_en', 'type', 'class', 'maki', 'mode']
  for (let index = 0; index < choices.length; index++) {
    const properties = { name: 'Station', ...Object.fromEntries(choices.slice(index).map(key => [key, `${key} value`])) }
    assert.equal(namedMapLocation(feature({ properties })).place.category, `${choices[index]} value`)
  }
  assert.deepEqual(namedMapLocation(feature({ properties: { name: 'Park', category_en: '', type: null }, id: undefined })).place, { name: 'Park' })
})

test('IDs prefer mapbox identity and otherwise require both a source and feature ID', () => {
  assert.equal(namedMapLocation(feature({ properties: { name: 'Station', mapbox_id: 'poi.123' } })).place.id, 'poi.123')
  assert.equal(namedMapLocation(feature({ id: 0 })).place.id, 'composite:transit_stop_label:0')
  assert.notEqual(namedMapLocation(feature()).place.id, namedMapLocation(feature({ source: 'another' })).place.id)
  assert.notEqual(namedMapLocation(feature()).place.id, namedMapLocation(feature({ sourceLayer: 'poi_label' })).place.id)
  for (const overrides of [{ source: undefined }, { source: '' }, { id: undefined }, { id: '' }, { id: NaN }]) {
    assert.equal(namedMapLocation(feature(overrides)).place.id, undefined)
  }
})

test('non-point, malformed, non-finite and out-of-range coordinates cannot become place context', () => {
  for (const geometry of [
    { type: 'LineString', coordinates: [[-73, 40], [-72, 41]] },
    { type: 'Polygon', coordinates: [] },
    { type: 'Point' },
    { type: 'Point', coordinates: null },
    { type: 'Point', coordinates: [] },
    { type: 'Point', coordinates: ['-73', 40] },
    { type: 'Point', coordinates: [-73, NaN] },
    { type: 'Point', coordinates: [Infinity, 40] },
    { type: 'Point', coordinates: [-181, 40] },
    { type: 'Point', coordinates: [-73, 91] },
  ]) assert.equal(namedMapLocation(feature({ geometry })), undefined)
  assert.ok(namedMapLocation(feature({ geometry: { type: 'Point', coordinates: [-180, -90] } })))
  assert.ok(namedMapLocation(feature({ geometry: { type: 'Point', coordinates: [180, 90] } })))
})

test('bounded map metadata survives attachment validation without truncating identity IDs', () => {
  const selection = namedMapLocation(feature({
    properties: { name: 'x'.repeat(301), category_en: 'y'.repeat(201), mapbox_id: 'z'.repeat(300) },
  }))
  assert.equal(selection.place.name.length, 300)
  assert.equal(selection.place.category.length, 200)
  assert.equal(selection.place.id.length, 300)
  assert.deepEqual(makeMapAttachment(selection).place, selection.place)

  const oversizedId = namedMapLocation(feature({
    properties: { name: 'Station', mapbox_id: 'z'.repeat(301) }, id: 'x'.repeat(290),
  }))
  assert.equal(oversizedId.place.id, undefined)
  assert.deepEqual(makeMapAttachment(oversizedId).place, { name: 'Station' })
})
