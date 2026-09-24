import { prototypeAnswer } from '../lib/prototype-answer'
import { type ChangeEvent, type FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IosButton as Button } from '../components/ui/ios-button'
import { IonApp, IonBadge, IonButtons, IonCheckbox, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonNote, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToggle, IonToolbar } from '@ionic/react'
import { IosPopover } from '../components/ui/ios-popover'
import { phoneSelectInterfaceOptions } from '../lib/ios-overlays'
import { focusElement } from '../lib/ios-focus'
import '../lib/ios-components'
import LiveMap, { initialMapViewport, type MapViewport, type MapLocation } from './LiveMap'
import { addOutline, arrowDownOutline, arrowUpOutline, cameraOutline, chatbubbleOutline, chevronDownOutline, closeOutline, createOutline, documentOutline, imageOutline, locationOutline, menuOutline, micOutline, square, trashOutline, walkOutline } from 'ionicons/icons'
import './ios-wireframe.css'
import './ios-components.css'
import './ios-buttons.css'
import './ios-overlays.css'

import {
  subjects, routeStops, interestOptions, timeOptions, initialState, newConversation,
  copyPreferences, emptyPreferences, demoNeighborhood, makeRoute, makeWalk, makeAttachment, makeMapAttachment, makeUploadAttachment,
  recentConversations, activeWalkConversation, parseState, migrateLegacyState,
  planningSummary, walkTitle, attachmentTitle, samePlace, reopenOnMap,
  type SubjectId, type Attachment, type Conversation, type DemoState, type Question, type Walk,
} from '../lib/mockup-state'

type View = 'home' | 'camera' | 'photo' | 'chat' | 'plan' | 'route' | 'walk' | 'recent'
type VoiceRecognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onstart: (() => void) | null
  onend: (() => void) | null
  onerror: ((event: { error: string }) => void) | null
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
}
type VoiceWindow = Window & {
  SpeechRecognition?: new () => VoiceRecognition
  webkitSpeechRecognition?: new () => VoiceRecognition
}
const storageKey = 'placewise-ios-wireframe-v4'
function readState(): DemoState {
  try {
    const current = parseState(JSON.parse(localStorage.getItem(storageKey) || 'null'))
    if (current) return reopenOnMap(current)
    return reopenOnMap(migrateLegacyState(JSON.parse(localStorage.getItem('placewise-ios-wireframe-v3') || 'null')) || initialState())
  } catch { return initialState() }
}

export default function Mockup({ mode = 'light', freshStart = false }: { mode?: 'light' | 'dark'; freshStart?: boolean }) {
  const [state, setState] = useState<DemoState>(() => freshStart ? initialState() : readState())
  const [view, setView] = useState<View>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [attachmentOpen, setAttachmentOpen] = useState(false)
  const [attachmentMessage, setAttachmentMessage] = useState('')
  const attachmentTrigger = useRef<HTMLIonButtonElement>(null)
  const phone = useRef<HTMLDivElement>(null)
  const menu = useRef<HTMLIonMenuElement>(null)
  const pendingCamera = useRef(false)
  const subjectSelect = useRef<HTMLIonSelectElement>(null)
  const neighborhoodSelect = useRef<HTMLIonSelectElement>(null)
  const stopTrigger = useRef<HTMLIonButtonElement>(null)
  const [editingStop, setEditingStop] = useState<SubjectId | null>(null)
  const photoPicker = useRef<HTMLInputElement>(null)
  const filePicker = useRef<HTMLInputElement>(null)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const keyboardPanel = useRef<HTMLDivElement>(null)
  const pointerStartedInMessage = useRef(false)
  const [keyboardShift, setKeyboardShift] = useState(true)
  const [keyboardNumbers, setKeyboardNumbers] = useState(false)
  const [keyboardEmoji, setKeyboardEmoji] = useState(false)
  const [voiceState, setVoiceState] = useState<'idle' | 'starting' | 'listening' | 'stopping'>('idle')
  const [voiceMessage, setVoiceMessage] = useState('')
  const recognitionRef = useRef<VoiceRecognition | null>(null)
  const voiceStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [nativeKeyboard, setNativeKeyboard] = useState(() => window.matchMedia('(pointer: coarse)').matches)
  const [planStep, setPlanStep] = useState(0)
  const [planReturn, setPlanReturn] = useState<View>('home')
  const [editingPlan, setEditingPlan] = useState(false)
  const [planConversationId, setPlanConversationId] = useState<string | null>(null)
  const [planPreferences, setPlanPreferences] = useState(emptyPreferences)
  const [cameraReturn, setCameraReturn] = useState<View>('home')
  const [photoSubject, setPhotoSubject] = useState<SubjectId>('statue')
  const [photoLocation, setPhotoLocation] = useState('Near Grand Central Terminal, New York')
  const heading = useRef<HTMLIonTitleElement>(null)
  const content = useRef<HTMLIonContentElement>(null)
  const questionField = useRef<HTMLIonTextareaElement>(null)
  const questionInput = useRef<HTMLTextAreaElement | null>(null)
  const firstRender = useRef(true)
  const menuTrigger = useRef<HTMLIonButtonElement>(null)
  const menuClose = useRef<HTMLIonButtonElement>(null)
  const menuNavigated = useRef(false)
  const mapViewports = useRef(new Map<string, { current: MapViewport }>())
  const conversation = state.conversations.find(item => item.id === state.currentId)!
  if (!mapViewports.current.has(conversation.id)) mapViewports.current.set(conversation.id, { current: initialMapViewport() })
  const mapViewport = mapViewports.current.get(conversation.id)!
  const selected = conversation.attachment
  const draft = conversation.draft
  const fullHeight = ['plan', 'camera', 'photo', 'recent'].includes(view)
  const walk = conversation.walk
  const inWalk = walk?.status === 'active' || walk?.status === 'paused'
  const activeConversation = activeWalkConversation(state)
  const currentStop = walk && walk.index < walk.stops.length ? walk.stops[walk.index] : null
  const route = conversation.route
  const routeWalking = route ? route.stops.length === 3 ? 12 : 8 : 12
  const currentQuestions = conversation.questions
  const history = recentConversations(state)
  const voiceActive = voiceState !== 'idle'

  function openAttachments() {
    cancelVoiceInput()
    dismissKeyboard()
    setAttachmentMessage('')
    setAttachmentOpen(true)
  }
  function chooseUpload(source: 'photo' | 'file') {
    const input = source === 'photo' ? photoPicker.current : filePicker.current
    if (!input) return
    input.value = ''
    setAttachmentOpen(false)
    input.click()
  }
  function receiveUpload(event: ChangeEvent<HTMLInputElement>, source: 'photo' | 'file') {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    if (source === 'photo' && !file.type.startsWith('image/') && !/\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|tiff?|webp)$/i.test(file.name)) {
      setAttachmentMessage('Choose an image for Photo, or use File for a document.')
      return
    }
    const attachment = makeUploadAttachment(file, source)
    updateConversation(item => ({ ...item, attachment, title: item.questions.length || item.route ? item.title : attachmentTitle(attachment) }))
    setAttachmentMessage('')
    focusElement(attachmentTrigger.current, { preventScroll: true })
  }

  function releaseVoiceInput() {
    if (voiceStopTimer.current) clearTimeout(voiceStopTimer.current)
    voiceStopTimer.current = null
    const recognition = recognitionRef.current
    recognitionRef.current = null
    if (!recognition) return
    recognition.onstart = recognition.onresult = recognition.onerror = recognition.onend = null
    try { recognition.abort() } catch { /* The browser may already have ended recognition. */ }
  }
  function cancelVoiceInput() {
    releaseVoiceInput()
    setVoiceState('idle')
    setVoiceMessage('')
  }
  function stopVoiceInput() {
    const recognition = recognitionRef.current
    if (!recognition || voiceState === 'stopping') return
    setVoiceState('stopping')
    // Keep result callbacks alive until the browser delivers its final transcript.
    voiceStopTimer.current = setTimeout(() => {
      if (recognitionRef.current !== recognition) return
      releaseVoiceInput()
      setVoiceState('idle')
    }, 4000)
    try { recognition.stop() } catch { cancelVoiceInput() }
  }
  function startVoiceInput() {
    if (recognitionRef.current) return
    dismissKeyboard()
    setVoiceMessage('')
    const Recognition = (window as VoiceWindow).SpeechRecognition || (window as VoiceWindow).webkitSpeechRecognition
    if (!Recognition) {
      setVoiceMessage('Voice input isn’t available in this browser. Try your keyboard’s mic or type a message.')
      return
    }
    const conversationId = conversation.id
    let transcript = ''
    try {
      const recognition = new Recognition()
      recognitionRef.current = recognition
      recognition.lang = navigator.language || 'en-US'
      recognition.continuous = false
      recognition.interimResults = true
      setVoiceState('starting')
      recognition.onstart = () => {
        if (recognitionRef.current === recognition) setVoiceState(value => value === 'starting' ? 'listening' : value)
      }
      recognition.onresult = event => {
        if (recognitionRef.current !== recognition) return
        transcript = Array.from(event.results, result => result[0]?.transcript || '').join(' ').trim().slice(0, 500)
        updateConversation(item => ({ ...item, draft: transcript }), conversationId)
      }
      recognition.onerror = event => {
        if (recognitionRef.current !== recognition) return
        const message = event.error === 'not-allowed'
          ? 'Microphone access is blocked. Allow it in your browser settings, then try again.'
          : event.error === 'service-not-allowed' ? 'This browser’s speech service isn’t available. Try your keyboard’s mic or type a message.'
          : event.error === 'no-speech' ? 'No speech detected. Tap the mic to try again.'
          : event.error === 'audio-capture' ? 'No microphone found. Connect one and try again.'
          : event.error === 'aborted' ? ''
          : 'Voice transcription couldn’t connect. Try again or type your message.'
        releaseVoiceInput()
        setVoiceState('idle')
        setVoiceMessage(message)
      }
      recognition.onend = () => {
        if (recognitionRef.current !== recognition) return
        releaseVoiceInput()
        setVoiceState('idle')
        if (!transcript) setVoiceMessage('No speech detected. Tap the mic to try again.')
      }
      recognition.start()
    } catch {
      releaseVoiceInput()
      setVoiceState('idle')
      setVoiceMessage('Voice input couldn’t start. Try again or type your message.')
    }
  }

  useEffect(() => {
    const hidden = () => { if (document.hidden) cancelVoiceInput() }
    const leaving = () => cancelVoiceInput()
    document.addEventListener('visibilitychange', hidden)
    window.addEventListener('pagehide', leaving)
    return () => {
      document.removeEventListener('visibilitychange', hidden)
      window.removeEventListener('pagehide', leaving)
      releaseVoiceInput()
    }
  }, [])

  useLayoutEffect(() => {
    let disposed = false
    let observer: ResizeObserver | undefined
    questionField.current?.getInputElement().then(input => {
      if (disposed) return
      questionInput.current = input
      if (voiceMessage) input.setAttribute('aria-describedby', 'pi-voice-message')
      else input.removeAttribute('aria-describedby')
      const resize = () => {
        input.style.height = '0px'
        input.style.height = `${Math.min(120, input.scrollHeight)}px`
      }
      resize()
      let width = input.clientWidth
      observer = new ResizeObserver(() => {
        if (input.clientWidth === width) return
        width = input.clientWidth
        resize()
      })
      observer.observe(input)
    })
    return () => { disposed = true; observer?.disconnect(); questionInput.current = null }
  }, [draft, view, voiceMessage])

  useEffect(() => {
    // Remember where a tap began: focusing the message field opens the keypad
    // and can move the field before pointerup changes the click's target.
    const rememberPointerStart = (event: PointerEvent) => {
      pointerStartedInMessage.current = event.composedPath().some(node => node === questionField.current)
    }
    const cancelPointer = () => { pointerStartedInMessage.current = false }
    const dismissOnOutsideClick = (event: MouseEvent) => {
      const startedInMessage = pointerStartedInMessage.current
      pointerStartedInMessage.current = false
      const path = event.composedPath()
      if (!keyboardOpen || startedInMessage || path.some(node => node === questionField.current || node === keyboardPanel.current)) return
      // Dismiss after the click target is resolved so other controls still act
      // on their first click. Capture also covers clicks handled by Mapbox.
      setKeyboardOpen(false)
      questionInput.current?.blur()
    }
    document.addEventListener('pointerdown', rememberPointerStart, true)
    document.addEventListener('pointercancel', cancelPointer, true)
    document.addEventListener('click', dismissOnOutsideClick, true)
    return () => {
      document.removeEventListener('pointerdown', rememberPointerStart, true)
      document.removeEventListener('pointercancel', cancelPointer, true)
      document.removeEventListener('click', dismissOnOutsideClick, true)
    }
  }, [keyboardOpen])

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)')
    const changed = () => setNativeKeyboard(media.matches)
    media.addEventListener('change', changed)
    return () => media.removeEventListener('change', changed)
  }, [])

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(state)) } catch { /* Keep state in memory when storage is unavailable. */ }
  }, [state])
  useEffect(() => {
    content.current?.scrollToTop(0)
    if (firstRender.current) { firstRender.current = false; return }
    heading.current?.focus({ preventScroll: true })
  }, [view, planStep, state.currentId])
  useEffect(() => {
    if (view === 'chat' && currentQuestions.length) content.current?.scrollToBottom(0)
  }, [currentQuestions.length, view, keyboardOpen])
  function openMenu() {
    cancelVoiceInput()
    dismissKeyboard()
    menuNavigated.current = false
    void menu.current?.open()
  }
  function menuDismissed() {
    setMenuOpen(false)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (menuNavigated.current) {
        if (view === 'home') focusElement(menuTrigger.current)
        else heading.current?.focus({ preventScroll: true })
      } else focusElement(menuTrigger.current)
    }))
  }
  function dismissKeyboard() { setKeyboardOpen(false); questionInput.current?.blur() }
  function navigate(next: View) { cancelVoiceInput(); dismissKeyboard(); menuNavigated.current = menuOpen; void menu.current?.close(); setAttachmentOpen(false); setEditingStop(null); setAttachmentMessage(''); setView(next) }
  function startNewChat() {
    const item = newConversation()
    mapViewports.current.set(item.id, { current: { ...mapViewport.current, center: [...mapViewport.current.center] } })
    setState(value => ({ ...value, currentId: item.id, conversations: [...value.conversations, item] }))
    navigate('home')
  }
  function updateConversation(update: (item: Conversation) => Conversation, id = state.currentId) {
    setState(value => ({ ...value, conversations: value.conversations.map(item => item.id === id ? { ...update(item), updatedAt: Date.now() } : item) }))
  }
  function attach(attachment: Attachment, fromMapHome = view === 'home') {
    setState(value => {
      const current = value.conversations.find(item => item.id === value.currentId)!
      const previousAttachment = current.attachment || current.questions.at(-1)?.attachment || null
      const switchChat = (current.route && fromMapHome) || (!current.route && current.questions.length > 0 && !samePlace(previousAttachment, attachment))
      const target = switchChat
        ? value.conversations.find(item => !item.route && samePlace(item.attachment, attachment)) || newConversation()
        : current
      if (!mapViewports.current.has(target.id)) mapViewports.current.set(target.id, { current: { ...mapViewport.current, center: [...mapViewport.current.center] } })
      const next = { ...target, attachment, title: target.route ? target.title : attachmentTitle(attachment), updatedAt: Date.now() }
      return { currentId: next.id, conversations: value.conversations.some(item => item.id === next.id) ? value.conversations.map(item => item.id === next.id ? next : item) : [...value.conversations, next] }
    })
    navigate('home')
  }
  function selectLocation(location: MapLocation) {
    attach(makeMapAttachment(location))
  }
  function removeContext() {
    updateConversation(item => ({ ...item, attachment: null }))
  }
  function ask(question: string) {
    const text = question.trim()
    if (!text || recognitionRef.current) return
    updateConversation(item => {
      const neighborhood = item.route?.preferences.neighborhood.trim().slice(0, 160) || demoNeighborhood
      return {
        ...item,
        title: item.route || (item.attachment?.upload && item.questions.length) ? item.title : item.attachment ? attachmentTitle(item.attachment) : item.questions.length ? item.title : neighborhood,
        questions: [...item.questions, { text, attachment: item.attachment ? { ...item.attachment, ...(item.attachment.coordinates ? { coordinates: { ...item.attachment.coordinates } } : {}), ...(item.attachment.place ? { place: { ...item.attachment.place } } : {}), ...(item.attachment.upload ? { upload: { ...item.attachment.upload } } : {}) } : null, ...(!item.attachment || item.attachment.upload ? { neighborhood } : {}), kind: 'question' as const }].slice(-80),
        draft: '',
      }
    })
    navigate('chat')
  }
  function submitQuestion(event: FormEvent) { event.preventDefault(); ask(draft) }
  function typeKey(key: string) {
    const input = questionInput.current
    const start = input?.selectionStart ?? draft.length
    const end = input?.selectionEnd ?? draft.length
    const from = key === 'Backspace' && start === end ? Array.from(draft.slice(0, start)).slice(0, -1).join('').length : start
    const text = key === 'Backspace' ? '' : key
    const next = draft.slice(0, from) + text + draft.slice(end)
    if (next.length > 500) return
    updateConversation(item => ({ ...item, draft: next }))
    if (/^[A-Z]$/.test(key)) setKeyboardShift(false)
    requestAnimationFrame(() => {
      if (!keyboardPanel.current) return
      input?.focus({ preventScroll: true })
      input?.setSelectionRange(Math.min(from + text.length, next.length), Math.min(from + text.length, next.length))
    })
  }
  function openConversation(id: string, destination?: View) {
    const item = state.conversations.find(item => item.id === id)
    if (!item) return
    setState(value => ({ ...value, currentId: id }))
    navigate(destination || (item.route ? 'route' : 'chat'))
  }
  function openCamera() { if (view !== 'camera' && view !== 'photo') setCameraReturn(view); setPhotoSubject('statue'); setPhotoLocation('Near Grand Central Terminal, New York'); navigate('camera') }
  function attachPhoto() { attach({ subject: photoSubject, source: 'photo', location: photoLocation.trim() || 'Location not provided' }, cameraReturn === 'home') }
  function openPlan(fromConversation = false) {
    setPlanReturn(view)
    setEditingPlan(false)
    setPlanConversationId(fromConversation ? conversation.id : null)
    setPlanPreferences(emptyPreferences())
    setPlanStep(0)
    navigate('plan')
  }
  function previewRoute() {
    const preferences = copyPreferences(planPreferences)
    const request: Question = { text: planningSummary(preferences), attachment: null, kind: 'plan' }
    if ((editingPlan && route) || planConversationId) {
      updateConversation(item => ({ ...item, preferences, title: walkTitle(preferences), route: item.route ? { ...item.route, preferences } : makeRoute(preferences), questions: [...item.questions, request].slice(-80) }), planConversationId || conversation.id)
    } else {
      const item = newConversation({ title: walkTitle(preferences), preferences, route: makeRoute(preferences), questions: [request] })
      setState(value => ({ ...value, currentId: item.id, conversations: [...value.conversations, item] }))
    }
    navigate('route')
  }
  function editRoutePreferences() {
    if (!route) return
    setPlanPreferences(copyPreferences(route.preferences))
    setEditingPlan(true)
    setPlanConversationId(null)
    setPlanReturn('route'); setPlanStep(0); navigate('plan')
  }
  function changeStop(index: number, direction: -1 | 1) {
    updateConversation(item => {
      if (!item.route) return item
      const stops = [...item.route.stops]
      const target = index + direction
      if (!Number.isInteger(index) || index < 0 || index >= stops.length || target < 0 || target >= stops.length) return item
      ;[stops[index], stops[target]] = [stops[target], stops[index]]
      return { ...item, route: { ...item.route, stops } }
    })
  }
  function activateWalk(id: string) {
    setState(value => ({ ...value, currentId: id, conversations: value.conversations.map(item => {
      if (item.id === id && item.walk) return { ...item, updatedAt: Date.now(), walk: { ...item.walk, status: 'active' as const } }
      if (item.walk?.status === 'active') return { ...item, walk: { ...item.walk, status: 'paused' as const } }
      return item
    }) }))
    navigate('walk')
  }
  function startWalk() {
    if (!route) return
    if (inWalk) { activateWalk(conversation.id); return }
    setState(value => ({ ...value, conversations: value.conversations.map(item => {
      if (item.id === value.currentId) return { ...item, walk: makeWalk(route), updatedAt: Date.now() }
      return item.walk?.status === 'active' ? { ...item, walk: { ...item.walk, status: 'paused' as const } } : item
    }) }))
    navigate('walk')
  }
  function advanceWalk(skip = false) {
    updateConversation(item => {
      const current = item.walk
      if (!current || current.status !== 'active' || current.index >= current.stops.length) return item
      const stop = current.stops[current.index]
      const index = current.index + 1
      return { ...item, walk: { ...current, index, arrived: false, visited: skip ? current.visited : [...current.visited, stop], skipped: skip ? [...current.skipped, stop] : current.skipped, status: index === current.stops.length ? 'complete' : 'active' } }
    })
  }
  function setWalkStatus(status: Walk['status']) {
    if (status === 'active') { activateWalk(conversation.id); return }
    updateConversation(item => item.walk ? { ...item, walk: { ...item.walk, status } } : item)
  }
  function askAtStop() {
    if (!currentStop) return
    updateConversation(item => ({ ...item, attachment: makeAttachment(currentStop) }))
    navigate('chat')
  }
  function historyItem(item: Conversation) {
    return <IonItem mode="ios" key={item.id} button detail className="pi-history-item" data-current={item.id === conversation.id || undefined} aria-current={item.id === conversation.id ? 'true' : undefined} onClick={() => openConversation(item.id)}>
      <IonIcon slot="start" icon={item.route ? walkOutline : chatbubbleOutline} aria-hidden="true" />
      <IonLabel><strong>{item.title}</strong><p>{item.route ? `Walk · ${item.route.preferences.time} min` : 'Chat'}</p></IonLabel>
    </IonItem>
  }
  function contextAttachment() {
    if (!selected) return null
    const title = attachmentTitle(selected)
    return <IonItem mode="ios" className="pi-context" lines="none" role="status">
      <IonIcon slot="start" icon={selected.upload ? selected.source === 'photo' ? imageOutline : documentOutline : locationOutline} aria-hidden="true" />
      <IonLabel><strong>{title}</strong>{selected.upload ? <p>{selected.source === 'photo' ? 'Photo' : 'File'}</p> : (selected.source === 'photo' || (selected.coordinates && !selected.place)) && <p>{selected.source === 'photo' ? 'Photo · ' : ''}{selected.location}</p>}</IonLabel>
      <Button slot="end" variant="ghost" size="icon" aria-label={`Remove ${title} from your question`} onClick={removeContext}><IonIcon slot="icon-only" icon={closeOutline} aria-hidden="true" /></Button>
    </IonItem>
  }
  function answer(question: Question, index: number) {
    const { reply, source } = prototypeAnswer(question)
    return <div className="pi-chat-turn" key={`${index}-${question.text}`}>
      {question.attachment && !samePlace(question.attachment, selected) && <small>{attachmentTitle(question.attachment)}</small>}
      {!question.attachment && question.neighborhood && <small>{question.neighborhood}</small>}
      <p className="pi-question">{question.text}</p>
      {question.kind === 'question' && <div className="pi-answer"><small>Sample response</small><p>{reply}</p>{source && <a href={source} target="_blank" rel="noreferrer">Source</a>}</div>}
    </div>
  }

  const title = view === 'plan' ? planStep ? 'Interests' : 'Time'
    : view === 'recent' ? 'Recent conversations'
    : view === 'walk' && walk ? walk.status === 'complete' ? 'Walk complete' : walk.status === 'ended' ? 'Walk ended' : currentStop ? subjects[currentStop].name : 'Walk'
    : view === 'camera' ? 'Camera' : view === 'photo' ? 'Photo' : view === 'route' ? 'Route' : 'Chat'
  const editIndex = route && editingStop ? route.stops.indexOf(editingStop) : -1

  return <section className="ios-mockup" data-mode={mode} aria-label="Interactive wireframe">
    <div className="ios-mockup-stage"><div className="pi-device">
      <div ref={phone} className="pi-phone" data-view={view} data-keyboard={keyboardOpen} data-native-keyboard={nativeKeyboard} onKeyDown={event => {
        if (event.key !== 'Escape') return
        // Ionic overlays own Escape while their focus trap is active.
        if (event.nativeEvent.composedPath().some(target => target instanceof HTMLElement && target.tagName === 'ION-POPOVER')) return
        if (editingStop) { event.preventDefault(); setEditingStop(null); return }
        if (attachmentOpen) { event.preventDefault(); setAttachmentOpen(false); return }
        if (recognitionRef.current) { event.preventDefault(); cancelVoiceInput(); return }
        if (menuOpen) { event.preventDefault(); void menu.current?.close(); return }
        if (keyboardOpen) { event.preventDefault(); dismissKeyboard(); return }
        if (view === 'photo') navigate('camera')
        else if (view === 'camera') navigate(cameraReturn)
        else if (view === 'plan' && planStep > 0) setPlanStep(0)
        else if (view === 'plan') navigate(planReturn)
        else navigate('home')
      }}>
      <IonApp className="pi-app">
        <IonMenu ref={menu} id="pi-menu" contentId="ion-view-container-root" className="pi-side-menu" type="overlay" swipeGesture={false} aria-label="Menu" onIonWillOpen={() => setMenuOpen(true)} onIonDidOpen={() => requestAnimationFrame(() => focusElement(menuClose.current))} onIonDidClose={menuDismissed}>
          <IonHeader className="ion-no-border"><IonToolbar><IonTitle>Menu</IonTitle><IonButtons slot="end"><Button ref={menuClose} variant="ghost" size="icon" aria-label="Close menu" onClick={() => void menu.current?.close()}><IonIcon slot="icon-only" icon={closeOutline} aria-hidden="true" /></Button></IonButtons></IonToolbar></IonHeader>
          <IonContent>
            <IonList mode="ios" lines="inset">
              {activeConversation && <IonItem button detail onClick={() => activateWalk(activeConversation.id)}><IonIcon slot="start" icon={walkOutline} aria-hidden="true" /><IonLabel><strong>Resume walk</strong><p>{activeConversation.title}</p></IonLabel></IonItem>}
              <IonItem button detail onClick={() => openPlan()}><IonIcon slot="start" icon={addOutline} aria-hidden="true" /><IonLabel>Plan a walk</IonLabel></IonItem>
            </IonList>
            <IonList mode="ios" lines="inset" className="pi-history-list">
              <IonListHeader><IonLabel>Recent conversations</IonLabel></IonListHeader>
              {history.length ? history.slice(0, 3).map(historyItem) : <IonItem lines="none"><IonNote>No conversations yet</IonNote></IonItem>}
              {history.length > 0 && <IonItem button detail onClick={() => navigate('recent')}><IonLabel>View all</IonLabel></IonItem>}
            </IonList>
          </IonContent>
          <IonFooter className="pi-menu-footer ion-no-border"><IonToolbar><Button className="pi-full" onClick={startNewChat}><IonIcon slot="start" icon={createOutline} aria-hidden="true" />New chat</Button></IonToolbar></IonFooter>
        </IonMenu>
        {/* Assets exported from the supplied iOS 18 kit; colors remain Placewise roles. */}
        <div className="pi-status-bar" aria-hidden="true">
          <span className="pi-status-time">9:41</span>
          <span className="pi-status-island" />
          <span className="pi-status-icons">
            <span className="pi-system-symbol pi-status-cellular" />
            <span className="pi-system-symbol pi-status-wifi" />
            <span className="pi-system-symbol pi-status-battery" />
          </span>
        </div>
        <div id="ion-view-container-root" className="pi-main">
        {!fullHeight && <section className="pi-map" aria-label="Neighborhood map" inert={menuOpen || attachmentOpen}>
          <LiveMap key={conversation.id} selectedLocation={view === 'walk' || !selected?.coordinates ? undefined : { ...selected.coordinates, place: selected.place }} onSelectLocation={selectLocation} viewport={mapViewport} mode={mode} />
          <Button ref={menuTrigger} className="pi-menu-trigger" variant="ghost" size="icon" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls="pi-menu" onClick={openMenu}><IonIcon slot="icon-only" icon={menuOutline} aria-hidden="true" /></Button>
        </section>}
        <section className="pi-sheet" aria-label={view === 'home' || view === 'chat' ? 'Chat' : view === 'recent' ? 'Recent conversations' : 'Plan'} inert={menuOpen || attachmentOpen}>
          {view !== 'home' && <IonHeader className="pi-sheet-header ion-no-border"><IonToolbar>
            {view === 'chat' ? <><IonButtons slot="start"><Button variant="ghost" size="icon" aria-label="Back to map" onClick={() => { navigate('home'); focusElement(menuTrigger.current) }}><IonIcon slot="icon-only" icon={chevronDownOutline} aria-hidden="true" /></Button></IonButtons><IonTitle ref={heading} tabIndex={-1} className="sr-only">Chat</IonTitle><IonButtons slot="end"><Button variant="ghost" className="pi-conversation-link" onClick={() => route ? navigate('route') : openPlan(true)}><IonIcon slot="start" icon={walkOutline} aria-hidden="true" />{route ? 'View walk' : 'Plan a walk'}</Button></IonButtons></> : <>
              {view === 'photo' && <IonButtons slot="start"><Button variant="ghost" onClick={() => navigate('camera')}>Retake</Button></IonButtons>}
              {(view === 'route' || view === 'walk' || view === 'recent') && <IonButtons slot="start"><Button variant="ghost" onClick={() => navigate('home')}>Map</Button></IonButtons>}
              <IonTitle ref={heading} className="pi-title" role="heading" aria-level={2} tabIndex={-1}>{title}</IonTitle>
              <IonButtons slot="end">
                {(view === 'camera' || view === 'photo') && <Button variant="ghost" onClick={() => navigate(cameraReturn)}>Cancel</Button>}
                {view === 'plan' && <Button variant="ghost" onClick={() => planStep ? setPlanStep(0) : navigate(planReturn)}>{planStep ? 'Back' : 'Cancel'}</Button>}
                {view === 'route' && <Button variant="ghost" onClick={editRoutePreferences}>Adjust</Button>}
                {view === 'walk' && walk && <IonNote className="pi-walk-progress">{walk.status === 'complete' ? 'Finished' : walk.status === 'ended' ? 'Ended' : `${walk.index + 1} / ${walk.stops.length}`}</IonNote>}
              </IonButtons>
            </>}
          </IonToolbar></IonHeader>}
          {view !== 'home' && <IonContent className="pi-content" ref={content}><div className="pi-content-stack">
            {view === 'camera' && <><div className="pi-camera-view">Camera</div><Button className="pi-full" onClick={() => navigate('photo')}>Take sample photo</Button></>}
            {view === 'photo' && <>
              <div className="pi-photo-review">Sample photo</div>
              <IonList mode="ios" className="pi-form-list" lines="inset">
                <IonItem><IonSelect ref={subjectSelect} className="pi-native-select" label="Subject" labelPlacement="fixed" interface="popover" interfaceOptions={phoneSelectInterfaceOptions(phone, subjectSelect)} value={photoSubject} onIonChange={event => setPhotoSubject(event.detail.value as SubjectId)}><IonSelectOption value="statue">Statue</IonSelectOption><IonSelectOption value="station">Station</IonSelectOption><IonSelectOption value="point">Unknown</IonSelectOption></IonSelect></IonItem>
                <IonItem><IonInput mode="ios" className="pi-native-input" label="Location" labelPlacement="fixed" maxlength={160} value={photoLocation} onIonInput={event => setPhotoLocation(event.detail.value ?? '')} /></IonItem>
              </IonList>
              <Button className="pi-full" onClick={attachPhoto}>Use photo</Button>
            </>}
            {view === 'chat' && <div className="pi-conversation" role="log" aria-live="polite" aria-relevant="additions" aria-label={`Conversation about ${conversation.title}`}>{currentQuestions.map((question, index) => answer(question, index))}</div>}
            {view === 'plan' && (!planStep ? <>
              <IonList mode="ios" className="pi-form-list"><IonItem><IonSelect ref={neighborhoodSelect} className="pi-native-select" label="Neighborhood" labelPlacement="fixed" interface="popover" interfaceOptions={phoneSelectInterfaceOptions(phone, neighborhoodSelect)} value={planPreferences.neighborhood} onIonChange={event => setPlanPreferences(value => ({ ...value, neighborhood: event.detail.value }))}><IonSelectOption value="Around Grand Central">Around Grand Central</IonSelectOption></IonSelect></IonItem></IonList>
              <IonList mode="ios" className="pi-selection-list" lines="inset"><IonRadioGroup aria-label="Total time available" value={planPreferences.time} onIonChange={event => setPlanPreferences(value => ({ ...value, time: Number(event.detail.value) }))}>{timeOptions.map(time => <IonItem key={time}><IonRadio mode="ios" value={time} justify="space-between" labelPlacement="start">{time} min</IonRadio></IonItem>)}</IonRadioGroup></IonList>
              <Button className="pi-full" onClick={() => setPlanStep(1)}>Next</Button>
            </> : <>
              <IonList mode="ios" className="pi-selection-list" lines="inset" role="group" aria-label="Walking interests">{interestOptions.map(interest => <IonItem key={interest}><IonCheckbox mode="ios" justify="space-between" labelPlacement="start" checked={planPreferences.interests.includes(interest)} onIonChange={event => setPlanPreferences(value => ({ ...value, interests: event.detail.checked ? [...value.interests.filter(item => item !== interest), interest] : value.interests.filter(item => item !== interest) }))}>{interest}</IonCheckbox></IonItem>)}</IonList>
              <IonList mode="ios" className="pi-selection-list"><IonItem lines="none"><IonToggle mode="ios" className="pi-switch-row" justify="space-between" checked={planPreferences.coffee} onIonChange={event => setPlanPreferences(value => ({ ...value, coffee: event.detail.checked }))}>Coffee</IonToggle></IonItem></IonList>
              <Button className="pi-full" onClick={previewRoute}>Preview route</Button>
            </>)}
            {view === 'route' && route && <>
              <Button variant="ghost" className="pi-conversation-link" onClick={() => navigate('chat')}><IonIcon slot="start" icon={chatbubbleOutline} aria-hidden="true" />Conversation</Button>
              <div className="pi-route-summary"><span>{route.preferences.time} min total</span><span>{routeWalking} min walking</span><span>{route.stops.length === 3 ? '0.6' : '0.4'} km</span><span>{route.stops.length} stops</span></div>
              <IonList mode="ios" className="pi-route-stops" lines="inset" aria-label="Route stops">{route.stops.map((id, index) => <IonItem className="pi-route-stop" key={id}><IonBadge slot="start" className="pi-stop-number">{index + 1}</IonBadge><IonLabel>{subjects[id].name}</IonLabel><Button slot="end" variant="ghost" size="sm" aria-label={`Edit ${subjects[id].name} stop`} aria-haspopup="dialog" aria-expanded={editingStop === id} onClick={event => { stopTrigger.current = event.currentTarget as HTMLIonButtonElement; setEditingStop(id) }}>Edit</Button></IonItem>)}</IonList>
              {route.stops.length < 3 && <Button variant="ghost" className="pi-full" onClick={() => updateConversation(item => item.route ? { ...item, route: { ...item.route, stops: [...routeStops] } } : item)}>Restore stops</Button>}
              {route.preferences.coffee && <IonItem lines="none"><IonLabel>Coffee</IonLabel><IonNote slot="end">10 min</IonNote></IonItem>}
            </>}
            {view === 'walk' && walk && (walk.status === 'complete' || walk.status === 'ended' ? <>
              {walk.status === 'ended' && <Button className="pi-full" onClick={() => setWalkStatus('active')}>Resume</Button>}
              <Button variant="secondary" className="pi-full" onClick={() => navigate('recent')}>Recent</Button>
            </> : currentStop && <>
              <IonNote>{walk.status === 'paused' ? 'Paused' : walk.arrived ? 'Current stop' : 'Next stop'}</IonNote>
              <Button variant="secondary" className="pi-full" onClick={askAtStop}>Ask about stop</Button>
              {walk.status === 'paused' ? <Button className="pi-full" onClick={() => setWalkStatus('active')}>Resume</Button> : <Button className="pi-full" onClick={() => walk.arrived ? advanceWalk() : updateConversation(item => item.walk ? { ...item, walk: { ...item.walk, arrived: true } } : item)}>{walk.arrived ? walk.index === walk.stops.length - 1 ? 'Finish' : 'Next stop' : 'Arrived'}</Button>}
              <div className="pi-row pi-walk-actions"><Button variant="ghost" size="sm" onClick={() => advanceWalk(true)} disabled={walk.status === 'paused'}>Skip</Button>{walk.status === 'active' && <Button variant="ghost" size="sm" onClick={() => setWalkStatus('paused')}>Pause</Button>}<Button variant="ghost" size="sm" onClick={() => setWalkStatus('ended')}>End</Button></div>
              <Button variant="ghost" className="pi-full" onClick={openCamera}>Photo</Button>
            </>)}
            {view === 'recent' && (history.length ? <IonList mode="ios" className="pi-history-list" lines="inset">{history.map(historyItem)}</IonList> : <p className="pi-empty">No conversations yet</p>)}
          </div></IonContent>}
          {(view === 'home' || view === 'chat') && <form className="pi-composer" onSubmit={submitQuestion}>
            {contextAttachment()}
            <div className="pi-composer-row">
              <Button ref={attachmentTrigger} variant="ghost" size="icon" className="pi-add-photo" type="button" aria-label="Add attachment" aria-haspopup="dialog" aria-expanded={attachmentOpen} onClick={openAttachments}><IonIcon slot="icon-only" icon={addOutline} aria-hidden="true" /></Button>
              <IonTextarea mode="ios" ref={questionField} id="pi-question" aria-label="Message" rows={1} maxlength={500} placeholder={voiceState === 'starting' ? 'Starting mic…' : voiceState === 'listening' ? 'Listening…' : voiceState === 'stopping' ? 'Finishing…' : 'Message…'} value={draft} enterkeyhint="send" aria-describedby={voiceMessage ? 'pi-voice-message' : undefined} onIonFocus={() => { cancelVoiceInput(); setKeyboardOpen(true) }} onClick={() => { cancelVoiceInput(); setKeyboardOpen(true) }} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); ask(draft) } }} onIonInput={event => { cancelVoiceInput(); updateConversation(item => ({ ...item, draft: event.detail.value ?? '' })) }} />
              {voiceActive ? <Button key="voice-stop" type="button" size="icon" className="pi-mic pi-mic-active" aria-label="Stop voice transcription" aria-pressed="true" disabled={voiceState === 'stopping'} onClick={stopVoiceInput}><IonIcon slot="icon-only" icon={square} aria-hidden="true" /></Button>
                : draft.trim() ? <Button key="send" type="submit" size="icon" className="pi-send" aria-label="Send"><IonIcon slot="icon-only" icon={arrowUpOutline} aria-hidden="true" /></Button>
                : <Button key="voice-start" type="button" variant="secondary" size="icon" className="pi-mic" aria-label="Start voice transcription" onClick={startVoiceInput}><IonIcon slot="icon-only" icon={micOutline} aria-hidden="true" /></Button>}
            </div>
            <span className="sr-only" role="status">{voiceState === 'starting' ? 'Starting microphone.' : voiceState === 'listening' ? 'Listening. Tap stop when finished.' : voiceState === 'stopping' ? 'Finishing transcription.' : ''}</span>
            {voiceMessage && <p className="pi-voice-message" id="pi-voice-message" role="status">{voiceMessage}</p>}
            {attachmentMessage && <p className="pi-voice-message" role="status">{attachmentMessage}</p>}
          </form>}
          {view === 'route' && route && <IonFooter className="pi-route-footer ion-no-border"><Button className="pi-full" onClick={startWalk}>{inWalk ? 'Resume walk' : walk?.status === 'complete' || walk?.status === 'ended' ? 'Walk again' : 'Start walk'}</Button></IonFooter>}
        </section>
        <input ref={photoPicker} type="file" accept="image/*" hidden aria-label="Choose a photo" onChange={event => receiveUpload(event, 'photo')} />
        <input ref={filePicker} type="file" hidden aria-label="Choose a file" onChange={event => receiveUpload(event, 'file')} />
        {keyboardOpen && !nativeKeyboard && <div ref={keyboardPanel} className="pi-keyboard" data-layout={keyboardEmoji ? 'emoji' : keyboardNumbers ? 'numbers' : 'letters'} role="group" aria-label="iOS keyboard mockup" inert={menuOpen || attachmentOpen} onPointerDown={event => event.preventDefault()}>
          {(keyboardEmoji ? ['😀😊😂😍😎🤔😮', '👍👎👏🙌👋🙏💪', '🏠🌳🌸🍕☕🎉✨'] : keyboardNumbers ? ['1234567890', '-/:;()$&@"', ".,?!'"] : ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']).map((row, index) => <div className="pi-keyboard-row" key={index}>
            {index === 2 && !keyboardEmoji && <Button variant="secondary" size="sm" tabIndex={-1} className="pi-keyboard-modifier" aria-label={keyboardNumbers ? 'Letters' : 'Shift'} aria-pressed={!keyboardNumbers && keyboardShift} data-shift-active={!keyboardNumbers && keyboardShift ? 'true' : undefined} onClick={() => keyboardNumbers ? setKeyboardNumbers(false) : setKeyboardShift(value => !value)}>{keyboardNumbers ? 'ABC' : <span className="pi-system-symbol pi-keyboard-shift" aria-hidden="true" />}</Button>}
            {[...row].map(key => { const letter = !keyboardNumbers && keyboardShift ? key.toUpperCase() : key; return <Button variant="secondary" size="sm" tabIndex={-1} key={key} onClick={() => typeKey(letter)}>{letter}</Button> })}
            {index === 2 && <Button variant="secondary" size="sm" tabIndex={-1} className="pi-keyboard-modifier" aria-label="Delete" onClick={() => typeKey('Backspace')}><span className="pi-system-symbol pi-keyboard-delete" aria-hidden="true" /></Button>}
          </div>)}
          <div className="pi-keyboard-row pi-keyboard-bottom"><Button variant="secondary" size="sm" tabIndex={-1} className="pi-keyboard-modifier" onClick={() => { setKeyboardEmoji(false); setKeyboardNumbers(value => keyboardEmoji ? false : !value) }}>{keyboardEmoji || keyboardNumbers ? 'ABC' : '123'}</Button><Button variant="secondary" size="sm" tabIndex={-1} className="pi-keyboard-space" onClick={() => typeKey(' ')}>space</Button><Button variant="secondary" size="sm" tabIndex={-1} className="pi-keyboard-modifier pi-keyboard-send" disabled={!draft.trim()} aria-label="Send message from keyboard" onClick={() => ask(draft)}>send</Button></div>
          <div className="pi-keyboard-accessories">
            <Button variant="ghost" size="icon" tabIndex={-1} aria-label={keyboardEmoji ? 'Show letter keyboard' : 'Show emoji keyboard'} aria-pressed={keyboardEmoji} onClick={() => setKeyboardEmoji(value => !value)}><span className="pi-system-symbol pi-keyboard-emoji" aria-hidden="true" /></Button>
            <Button variant="ghost" size="icon" tabIndex={-1} aria-label="Hide keyboard" onClick={() => { setKeyboardOpen(false); questionInput.current?.blur() }}><IonIcon slot="icon-only" icon={chevronDownOutline} aria-hidden="true" /></Button>
            <Button variant="ghost" size="icon" tabIndex={-1} aria-label={voiceActive ? 'Stop keyboard dictation' : 'Start keyboard dictation'} aria-pressed={voiceActive} disabled={voiceState === 'stopping'} onClick={voiceActive ? stopVoiceInput : startVoiceInput}><span className="pi-system-symbol pi-keyboard-microphone" aria-hidden="true" /></Button>
          </div>
        </div>}
        <div className="pi-home-indicator" aria-hidden="true"><span /></div>
        </div>
        <IosPopover isOpen={attachmentOpen} anchorRef={attachmentTrigger} phoneRef={phone} side="top" alignment="start" ariaLabel="Add attachment" className="pi-attachment-popover" onDidDismiss={() => { setAttachmentOpen(false); if (pendingCamera.current) { pendingCamera.current = false; openCamera() } }}>
          <IonList mode="ios" className="pi-attachment-options" lines="full">
            <IonItem mode="ios" button detail={false} onClick={() => { pendingCamera.current = true; setAttachmentOpen(false) }}><IonIcon slot="end" icon={cameraOutline} aria-hidden="true" /><IonLabel>Camera</IonLabel></IonItem>
            <IonItem mode="ios" button detail={false} onClick={() => chooseUpload('photo')}><IonIcon slot="end" icon={imageOutline} aria-hidden="true" /><IonLabel>Photo</IonLabel></IonItem>
            <IonItem mode="ios" button detail={false} lines="none" onClick={() => chooseUpload('file')}><IonIcon slot="end" icon={documentOutline} aria-hidden="true" /><IonLabel>File</IonLabel></IonItem>
          </IonList>
        </IosPopover>
        <IosPopover isOpen={editingStop !== null} anchorRef={stopTrigger} phoneRef={phone} side="top" alignment="end" ariaLabel={editingStop ? `Edit ${subjects[editingStop].name} stop` : 'Edit stop'} onDidDismiss={() => { setEditingStop(null); if (!stopTrigger.current?.isConnected) requestAnimationFrame(() => heading.current?.focus({ preventScroll: true })) }}>
          <IonList mode="ios" lines="full">
            <IonItem button detail={false} disabled={editIndex <= 0} onClick={() => { changeStop(editIndex, -1); setEditingStop(null) }}><IonIcon slot="end" icon={arrowUpOutline} aria-hidden="true" /><IonLabel>Move earlier</IonLabel></IonItem>
            <IonItem button detail={false} disabled={!editingStop || !route || editIndex >= route.stops.length - 1} onClick={() => { changeStop(editIndex, 1); setEditingStop(null) }}><IonIcon slot="end" icon={arrowDownOutline} aria-hidden="true" /><IonLabel>Move later</IonLabel></IonItem>
            <IonItem button detail={false} lines="none" disabled={!editingStop || !route || route.stops.length <= 2} onClick={() => { updateConversation(item => item.route ? { ...item, route: { ...item.route, stops: item.route.stops.filter(stop => stop !== editingStop) } } : item); setEditingStop(null) }}><IonIcon slot="end" icon={trashOutline} aria-hidden="true" /><IonLabel>Remove stop</IonLabel></IonItem>
          </IonList>
        </IosPopover>
      </IonApp>
      </div>
    </div></div>
  </section>
}
