import test from 'node:test'
import assert from 'node:assert/strict'
import {
  activeWalkConversation,
  attachmentTitle,
  emptyPreferences,
  initialState,
  isVisibleConversation,
  makeAttachment,
  makeMapAttachment,
  makeUploadAttachment,
  makeRoute,
  makeWalk,
  migrateLegacyState,
  newConversation,
  parseState,
  planningSummary,
  recentConversations,
  reopenOnMap,
  samePlace,
  walkTitle,
} from '../src/lib/mockup-state.ts'

const legacyState = (overrides = {}) => ({
  selected: null, chats: {}, drafts: {}, preferences: emptyPreferences(), route: null, walk: null, ...overrides,
})
const question = (text = 'Who designed this building?', subject = 'graybar') => ({ text, kind: 'question', attachment: makeAttachment(subject) })

test('fresh state stays out of history and independent conversations receive distinct IDs', () => {
  const state = initialState()
  assert.equal(state.conversations[0].id, state.currentId)
  assert.equal(state.conversations[0].title, 'New conversation')
  assert.deepEqual(recentConversations(state), [])
  const ids = new Set(Array.from({ length: 100 }, () => newConversation().id))
  assert.equal(ids.size, 100)
  assert.deepEqual(parseState(JSON.parse(JSON.stringify(state))), state)
})

test('unattached questions retain the sent neighborhood through saving and reopening', () => {
  const sent = { text: 'What is worth seeing nearby?', kind: 'question', attachment: null, neighborhood: 'Around Grand Central' }
  const conversation = newConversation({ title: 'Around Grand Central', questions: [sent] })
  const state = { conversations: [conversation], currentId: conversation.id }
  sent.neighborhood = 'Another neighborhood'
  conversation.preferences.neighborhood = 'Changed walk preference'
  assert.equal(conversation.questions[0].neighborhood, 'Around Grand Central')
  assert.equal(conversation.attachment, null)
  const saved = JSON.parse(JSON.stringify(state))
  const parsed = parseState(saved)
  assert.deepEqual(parsed, state)
  const reopened = reopenOnMap(parsed)
  const history = recentConversations(reopened)
  assert.equal(history.length, 1)
  assert.equal(history[0].id, conversation.id)
  assert.equal(history[0].questions[0].neighborhood, 'Around Grand Central')
  assert.equal(history[0].questions[0].attachment, null)
  assert.notEqual(reopened.currentId, conversation.id)
  history[0].questions[0].neighborhood = 'Changed reopened context'
  assert.equal(parsed.conversations[0].questions[0].neighborhood, 'Around Grand Central')
  parsed.conversations[0].questions[0].neighborhood = 'Changed parsed context'
  assert.equal(saved.conversations[0].questions[0].neighborhood, 'Around Grand Central')
  assert.equal(state.conversations[0].questions[0].neighborhood, 'Around Grand Central')
})

test('existing v4 questions without neighborhood context remain loadable without invented context', () => {
  const conversation = newConversation({ questions: [question(), { text: 'Plan a walk nearby', kind: 'plan', attachment: null }] })
  const saved = JSON.parse(JSON.stringify({ conversations: [conversation], currentId: conversation.id }))
  const parsed = parseState(saved)
  assert.deepEqual(parsed, saved)
  assert.ok(parsed.conversations[0].questions.every(item => !Object.hasOwn(item, 'neighborhood')))
})

test('malformed neighborhood context is rejected without discarding valid legacy questions', () => {
  const conversation = newConversation({ questions: [{ text: 'What is nearby?', kind: 'question', attachment: null }] })
  for (const neighborhood of [null, [], {}, 123, false, '', '   ', 'N'.repeat(161)]) {
    const state = {
      conversations: [{ ...conversation, questions: [{ ...conversation.questions[0], neighborhood }] }],
      currentId: conversation.id,
    }
    assert.equal(parseState(state), null)
  }
  assert.ok(parseState({ conversations: [conversation], currentId: conversation.id }))
  const longest = { ...conversation, questions: [{ ...conversation.questions[0], neighborhood: 'N'.repeat(160) }] }
  const boundary = { conversations: [longest], currentId: longest.id }
  assert.deepEqual(parseState(boundary), boundary)
})

test('uncommitted planning stays hidden, a submitted planning request is a chat until it has a route', () => {
  const draftPlan = newConversation({ preferences: { ...emptyPreferences(), time: 90 }, draft: 'A long walk' })
  const planningChat = newConversation({ questions: [{ text: planningSummary(draftPlan.preferences), kind: 'plan', attachment: null }] })
  const generatedWalk = newConversation({ route: makeRoute(draftPlan.preferences) })
  assert.equal(isVisibleConversation(draftPlan), false)
  assert.equal(isVisibleConversation(planningChat), true)
  assert.equal(planningChat.route, null)
  assert.equal(isVisibleConversation(generatedWalk), true)
  assert.equal(generatedWalk.route.preferences.time, 90)
  assert.equal(generatedWalk.walk, null)
})

test('history follows recency without mutating state and resume keeps the active walk ahead of newer paused chats', () => {
  const route = makeRoute(emptyPreferences())
  const active = newConversation({ id: 'active', updatedAt: 1, route, walk: makeWalk(route) })
  const paused = newConversation({ id: 'paused', updatedAt: 3, route, walk: { ...makeWalk(route), status: 'paused' } })
  const complete = newConversation({ id: 'complete', updatedAt: 5, route, walk: { ...makeWalk(route), status: 'complete', index: 3 } })
  const ended = newConversation({ id: 'ended', updatedAt: 7, route, walk: { ...makeWalk(route), status: 'ended' } })
  const chat = newConversation({ id: 'chat', updatedAt: 9, questions: [question()] })
  const state = { conversations: [active, complete, paused, ended, chat], currentId: chat.id }
  assert.deepEqual(recentConversations(state).map(item => item.id), ['chat', 'ended', 'complete', 'paused', 'active'])
  assert.deepEqual(state.conversations.map(item => item.id), ['active', 'complete', 'paused', 'ended', 'chat'])
  assert.equal(activeWalkConversation(state).id, 'active')
  const updated = { ...state, conversations: state.conversations.map(item => item.id === 'active' ? { ...item, updatedAt: 10 } : item) }
  assert.equal(activeWalkConversation(updated).id, 'active')
  assert.equal(recentConversations(updated)[0].id, 'active')
  const allPaused = { ...state, conversations: state.conversations.map(item => item.id === 'active' ? { ...item, walk: { ...item.walk, status: 'paused' } } : item) }
  assert.equal(activeWalkConversation(allPaused).id, 'paused')
  const moreRecentPausedChat = { ...state, conversations: state.conversations.map(item => item.id === 'paused' ? { ...item, updatedAt: 100, questions: [question('What is this building?')] } : item) }
  assert.equal(recentConversations(moreRecentPausedChat)[0].id, 'paused')
  assert.equal(activeWalkConversation(moreRecentPausedChat).id, 'active')
})

test('editing a new plan or one route cannot overwrite another route or an ongoing walk', () => {
  const preferences = emptyPreferences()
  const route = makeRoute(preferences)
  const walk = makeWalk(route)
  const first = newConversation({ route, walk, questions: [question()] })
  const second = newConversation({ route, walk, preferences })
  const state = { conversations: [first, second], currentId: second.id }
  second.preferences.time = 90
  second.preferences.interests.push('Art')
  second.route.stops.reverse()
  second.route.preferences.time = 60
  second.walk.visited.push('chrysler')
  second.walk.preferences.interests.push('Everyday life')
  assert.equal(first.route.preferences.time, 45)
  assert.deepEqual(first.route.stops, ['graybar', 'station', 'chrysler'])
  assert.deepEqual(first.walk.visited, [])
  assert.deepEqual(first.preferences.interests, ['Architecture'])
  assert.deepEqual(first.walk.preferences.interests, ['Architecture'])
  assert.deepEqual(first.walk.stops, ['graybar', 'station', 'chrysler'])
  assert.deepEqual(preferences.interests, ['Architecture'])
  assert.deepEqual(route.stops, ['graybar', 'station', 'chrysler'])
  assert.deepEqual(walk.visited, [])
  const parsed = parseState(JSON.parse(JSON.stringify(state)))
  assert.deepEqual(parsed, state)
  parsed.conversations[0].questions[0].attachment.location = 'Changed'
  assert.notEqual(first.questions[0].attachment.location, 'Changed')
})

test('v3 migration preserves subject history, question attachments, selected context and every draft', () => {
  const photo = { ...makeAttachment('statue', 'photo'), location: 'Grand Central south façade' }
  const selected = { ...makeAttachment('graybar', 'photo'), location: '42nd Street' }
  const legacy = legacyState({
    selected,
    chats: {
      graybar: { attachment: makeAttachment('graybar'), questions: ['Who designed it?', 'When was it built?'] },
      statue: { attachment: photo, questions: ['Who made this sculpture?'] },
    },
    drafts: { graybar: 'How tall is it?', statue: 'What is it made of?', chrysler: 'Another draft', unattached: 'Keep this too' },
  })
  const original = structuredClone(legacy)
  const state = migrateLegacyState(legacy)
  assert.ok(state)
  const current = state.conversations.find(item => item.id === state.currentId)
  assert.equal(current.title, 'Graybar Building')
  assert.equal(current.draft, 'How tall is it?')
  assert.deepEqual(current.attachment, selected)
  assert.deepEqual(current.questions.map(item => item.text), ['Who designed it?', 'When was it built?'])
  assert.equal(current.questions[0].attachment.source, 'map')
  const statue = state.conversations.find(item => item.attachment?.subject === 'statue')
  assert.deepEqual(statue.questions[0].attachment, photo)
  assert.equal(statue.draft, 'What is it made of?')
  assert.ok(state.conversations.some(item => item.attachment?.subject === 'chrysler' && item.draft === 'Another draft'))
  assert.ok(state.conversations.some(item => item.attachment === null && item.draft === 'Keep this too'))
  assert.equal(recentConversations(state).length, 2)
  assert.deepEqual(parseState(JSON.parse(JSON.stringify(state))), state)
  current.questions[0].attachment.location = 'New location'
  current.preferences.interests.push('Art')
  assert.deepEqual(legacy, original)
})

test('v3 matching route and walk become one conversation without losing paused progress', () => {
  const route = makeRoute({ ...emptyPreferences(), coffee: true, time: 60 })
  route.stops = ['station', 'chrysler', 'graybar']
  const walk = { ...makeWalk(route), status: 'paused', index: 1, arrived: true, visited: ['station'], skipped: [] }
  const legacy = legacyState({ route, walk })
  const original = structuredClone(legacy)
  const state = migrateLegacyState(legacy)
  const history = recentConversations(state)
  assert.equal(history.length, 1)
  assert.deepEqual(history[0].route, route)
  assert.deepEqual(history[0].walk, walk)
  assert.equal(history[0].title, 'Grand Central · Architecture')
  assert.equal(history[0].questions[0].kind, 'plan')
  assert.match(history[0].questions[0].text, /60-minute.*coffee/)
  assert.deepEqual(parseState(state), state)
  history[0].route.stops.reverse()
  history[0].walk.visited.push('chrysler')
  assert.deepEqual(legacy, original)
  assert.deepEqual(history[0].walk.stops, ['station', 'chrysler', 'graybar'])
})

test('v3 mismatched route and walk are preserved separately, including route edits and finished progress', () => {
  const route = makeRoute({ ...emptyPreferences(), time: 90, interests: ['Art'] })
  route.stops = ['graybar', 'chrysler']
  const oldRoute = makeRoute(emptyPreferences())
  const walk = { ...makeWalk(oldRoute), status: 'complete', index: 3, visited: ['graybar', 'station'], skipped: ['chrysler'] }
  const state = migrateLegacyState(legacyState({ route, walk }))
  const history = recentConversations(state)
  assert.equal(history.length, 2)
  assert.deepEqual(history.find(item => !item.walk).route, route)
  assert.deepEqual(history.find(item => item.walk).route, oldRoute)
  assert.deepEqual(history.find(item => item.walk).walk, walk)
  assert.equal(activeWalkConversation(state), undefined)
  assert.deepEqual(parseState(state), state)
})

test('v3 stop-order differences prevent route merging and orphaned walks receive their own route', () => {
  const route = makeRoute(emptyPreferences())
  const walk = makeWalk(route)
  route.stops.reverse()
  assert.equal(recentConversations(migrateLegacyState(legacyState({ route, walk }))).length, 2)
  const state = migrateLegacyState(legacyState({ walk }))
  assert.equal(recentConversations(state).length, 1)
  assert.deepEqual(recentConversations(state)[0].route, { preferences: walk.preferences, stops: walk.stops })
  assert.deepEqual(parseState(state), state)
})

test('legacy selected-only subjects and unattached drafts restore without becoming history', () => {
  const selected = makeAttachment('chrysler')
  const selectedState = migrateLegacyState(legacyState({ selected }))
  assert.deepEqual(selectedState.conversations.find(item => item.id === selectedState.currentId).attachment, selected)
  assert.deepEqual(recentConversations(selectedState), [])
  const draftState = migrateLegacyState(legacyState({ drafts: { unattached: 'Look at that' } }))
  assert.equal(draftState.conversations.find(item => item.id === draftState.currentId).draft, 'Look at that')
  assert.deepEqual(recentConversations(draftState), [])
})

test('malformed current and legacy storage are rejected instead of throwing or dropping partial data', () => {
  const malformed = [null, undefined, false, 1, 'saved', [], {}, { conversations: null }, { selected: null }]
  for (const value of malformed) {
    assert.equal(parseState(value), null)
    assert.equal(migrateLegacyState(value), null)
  }
  const state = initialState()
  assert.equal(parseState({ ...state, currentId: 'missing' }), null)
  assert.equal(parseState({ ...state, conversations: [state.conversations[0], state.conversations[0]] }), null)
  assert.equal(parseState({ ...state, conversations: [{ ...state.conversations[0], updatedAt: Infinity }] }), null)
  assert.equal(parseState({ ...state, conversations: [{ ...state.conversations[0], questions: [{ ...question(), attachment: { subject: 'missing' } }] }] }), null)
  assert.equal(migrateLegacyState(legacyState({ chats: { graybar: { attachment: makeAttachment('station'), questions: [] } } })), null)
  assert.equal(migrateLegacyState(legacyState({ drafts: { unknown: 'draft' } })), null)
  assert.equal(migrateLegacyState(legacyState({ route: { ...makeRoute(emptyPreferences()), stops: ['graybar', 'graybar'] } })), null)
  const route = makeRoute(emptyPreferences())
  assert.equal(migrateLegacyState(legacyState({ walk: { ...makeWalk(route), status: 'complete', index: 1 } })), null)
})

test('generated titles and planning messages remain valid for every legacy-accepted preference string', () => {
  const preferences = { ...emptyPreferences(), neighborhood: 'A'.repeat(1000), interests: Array(1000).fill('Architecture') }
  assert.ok(walkTitle(preferences).length < 1000)
  assert.ok(planningSummary(preferences).length < 1000)
  const state = migrateLegacyState(legacyState({ route: makeRoute(preferences) }))
  assert.deepEqual(parseState(state), state)
})

const selectedPoint = (coordinates = { latitude: 40.7527, longitude: -73.9772 }) => ({
  subject: 'point', source: 'map', location: '40.7527, -73.9772', coordinates,
})

test('selected map coordinates persist on both the composer and sent questions without sharing references', () => {
  const attachment = selectedPoint()
  const conversation = newConversation({ attachment, questions: [{ text: 'What is here?', kind: 'question', attachment }] })
  const state = { conversations: [conversation], currentId: conversation.id }
  assert.equal(attachmentTitle(conversation.attachment), 'Selected location')
  assert.equal(attachmentTitle(makeAttachment('station')), 'Grand Central Terminal')
  assert.equal(attachmentTitle({ ...attachment, source: 'photo' }), 'Unidentified subject')
  assert.deepEqual(parseState(JSON.parse(JSON.stringify(state))), state)
  conversation.attachment.coordinates.latitude = 41
  assert.equal(attachment.coordinates.latitude, 40.7527)
  assert.equal(conversation.questions[0].attachment.coordinates.latitude, 40.7527)
  const parsed = parseState(state)
  parsed.conversations[0].questions[0].attachment.coordinates.longitude = -74
  assert.equal(conversation.questions[0].attachment.coordinates.longitude, -73.9772)
  assert.equal(parsed.conversations[0].attachment.coordinates.longitude, -73.9772)
})

test('coordinate validation rejects malformed values in current selections and sent questions', () => {
  const malformed = [
    null, [], {}, { latitude: 40 }, { latitude: '40', longitude: -73 },
    { latitude: NaN, longitude: 0 }, { latitude: 0, longitude: Infinity },
    { latitude: 90.01, longitude: 0 }, { latitude: -90.01, longitude: 0 },
    { latitude: 0, longitude: 180.01 }, { latitude: 0, longitude: -180.01 },
  ]
  for (const coordinates of malformed) {
    const attachment = selectedPoint(coordinates)
    const conversation = { ...newConversation(), attachment }
    assert.equal(parseState({ conversations: [conversation], currentId: conversation.id }), null)
    const sentOnly = { ...conversation, attachment: null, questions: [{ text: 'Here?', kind: 'question', attachment }] }
    assert.equal(parseState({ conversations: [sentOnly], currentId: sentOnly.id }), null)
  }
  for (const coordinates of [{ latitude: -90, longitude: -180 }, { latitude: 90, longitude: 180 }]) {
    const conversation = newConversation({ attachment: selectedPoint(coordinates) })
    const state = { conversations: [conversation], currentId: conversation.id }
    assert.deepEqual(parseState(state), state)
  }
  const legacyPoint = newConversation({ attachment: makeAttachment('point') })
  const legacyPointState = { conversations: [legacyPoint], currentId: legacyPoint.id }
  assert.deepEqual(parseState(legacyPointState), legacyPointState)
})

test('place identity distinguishes arbitrary points while known places match across context sources', () => {
  const first = selectedPoint()
  assert.equal(samePlace(first, structuredClone(first)), true)
  assert.equal(samePlace(first, { ...first, location: 'A new display label' }), true)
  assert.equal(samePlace(first, selectedPoint({ latitude: 40.75, longitude: -73.97 })), false)
  assert.equal(samePlace(first, { ...first, source: 'photo' }), false)
  assert.equal(samePlace(first, makeAttachment('point')), false)
  assert.equal(samePlace(makeAttachment('point'), makeAttachment('point')), true)
  assert.equal(samePlace(makeAttachment('point'), { ...makeAttachment('point'), location: 'Somewhere else' }), false)
  assert.equal(samePlace(makeAttachment('graybar'), makeAttachment('graybar', 'photo')), true)
  assert.equal(samePlace(makeAttachment('graybar'), makeAttachment('station')), false)
  assert.equal(samePlace(null, null), false)
  assert.equal(samePlace(first, null), false)
})

test('named map selections retain identity, category and coordinates independently in drafts and sent history', () => {
  const selection = { latitude: 40.753, longitude: -73.977, place: { name: '  Local café  ', id: 'poi.123', category: 'Café' } }
  const attachment = makeMapAttachment(selection)
  assert.equal(attachment.subject, 'point')
  assert.equal(attachmentTitle(attachment), 'Local café')
  assert.equal(attachment.location, '40.75300, -73.97700')
  assert.deepEqual(attachment.place, { name: 'Local café', id: 'poi.123', category: 'Café' })
  selection.place.name = 'Changed input'
  selection.latitude = 0
  const conversation = newConversation({ attachment, questions: [{ text: 'Tell me about this place', kind: 'question', attachment }] })
  const state = { conversations: [conversation], currentId: conversation.id }
  const original = structuredClone(state)
  assert.deepEqual(parseState(JSON.parse(JSON.stringify(state))), state)
  conversation.attachment.place.name = 'Changed composer'
  conversation.attachment.coordinates.latitude = 41
  assert.equal(conversation.questions[0].attachment.place.name, 'Local café')
  assert.equal(attachment.place.name, 'Local café')
  assert.equal(attachment.coordinates.latitude, 40.753)
  const parsed = parseState(original)
  parsed.conversations[0].questions[0].attachment.place.category = 'Bakery'
  assert.equal(original.conversations[0].questions[0].attachment.place.category, 'Café')
  assert.equal(parsed.conversations[0].attachment.place.category, 'Café')
  const reopened = reopenOnMap(original)
  assert.equal(recentConversations(reopened)[0].questions[0].attachment.place.name, 'Local café')
  reopened.conversations[0].attachment.place.name = 'Changed reopened selection'
  assert.equal(original.conversations[0].attachment.place.name, 'Local café')
})

test('named place metadata rejects malformed storage while old attachments still round-trip', () => {
  const malformed = [
    null, [], {}, { name: null }, { name: 1 }, { name: '' }, { name: '   ' }, { name: 'A'.repeat(301) },
    { name: 'Place', id: null }, { name: 'Place', id: 123 }, { name: 'Place', id: '' }, { name: 'Place', id: 'I'.repeat(301) },
    { name: 'Place', category: [] }, { name: 'Place', category: ' ' }, { name: 'Place', category: 'C'.repeat(201) },
  ]
  for (const place of malformed) {
    const attachment = { ...selectedPoint(), place }
    const conversation = { ...newConversation(), attachment }
    assert.equal(parseState({ conversations: [conversation], currentId: conversation.id }), null)
    const sentOnly = { ...conversation, attachment: null, questions: [{ text: 'Here?', kind: 'question', attachment }] }
    assert.equal(parseState({ conversations: [sentOnly], currentId: sentOnly.id }), null)
  }
  for (const attachment of [selectedPoint(), makeAttachment('station'), makeAttachment('statue', 'photo')]) {
    const conversation = newConversation({ attachment, questions: [{ text: 'Here?', kind: 'question', attachment }] })
    const state = { conversations: [conversation], currentId: conversation.id }
    assert.deepEqual(parseState(JSON.parse(JSON.stringify(state))), state)
  }
  const legacy = migrateLegacyState(legacyState({ selected: makeAttachment('station'), chats: { station: { attachment: makeAttachment('station'), questions: ['Who designed it?'] } } }))
  assert.equal(attachmentTitle(legacy.conversations[0].attachment), 'Grand Central Terminal')
  assert.equal(legacy.conversations[0].attachment.place, undefined)
})

test('same-named locations use feature identity or coordinates, never the shared label alone', () => {
  const first = makeMapAttachment({ latitude: 40.753, longitude: -73.977, place: { name: 'Café', id: 'poi.1' } })
  const other = makeMapAttachment({ latitude: 40.754, longitude: -73.978, place: { name: 'Café', id: 'poi.2' } })
  assert.equal(samePlace(first, other), false)
  assert.equal(samePlace(first, { ...other, coordinates: { ...first.coordinates } }), false)
  assert.equal(samePlace(first, { ...first, place: { name: 'Café renamed', id: 'poi.1' } }), true)
  const withoutId = attachment => ({ ...attachment, place: { name: attachment.place.name } })
  assert.equal(samePlace(withoutId(first), withoutId(other)), false)
  assert.equal(samePlace(first, withoutId(first)), true)
  const withoutPosition = { ...withoutId(first), coordinates: undefined }
  assert.equal(samePlace(withoutPosition, structuredClone(withoutPosition)), false)
})

test('sample replies require both an exact known name and coordinates near the actual landmark', () => {
  const samples = [
    { subject: 'station', latitude: 40.7527, longitude: -73.9772, names: ['Grand Central Terminal', '  GRAND   CENTRAL  '] },
    { subject: 'graybar', latitude: 40.7527, longitude: -73.9756, names: ['Graybar Building', 'Graybar'] },
    { subject: 'chrysler', latitude: 40.7516, longitude: -73.9755, names: ['Chrysler Building', 'Chrysler'] },
  ]
  for (const sample of samples) {
    for (const name of sample.names) {
      const nearby = makeMapAttachment({ latitude: sample.latitude, longitude: sample.longitude, place: { name } })
      assert.equal(nearby.subject, sample.subject)
      assert.equal(samePlace(nearby, makeAttachment(sample.subject, 'photo')), true)
      const distant = makeMapAttachment({ latitude: 51.5, longitude: -0.12, place: { name } })
      assert.equal(distant.subject, 'point')
      assert.equal(samePlace(nearby, distant), false)
    }
    assert.equal(makeMapAttachment({ ...sample, place: { name: `${sample.names[0]} café` } }).subject, 'point')
    assert.equal(makeMapAttachment({ latitude: sample.latitude, longitude: sample.longitude }).subject, 'point')
  }
})

test('unlabeled or malformed feature metadata keeps a coordinate selection without guessing a place', () => {
  for (const place of [undefined, null, {}, { name: ' ' }, { name: 'Place', category: 123 }]) {
    const attachment = makeMapAttachment({ latitude: 40.7527, longitude: -73.9772, place })
    assert.equal(attachment.subject, 'point')
    assert.equal(attachmentTitle(attachment), 'Selected location')
    assert.equal(attachment.place, undefined)
    assert.deepEqual(attachment.coordinates, { latitude: 40.7527, longitude: -73.9772 })
  }
  const nameOnly = makeMapAttachment({ latitude: 40.753, longitude: -73.977, place: { name: 'A place' } })
  assert.deepEqual(nameOnly.place, { name: 'A place' })
  assert.throws(() => makeMapAttachment({ latitude: NaN, longitude: 0 }), RangeError)
})

test('selected photos and files keep only independent metadata with safe display names', () => {
  const file = { name: 'C:\\fakepath\\  itinerary.pdf  ', type: ' application/pdf ', size: 2048 }
  const first = makeUploadAttachment(file, 'file')
  const second = makeUploadAttachment(file, 'file')
  assert.equal(first.subject, 'point')
  assert.equal(first.source, 'file')
  assert.equal(first.location, '')
  assert.equal(first.coordinates, undefined)
  assert.equal(first.place, undefined)
  assert.equal(attachmentTitle(first), 'itinerary.pdf')
  assert.equal(first.upload.type, 'application/pdf')
  assert.equal(first.upload.size, 2048)
  assert.notEqual(first.upload.id, second.upload.id)
  file.name = 'changed.pdf'
  file.size = 1
  assert.equal(first.upload.name, 'itinerary.pdf')
  assert.equal(first.upload.size, 2048)
  const photo = makeUploadAttachment({ name: '/photos/\u0000building.jpg\n', type: 'image/jpeg', size: 0 }, 'photo')
  assert.equal(photo.source, 'photo')
  assert.equal(attachmentTitle(photo), 'building.jpg')
  assert.equal(attachmentTitle(makeUploadAttachment({ name: '   ', type: '', size: 0 }, 'photo')), 'Photo')
  assert.equal(attachmentTitle(makeUploadAttachment({ name: '..', type: '', size: 0 }, 'file')), 'File')
  const long = makeUploadAttachment({ name: 'A'.repeat(500), type: 'T'.repeat(500), size: 0 }, 'file')
  assert.equal(long.upload.name.length, 300)
  assert.equal(long.upload.type.length, 200)
  for (const size of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => makeUploadAttachment({ name: 'file', type: '', size }, 'file'), RangeError)
  }
})

test('upload identity uses a selection ID instead of filenames or generic photo subjects', () => {
  const file = { name: 'photo.jpg', type: 'image/jpeg', size: 123 }
  const first = makeUploadAttachment(file, 'photo')
  const second = makeUploadAttachment(file, 'photo')
  assert.equal(samePlace(first, second), false)
  assert.equal(samePlace(first, structuredClone(first)), true)
  assert.equal(samePlace(first, { ...first, upload: { ...first.upload, name: 'renamed.jpg' } }), true)
  assert.equal(samePlace(first, makeAttachment('point', 'photo')), false)
  assert.equal(samePlace(makeAttachment('point', 'photo'), first), false)
  assert.equal(samePlace(first, selectedPoint()), false)
  assert.equal(samePlace(first, null), false)
})

test('upload metadata round-trips in drafts and history without sharing mutable references', () => {
  for (const source of ['photo', 'file']) {
    const attachment = makeUploadAttachment({ name: 'Walking tour.pdf', type: 'application/pdf', size: 4000 }, source)
    const conversation = newConversation({ attachment, questions: [{ text: 'Which stops are nearby?', kind: 'question', attachment }] })
    const state = { conversations: [conversation], currentId: conversation.id }
    const saved = JSON.parse(JSON.stringify(state))
    const parsed = parseState(saved)
    assert.deepEqual(parsed, state)
    conversation.attachment.upload.name = 'Changed draft'
    assert.equal(conversation.questions[0].attachment.upload.name, 'Walking tour.pdf')
    assert.equal(attachment.upload.name, 'Walking tour.pdf')
    parsed.conversations[0].questions[0].attachment.upload.size = 1
    assert.equal(saved.conversations[0].questions[0].attachment.upload.size, 4000)
    assert.equal(parsed.conversations[0].attachment.upload.size, 4000)
    const reopened = reopenOnMap(state)
    const historic = recentConversations(reopened)[0]
    assert.equal(samePlace(historic.questions[0].attachment, attachment), true)
    historic.questions[0].attachment.upload.name = 'Changed history'
    assert.equal(conversation.questions[0].attachment.upload.name, 'Walking tour.pdf')
  }
})

test('invalid upload metadata and source combinations are rejected in drafts and sent history', () => {
  const attachment = makeUploadAttachment({ name: 'itinerary.pdf', type: '', size: 0 }, 'file')
  const malformedUploads = [
    null, [], {}, undefined,
    { ...attachment.upload, id: '' }, { ...attachment.upload, id: 123 },
    { ...attachment.upload, id: 'I'.repeat(301) },
    { ...attachment.upload, name: '' }, { ...attachment.upload, name: '   ' },
    { ...attachment.upload, name: 'N'.repeat(301) }, { ...attachment.upload, name: 'bad\u0000name' },
    { ...attachment.upload, type: null }, { ...attachment.upload, type: 'T'.repeat(201) },
    { ...attachment.upload, type: 'bad\ntype' },
    ...[-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, '4000'].map(size => ({ ...attachment.upload, size })),
  ]
  const malformedAttachments = [
    ...malformedUploads.map(upload => ({ ...attachment, upload })),
    { ...attachment, source: 'map' },
    { ...attachment, source: 'unknown' },
    { ...makeAttachment('point', 'photo'), upload: null },
  ]
  for (const invalid of malformedAttachments) {
    const conversation = { ...newConversation(), attachment: invalid }
    assert.equal(parseState({ conversations: [conversation], currentId: conversation.id }), null)
    const sentOnly = { ...conversation, attachment: null, questions: [{ text: 'Nearby?', kind: 'question', attachment: invalid }] }
    assert.equal(parseState({ conversations: [sentOnly], currentId: sentOnly.id }), null)
  }
  for (const valid of [attachment, makeAttachment('point', 'photo'), makeAttachment('graybar'), selectedPoint()]) {
    const conversation = newConversation({ attachment: valid, questions: [{ text: 'Nearby?', kind: 'question', attachment: valid }] })
    const state = { conversations: [conversation], currentId: conversation.id }
    assert.deepEqual(parseState(JSON.parse(JSON.stringify(state))), state)
  }
})

test('reopening after a conversation shows a fresh map session and preserves the history, draft and walk', () => {
  const route = makeRoute(emptyPreferences())
  const walk = { ...makeWalk(route), index: 1, arrived: true, visited: ['graybar'] }
  const walkConversation = newConversation({ title: walkTitle(route.preferences), route, walk })
  const conversation = newConversation({ attachment: selectedPoint(), draft: 'And when was it built?', questions: [question()] })
  const state = { conversations: [walkConversation, conversation], currentId: conversation.id }
  const original = structuredClone(state)
  const reopened = reopenOnMap(state)
  const current = reopened.conversations.find(item => item.id === reopened.currentId)
  assert.equal(reopened.conversations.length, 3)
  assert.equal(isVisibleConversation(current), false)
  assert.equal(current.attachment, null)
  assert.equal(current.draft, '')
  assert.deepEqual(recentConversations(reopened), recentConversations(state))
  assert.deepEqual(activeWalkConversation(reopened).walk, walk)
  assert.deepEqual(reopened.conversations.slice(0, 2), original.conversations)
  assert.deepEqual(reopenOnMap(reopened), reopened)
  reopened.conversations[0].walk.visited.push('station')
  reopened.conversations[1].attachment.coordinates.latitude = 42
  assert.deepEqual(state, original)
})

test('reopening an active walk keeps it resumable while reusing an existing empty map session', () => {
  const route = makeRoute(emptyPreferences())
  const active = newConversation({ route, walk: makeWalk(route) })
  const selected = newConversation({ attachment: selectedPoint() })
  const draft = newConversation({ draft: 'Keep my unsent question' })
  const empty = newConversation()
  const state = { conversations: [active, selected, draft, empty], currentId: active.id }
  const reopened = reopenOnMap(state)
  assert.equal(reopened.currentId, empty.id)
  assert.equal(reopened.conversations.length, state.conversations.length)
  assert.deepEqual(reopened.conversations, state.conversations)
  assert.equal(activeWalkConversation(reopened).id, active.id)
  assert.deepEqual(reopenOnMap(reopened), reopened)
})

test('reopening an unsent selection and draft retains the same hidden conversation', () => {
  const conversation = newConversation({ attachment: selectedPoint(), draft: 'Who designed this?' })
  const state = { conversations: [conversation], currentId: conversation.id }
  const reopened = reopenOnMap(state)
  assert.deepEqual(reopened, state)
  assert.deepEqual(recentConversations(reopened), [])
  reopened.conversations[0].attachment.coordinates.longitude = -74
  assert.equal(conversation.attachment.coordinates.longitude, -73.9772)
})
