export const subjects = {
  graybar: { name: 'Graybar Building', short: 'Graybar', detail: 'The building beside the station', question: 'Who designed this building?' },
  station: { name: 'Grand Central Terminal', short: 'Grand Central', detail: 'The station and its south façade', question: 'What should I look for here?' },
  statue: { name: 'Statue above the clock', short: 'Clock sculpture', detail: 'South façade of Grand Central', question: 'Who designed this statue?' },
  chrysler: { name: 'Chrysler Building', short: 'Chrysler', detail: 'The tower at 42nd and Lexington', question: 'Who designed this building?' },
  point: { name: 'Unidentified subject', short: 'Selected point', detail: 'A subject to identify together', question: 'What am I looking at here?' },
}

export type SubjectId = keyof typeof subjects
export type Source = 'map' | 'photo' | 'file'
export type Coordinates = { latitude: number; longitude: number }
export type PlaceDetails = { name: string; id?: string; category?: string }
export type UploadDetails = { id: string; name: string; type: string; size: number }
export type Attachment = { subject: SubjectId; source: Source; location: string; coordinates?: Coordinates; place?: PlaceDetails; upload?: UploadDetails }
export type Preferences = { time: number; interests: string[]; coffee: boolean; neighborhood: string }
export type Route = { preferences: Preferences; stops: SubjectId[] }
export type Walk = Route & { status: 'active' | 'paused' | 'ended' | 'complete'; index: number; arrived: boolean; visited: SubjectId[]; skipped: SubjectId[] }
export type Question = { text: string; attachment: Attachment | null; neighborhood?: string; kind: 'question' | 'plan' }
export type Conversation = {
  id: string
  title: string
  updatedAt: number
  attachment: Attachment | null
  draft: string
  questions: Question[]
  preferences: Preferences
  route: Route | null
  walk: Walk | null
}
export type DemoState = { conversations: Conversation[]; currentId: string }
type LegacyState = {
  selected: Attachment | null
  chats: Partial<Record<SubjectId, { attachment: Attachment; questions: string[] }>>
  drafts: Partial<Record<SubjectId | 'unattached', string>>
  preferences: Preferences
  route: Route | null
  walk: Walk | null
}

export const subjectIds = Object.keys(subjects) as SubjectId[]
export const routeStops: SubjectId[] = ['graybar', 'station', 'chrysler']
export const interestOptions = ['Architecture', 'Local history', 'Art', 'Everyday life']
export const timeOptions = [45, 60, 90]
// Matches the mockup's simulated current location, independently of map panning.
export const demoNeighborhood = 'Around Grand Central'
export const emptyPreferences = (): Preferences => ({ time: 45, interests: ['Architecture'], coffee: false, neighborhood: demoNeighborhood })
export const copyPreferences = (preferences: Preferences): Preferences => ({ ...preferences, interests: [...preferences.interests] })
export const makeRoute = (preferences: Preferences): Route => ({ preferences: copyPreferences(preferences), stops: [...routeStops] })
export const makeWalk = (route: Route): Walk => ({ ...copyRoute(route), status: 'active', index: 0, arrived: false, visited: [], skipped: [] })
export const makeAttachment = (subject: SubjectId, source: 'map' | 'photo' = 'map'): Attachment => ({ subject, source, location: 'Near Grand Central Terminal, New York' })

export function makeUploadAttachment(file: { name: string; type: string; size: number }, source: 'photo' | 'file'): Attachment {
  if (!Number.isSafeInteger(file.size) || file.size < 0) throw new RangeError('An attachment needs a valid file size.')
  const name = file.name.split(/[\\/]/).pop()!.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 300)
  return {
    subject: 'point', source, location: '',
    upload: {
      id: conversationId(),
      name: name && !/^\.+$/.test(name) ? name : source === 'photo' ? 'Photo' : 'File',
      type: file.type.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 200),
      size: file.size,
    },
  }
}

const sampleMapPlaces: { subject: SubjectId; aliases: string[]; coordinates: Coordinates; radius: number }[] = [
  { subject: 'station', aliases: ['grand central terminal', 'grand central'], coordinates: { latitude: 40.7527, longitude: -73.9772 }, radius: 180 },
  { subject: 'graybar', aliases: ['graybar building', 'graybar'], coordinates: { latitude: 40.7527, longitude: -73.9756 }, radius: 80 },
  { subject: 'chrysler', aliases: ['chrysler building', 'chrysler'], coordinates: { latitude: 40.7516, longitude: -73.9755 }, radius: 80 },
]

function sampleSubject(name: string, coordinates: Coordinates): SubjectId {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, ' ')
  const match = sampleMapPlaces.find(place => {
    if (!place.aliases.includes(normalized)) return false
    const north = (coordinates.latitude - place.coordinates.latitude) * 111_320
    const east = (coordinates.longitude - place.coordinates.longitude) * 111_320 * Math.cos(place.coordinates.latitude * Math.PI / 180)
    return Math.hypot(north, east) <= place.radius
  })
  return match?.subject ?? 'point'
}

export function makeMapAttachment(selection: Coordinates & { place?: PlaceDetails }): Attachment {
  if (!validCoordinates(selection)) throw new RangeError('A map selection needs valid coordinates.')
  const coordinates = { latitude: selection.latitude, longitude: selection.longitude }
  const place = validPlaceDetails(selection.place) ? {
    name: selection.place.name.trim(),
    ...(selection.place.id ? { id: selection.place.id.trim() } : {}),
    ...(selection.place.category ? { category: selection.place.category.trim() } : {}),
  } : undefined
  return {
    subject: place ? sampleSubject(place.name, coordinates) : 'point',
    source: 'map',
    location: `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}`,
    coordinates,
    ...(place ? { place } : {}),
  }
}

const copyAttachment = (attachment: Attachment | null): Attachment | null => attachment ? {
  ...attachment,
  ...(attachment.coordinates ? { coordinates: { ...attachment.coordinates } } : {}),
  ...(attachment.place ? { place: { ...attachment.place } } : {}),
  ...(attachment.upload ? { upload: { ...attachment.upload } } : {}),
} : null
const copyRoute = (route: Route): Route => ({ preferences: copyPreferences(route.preferences), stops: [...route.stops] })
const copyWalk = (walk: Walk): Walk => ({ ...copyRoute(walk), status: walk.status, index: walk.index, arrived: walk.arrived, visited: [...walk.visited], skipped: [...walk.skipped] })
const copyQuestion = (question: Question): Question => ({ text: question.text, kind: question.kind, attachment: copyAttachment(question.attachment), ...(question.neighborhood !== undefined ? { neighborhood: question.neighborhood } : {}) })
const copyConversation = (conversation: Conversation): Conversation => ({
  id: conversation.id,
  title: conversation.title,
  updatedAt: conversation.updatedAt,
  attachment: copyAttachment(conversation.attachment),
  draft: conversation.draft,
  questions: conversation.questions.map(copyQuestion),
  preferences: copyPreferences(conversation.preferences),
  route: conversation.route ? copyRoute(conversation.route) : null,
  walk: conversation.walk ? copyWalk(conversation.walk) : null,
})

let fallbackSequence = 0
function conversationId() {
  return globalThis.crypto?.randomUUID?.() ?? `conversation-${Date.now().toString(36)}-${(++fallbackSequence).toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function newConversation(overrides: Partial<Conversation> = {}): Conversation {
  return copyConversation({
    id: conversationId(), title: 'New conversation', updatedAt: Date.now(), attachment: null,
    draft: '', questions: [], preferences: emptyPreferences(), route: null, walk: null,
    ...overrides,
  })
}

export function initialState(): DemoState {
  const conversation = newConversation()
  return { conversations: [conversation], currentId: conversation.id }
}

export const isVisibleConversation = (conversation: Conversation): boolean => conversation.questions.length > 0 || conversation.route !== null
export const recentConversations = (state: DemoState): Conversation[] => state.conversations.filter(isVisibleConversation).sort((first, second) => second.updatedAt - first.updatedAt)

export function attachmentTitle(attachment: Attachment): string {
  if (attachment.upload) return attachment.upload.name
  if (attachment.place) return attachment.place.name
  return attachment.subject === 'point' && attachment.source === 'map' && attachment.coordinates
    ? 'Selected location'
    : subjects[attachment.subject].name
}

export function samePlace(first: Attachment | null, second: Attachment | null): boolean {
  if (first?.upload || second?.upload) return !!first?.upload && !!second?.upload && first.upload.id === second.upload.id
  if (!first || !second || first.subject !== second.subject) return false
  if (first.place?.id && second.place?.id) return first.place.id === second.place.id
  if (first.subject !== 'point') return true
  if (first.source !== second.source) return false
  if (first.coordinates || second.coordinates) {
    return !!first.coordinates && !!second.coordinates
      && first.coordinates.latitude === second.coordinates.latitude
      && first.coordinates.longitude === second.coordinates.longitude
  }
  // Named places need a stable identifier or a position, not a shared display name.
  if (first.place || second.place) return false
  return first.location === second.location
}

export function reopenOnMap(state: DemoState): DemoState {
  const conversations = state.conversations.map(copyConversation)
  const current = conversations.find(conversation => conversation.id === state.currentId)
  if (current && !isVisibleConversation(current)) return { conversations, currentId: current.id }
  // Keep any unsent draft or selected context separate from the fresh map session.
  const empty = conversations.find(conversation => !isVisibleConversation(conversation)
    && conversation.attachment === null && conversation.draft === '' && conversation.walk === null)
  if (empty) return { conversations, currentId: empty.id }
  const fresh = newConversation()
  return { conversations: [...conversations, fresh], currentId: fresh.id }
}

export function activeWalkConversation(state: DemoState): Conversation | undefined {
  const recent = recentConversations(state)
  return recent.find(conversation => conversation.walk?.status === 'active') || recent.find(conversation => conversation.walk?.status === 'paused')
}

function neighborhoodName(preferences: Preferences) {
  return preferences.neighborhood.replace(/^around\s+/i, '').trim().slice(0, 160) || 'the neighborhood'
}

export function walkTitle(preferences: Preferences): string {
  return `${neighborhoodName(preferences)} · ${preferences.interests[0] || 'Walk'}`
}

export function planningSummary(preferences: Preferences): string {
  const interests = preferences.interests.length ? ` focused on ${[...new Set(preferences.interests)].map(interest => interest.toLowerCase()).join(', ')}` : ''
  return `Plan a ${preferences.time}-minute walk around ${neighborhoodName(preferences)}${interests}${preferences.coffee ? ', with a coffee stop' : ''}.`
}

const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const isSubject = (value: unknown): value is SubjectId => typeof value === 'string' && Object.hasOwn(subjects, value)
const isText = (value: unknown): value is string => typeof value === 'string' && value.length <= 1000
const validCoordinates = (value: unknown): value is Coordinates => isRecord(value)
  && typeof value.latitude === 'number' && Number.isFinite(value.latitude) && value.latitude >= -90 && value.latitude <= 90
  && typeof value.longitude === 'number' && Number.isFinite(value.longitude) && value.longitude >= -180 && value.longitude <= 180
const validPlaceText = (value: unknown, limit: number): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= limit
const validPlaceDetails = (value: unknown): value is PlaceDetails => isRecord(value)
  && validPlaceText(value.name, 300)
  && (value.id === undefined || validPlaceText(value.id, 300))
  && (value.category === undefined || validPlaceText(value.category, 200))
const validUploadDetails = (value: unknown): value is UploadDetails => isRecord(value)
  && validPlaceText(value.id, 300) && validPlaceText(value.name, 300)
  && typeof value.type === 'string' && value.type.length <= 200
  && !/[\u0000-\u001f\u007f]/.test(value.name + value.type)
  && typeof value.size === 'number' && Number.isSafeInteger(value.size) && value.size >= 0
const validAttachment = (value: unknown): value is Attachment => isRecord(value) && isSubject(value.subject)
  && (value.source === 'map' || value.source === 'photo' || value.source === 'file') && isText(value.location)
  && (value.coordinates === undefined || validCoordinates(value.coordinates))
  && (value.place === undefined || validPlaceDetails(value.place))
  && (value.upload === undefined ? value.source !== 'file' : value.source !== 'map' && validUploadDetails(value.upload))
const validPreferences = (value: unknown): value is Preferences => isRecord(value) && typeof value.time === 'number' && timeOptions.includes(value.time) && Array.isArray(value.interests) && value.interests.every(interest => typeof interest === 'string' && interestOptions.includes(interest)) && typeof value.coffee === 'boolean' && isText(value.neighborhood)
const validRoute = (value: unknown): value is Route => isRecord(value) && validPreferences(value.preferences) && Array.isArray(value.stops) && value.stops.length >= 2 && value.stops.length <= 3 && value.stops.every(stop => isSubject(stop) && routeStops.includes(stop)) && new Set(value.stops).size === value.stops.length

function validWalk(value: unknown): value is Walk {
  if (!isRecord(value) || !validRoute(value)) return false
  const walk = value as unknown as Record<string, unknown>
  return typeof walk.status === 'string' && ['active', 'paused', 'ended', 'complete'].includes(walk.status)
    && typeof walk.index === 'number' && Number.isInteger(walk.index) && walk.index >= 0 && walk.index <= value.stops.length
    && typeof walk.arrived === 'boolean'
    && Array.isArray(walk.visited) && walk.visited.every(id => isSubject(id) && value.stops.includes(id))
    && Array.isArray(walk.skipped) && walk.skipped.every(id => isSubject(id) && value.stops.includes(id))
    && (walk.status === 'complete' ? walk.index === value.stops.length : walk.index < value.stops.length)
}

function validQuestion(value: unknown): value is Question {
  return isRecord(value) && isText(value.text) && (value.attachment === null || validAttachment(value.attachment)) && (value.kind === 'question' || value.kind === 'plan')
    && (value.neighborhood === undefined || validPlaceText(value.neighborhood, 160))
}

function validConversation(value: unknown): value is Conversation {
  return isRecord(value) && isText(value.id) && value.id.length > 0 && isText(value.title)
    && typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt) && value.updatedAt >= 0
    && (value.attachment === null || validAttachment(value.attachment)) && isText(value.draft)
    && Array.isArray(value.questions) && value.questions.length <= 80 && value.questions.every(validQuestion)
    && validPreferences(value.preferences) && (value.route === null || validRoute(value.route))
    && (value.walk === null || (value.route !== null && validWalk(value.walk)))
}

export function parseState(value: unknown): DemoState | null {
  if (!isRecord(value) || !isText(value.currentId) || !Array.isArray(value.conversations) || !value.conversations.length || !value.conversations.every(validConversation)) return null
  const ids = value.conversations.map(conversation => conversation.id)
  if (new Set(ids).size !== ids.length || !ids.includes(value.currentId)) return null
  return { conversations: value.conversations.map(copyConversation), currentId: value.currentId }
}

function validLegacyState(value: unknown): value is LegacyState {
  return isRecord(value) && (value.selected === null || validAttachment(value.selected))
    && validPreferences(value.preferences) && (value.route === null || validRoute(value.route))
    && (value.walk === null || validWalk(value.walk)) && isRecord(value.chats) && isRecord(value.drafts)
    && Object.entries(value.chats).every(([id, chat]) => isSubject(id) && isRecord(chat) && validAttachment(chat.attachment) && chat.attachment.subject === id && Array.isArray(chat.questions) && chat.questions.length <= 80 && chat.questions.every(isText))
    && Object.entries(value.drafts).every(([id, draft]) => (id === 'unattached' || isSubject(id)) && isText(draft))
}

function sameRoute(first: Route, second: Route): boolean {
  return first.preferences.time === second.preferences.time
    && first.preferences.neighborhood === second.preferences.neighborhood
    && first.preferences.coffee === second.preferences.coffee
    && JSON.stringify(first.preferences.interests) === JSON.stringify(second.preferences.interests)
    && JSON.stringify(first.stops) === JSON.stringify(second.stops)
}

export function migrateLegacyState(value: unknown): DemoState | null {
  if (!validLegacyState(value)) return null
  const conversations: Conversation[] = []
  let currentId = ''
  const importedAt = Date.now()
  for (const id of subjectIds) {
    const chat = value.chats[id]
    if (!chat && !Object.hasOwn(value.drafts, id) && value.selected?.subject !== id) continue
    const attachment = value.selected?.subject === id ? value.selected : chat?.attachment || makeAttachment(id)
    const conversation = newConversation({
      title: subjects[id].name, updatedAt: importedAt, attachment,
      draft: value.drafts[id] || '', preferences: value.preferences,
      questions: (chat?.questions || []).map(text => ({ text, attachment: chat?.attachment || attachment, kind: 'question' })),
    })
    conversations.push(conversation)
    if (value.selected?.subject === id) currentId = conversation.id
  }
  // The old global route had no reliable link to a subject chat. Keep it separate.
  function importRoute(route: Route, walk: Walk | null) {
    conversations.push(newConversation({
      title: walkTitle(route.preferences), updatedAt: importedAt,
      preferences: route.preferences, route, walk,
      questions: [{ text: planningSummary(route.preferences), attachment: null, kind: 'plan' }],
    }))
  }
  const combined = value.route && value.walk && sameRoute(value.route, value.walk)
  if (value.route) importRoute(value.route, combined ? value.walk : null)
  if (value.walk && !combined) importRoute(value.walk, value.walk)
  // Keep an unattached draft even when another subject was selected.
  if (!currentId || Object.hasOwn(value.drafts, 'unattached')) {
    const conversation = newConversation({ updatedAt: importedAt, draft: value.drafts.unattached || '', preferences: value.preferences })
    conversations.push(conversation)
    if (!currentId) currentId = conversation.id
  }
  return { conversations, currentId }
}
