import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { IonIcon } from '@ionic/react'
import { addOutline, arrowUpOutline, closeOutline, createOutline, documentOutline, ellipsisHorizontalOutline, imageOutline, locationOutline, menuOutline, micOutline, navigateOutline, searchOutline, stopOutline } from 'ionicons/icons'
import { IosButton as Button } from '../components/ui/ios-button'
import { focusElement, getFocusableElements, trapFocus } from '../lib/ios-focus'
import { attachmentTitle, demoNeighborhood, makeMapAttachment, makeUploadAttachment, samePlace, sampleMapPlaces, subjects, type Attachment, type UploadDetails } from '../lib/mockup-state'
import { prototypeAnswer } from '../lib/prototype-answer'
import LiveMap, { initialMapViewport, type MapLocation } from '../studio/LiveMap'
import { KeyboardPreview } from './KeyboardPreview'

type Panel = 'menu' | 'search' | 'options' | null
type Message = { id: string; text: string; attachment: Attachment | null; answer: ReturnType<typeof prototypeAnswer>; pending: boolean }
type Conversation = { id: string; messages: Message[]; updatedAt: number }
type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean
  start: () => void; stop: () => void; abort: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

export default function FoundationMap({ mode, active }: { mode: 'light' | 'dark'; active: boolean }) {
  const viewport = useRef(initialMapViewport())
  const [selected, setSelected] = useState<MapLocation>()
  const [draft, setDraft] = useState('')
  const [upload, setUpload] = useState<UploadDetails>()
  const [conversationState, setConversationState] = useState<{ currentId: string; conversations: Conversation[] }>(() => {
    const id = crypto.randomUUID()
    return { currentId: id, conversations: [{ id, messages: [], updatedAt: Date.now() }] as Conversation[] }
  })
  const [routesOpen, setRoutesOpen] = useState(false)
  const currentId = conversationState.currentId
  const messages = conversationState.conversations.find(item => item.id === currentId)?.messages || []
  const recent = conversationState.conversations.filter(item => item.messages.length).sort((a, b) => b.updatedAt - a.updatedAt)
  function setMessages(update: (items: Message[]) => Message[], touch = false) {
    setConversationState(state => ({ ...state, conversations: state.conversations.map(item => item.id === currentId ? { ...item, messages: update(item.messages), updatedAt: touch ? Date.now() : item.updatedAt } : item) }))
  }
  const [chatOpen, setChatOpen] = useState(() => new URLSearchParams(location.search).get('chat') === '1')
  const wasChatOpen = useRef(chatOpen)
  const chatPage = useRef<HTMLElement>(null)
  const chatScroll = useRef<HTMLDivElement>(null)
  const menuTrigger = useRef<HTMLIonButtonElement>(null)
  const [panel, setPanel] = useState<Panel>(null)
  const [menuClosing, setMenuClosing] = useState(false)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [listening, setListening] = useState(false)
  const [dockHeight, setDockHeight] = useState(56)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [nativeKeyboard, setNativeKeyboard] = useState(() => window.matchMedia('(pointer: coarse)').matches)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const keyboard = useRef<HTMLDivElement>(null)
  const dock = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)
  const picker = useRef<HTMLInputElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const recognition = useRef<Recognition | null>(null)
  const stopTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function releaseVoice() {
    clearTimeout(stopTimer.current)
    const current = recognition.current
    recognition.current = null
    if (current) {
      current.onresult = current.onerror = current.onend = null
      try { current.abort() } catch { /* Already stopped. */ }
    }
  }
  function cancelVoice() { releaseVoice(); setListening(false) }
  useEffect(() => () => releaseVoice(), [])
  useEffect(() => {
    const update = () => { setRoutesOpen(false); setChatOpen(new URLSearchParams(location.search).get('chat') === '1'); setKeyboardOpen(false); cancelVoice() }
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])
  const pendingId = messages.find(message => message.pending)?.id
  useEffect(() => {
    if (!pendingId) return
    const timer = setTimeout(() => setMessages(items => items.map(item => item.id === pendingId ? { ...item, pending: false } : item)), 650)
    return () => clearTimeout(timer)
  }, [pendingId, currentId])
  useLayoutEffect(() => {
    if (chatOpen) chatPage.current?.focus({ preventScroll: true })
    else if (wasChatOpen.current) focusElement(menuTrigger.current)
    wasChatOpen.current = chatOpen
  }, [chatOpen, routesOpen])
  useLayoutEffect(() => {
    if (chatOpen && chatScroll.current) chatScroll.current.scrollTop = chatScroll.current.scrollHeight
  }, [chatOpen, messages, keyboardHeight])
  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)')
    const update = () => { setNativeKeyboard(media.matches); setKeyboardOpen(false) }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const showKeyboard = keyboardOpen && !nativeKeyboard && !panel && active
  useLayoutEffect(() => {
    if (!showKeyboard || !keyboard.current) { setKeyboardHeight(0); return }
    const measure = () => setKeyboardHeight(keyboard.current?.getBoundingClientRect().height || 0)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(keyboard.current)
    return () => observer.disconnect()
  }, [showKeyboard])
  useLayoutEffect(() => {
    if (!dock.current) return
    const observer = new ResizeObserver(() => {
      const height = dock.current?.getBoundingClientRect().height
      if (height) setDockHeight(height)
    })
    observer.observe(dock.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => { if (!active) { cancelVoice(); setPanel(null); setMenuClosing(false); setKeyboardOpen(false) } }, [active])
  useEffect(() => {
    if (!menuClosing) return
    const timeout = setTimeout(() => {
      setPanel(null)
      setMenuClosing(false)
      requestAnimationFrame(() => focusElement(returnFocus.current))
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220)
    return () => clearTimeout(timeout)
  }, [menuClosing])
  useLayoutEffect(() => {
    if (!panel || !dialog.current) return
    dialog.current.focus()
    // Ionic's shadow buttons finish rendering after React commits the panel.
    const frame = requestAnimationFrame(() => {
      if (dialog.current) focusElement(getFocusableElements(dialog.current)[0])
    })
    return () => cancelAnimationFrame(frame)
  }, [panel])

  function openPanel(next: Panel, trigger: HTMLElement) {
    cancelVoice()
    setKeyboardOpen(false)
    setMenuClosing(false)
    returnFocus.current = trigger
    setPanel(next)
  }
  function closePanel(focusTarget?: HTMLElement | null) {
    if (focusTarget) returnFocus.current = focusTarget
    if (panel === 'menu') { setMenuClosing(true); return }
    setPanel(null)
    requestAnimationFrame(() => focusElement(returnFocus.current))
  }
  function startVoice() {
    setKeyboardOpen(false)
    field.current?.blur()
    if (recognition.current) {
      try { recognition.current.stop() } catch { cancelVoice() }
      stopTimer.current = setTimeout(cancelVoice, 4000)
      return
    }
    const browser = window as Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }
    const Speech = browser.SpeechRecognition || browser.webkitSpeechRecognition
    if (!Speech) { setNotice('Voice input is unavailable in this browser. You can type your message.'); return }
    const prefix = draft.trim()
    setNotice('')
    try {
      const speech = new Speech()
      recognition.current = speech
      speech.lang = navigator.language || 'en-US'
      speech.continuous = false
      speech.interimResults = true
      speech.onresult = event => {
        if (recognition.current !== speech) return
        const transcript = Array.from(event.results, result => result[0]?.transcript || '').join(' ')
        setDraft([prefix, transcript].filter(Boolean).join(' ').slice(0, 500))
      }
      speech.onerror = event => {
        cancelVoice()
        setNotice(event.error === 'not-allowed' ? 'Microphone access is blocked. Allow access in your browser or type a message.' : 'Voice input could not finish. Try again or type your message.')
      }
      speech.onend = () => { cancelVoice() }
      setListening(true)
      speech.start()
    } catch { cancelVoice(); setNotice('Voice input could not start. You can type your message.') }
  }
  const matches = sampleMapPlaces.filter(item => [subjects[item.subject].name, ...item.aliases].some(name => name.toLowerCase().includes(query.trim().toLowerCase())))
  const context = upload?.name || selected?.place?.name || (selected ? 'Selected map location' : undefined)
  function openChat() {
    setRoutesOpen(false)
    setPanel(null)
    setMenuClosing(false)
    setKeyboardOpen(false)
    field.current?.blur()
    if (new URLSearchParams(location.search).get('chat') !== '1') {
      const url = new URL(location.href)
      url.searchParams.set('chat', '1')
      history.pushState({ ...history.state, foundationChat: true }, '', url)
    }
    setChatOpen(true)
  }
  function backToMap() {
    setRoutesOpen(false)
    setPanel(null)
    setMenuClosing(false)
    cancelVoice()
    setKeyboardOpen(false)
    if (history.state?.foundationChat) history.back()
    else {
      const url = new URL(location.href)
      url.searchParams.delete('chat')
      history.replaceState(history.state, '', url)
      setChatOpen(false)
    }
  }
  function startNewChat() {
    cancelVoice()
    setDraft('')
    const id = crypto.randomUUID()
    setConversationState(state => ({ currentId: id, conversations: [...state.conversations.filter(item => item.messages.length), { id, messages: [], updatedAt: Date.now() }] }))
    setUpload(undefined)
    setSelected(undefined)
    setNotice('')
    openChat()
    requestAnimationFrame(() => focusElement(field.current))
  }
  function reopenConversation(id: string) {
    cancelVoice()
    setDraft('')
    setUpload(undefined)
    setSelected(undefined)
    setNotice('')
    setConversationState(state => ({ ...state, currentId: id }))
    openChat()
    requestAnimationFrame(() => chatPage.current?.focus({ preventScroll: true }))
  }
  function openRoutes() {
    cancelVoice()
    setKeyboardOpen(false)
    setRoutesOpen(true)
    closePanel(menuTrigger.current)
  }
  function submitMessage() {
    if (!draft.trim()) return
    cancelVoice()
    setNotice('')
    const text = draft.trim()
    const named = sampleMapPlaces.find(place => place.aliases.some(alias => text.toLowerCase().includes(alias)))
    const location = selected || (named ? { ...named.coordinates, place: { name: subjects[named.subject].name } } : undefined)
    const candidate: Attachment | null = upload ? { subject: 'point', source: upload.type.startsWith('image/') ? 'photo' : 'file', location: '', upload: { ...upload } } : location ? makeMapAttachment(location) : null
    const previousAttachment = messages.slice().reverse().find(message => message.attachment)?.attachment || null
    // Mentioning the same place is conversation context, not a new attachment.
    const attachment = !selected && !upload && samePlace(candidate, previousAttachment) ? null : candidate
    // A follow-up remembers the conversation context without attaching it again.
    const answerContext = candidate || previousAttachment
    const answer = prototypeAnswer({ text, attachment: answerContext, kind: 'question', neighborhood: demoNeighborhood })
    setMessages(items => [...items, { id: crypto.randomUUID(), text, attachment, answer, pending: true }], true)
    setUpload(undefined)
    setSelected(undefined)
    setDraft('')
    openChat()
  }
  function typeKey(key: string) {
    if (key === '\n') { submitMessage(); return }
    const input = field.current
    if (!input) return
    let start = input.selectionStart ?? draft.length
    const end = input.selectionEnd ?? start
    if (key === 'Backspace' && start === end) start -= Array.from(draft.slice(0, start)).at(-1)?.length || 0
    const insertion = key === 'Backspace' ? '' : key
    const next = draft.slice(0, start) + insertion + draft.slice(end)
    if (next.length > 500) return
    setDraft(next)
    requestAnimationFrame(() => { input.focus({ preventScroll: true }); input.setSelectionRange(start + insertion.length, start + insertion.length) })
  }

  return <div className="pi-map foundation-map" data-chat-open={chatOpen} data-keyboard-open={showKeyboard} style={{ '--map-composer-clearance': `${dockHeight + 24}px`, '--map-keyboard-height': `${keyboardHeight}px` } as CSSProperties}
    onPointerDownCapture={event => { if (!(event.target as Element).closest('.foundation-chat-dock, .foundation-map-keyboard')) setKeyboardOpen(false) }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardOpen(false) }}
    onKeyDown={event => { if (event.key === 'Escape' && showKeyboard) { event.preventDefault(); setKeyboardOpen(false); field.current?.blur() } }}>
    <div className="foundation-map-content" inert={!!panel}>
      <div className="foundation-map-layer" hidden={chatOpen || routesOpen}>
      <LiveMap mode={mode} viewport={viewport} selectedLocation={selected} onSelectLocation={setSelected} focusSelection />
      </div>
      <div className="foundation-map-toolbar" role="group" aria-label={chatOpen ? 'Chat actions' : 'Map actions'}>
        <Button ref={menuTrigger} variant="light" size="icon" aria-label="Open app menu" aria-haspopup="dialog" onClick={event => openPanel('menu', event.currentTarget)}><IonIcon slot="icon-only" icon={menuOutline} aria-hidden="true" /></Button>
        {(chatOpen || routesOpen) ? <div className="foundation-chat-actions">
          <Button variant="ghost" size="icon" aria-label="New chat" onClick={startNewChat}><IonIcon slot="icon-only" icon={createOutline} aria-hidden="true" /></Button>
          <Button variant="ghost" size="icon" aria-label="More chat options" aria-haspopup="dialog" onClick={event => openPanel('options', event.currentTarget)}><IonIcon slot="icon-only" icon={ellipsisHorizontalOutline} aria-hidden="true" /></Button>
        </div> : <Button variant="light" size="icon" aria-label="Search places" aria-haspopup="dialog" onClick={event => openPanel('search', event.currentTarget)}><IonIcon slot="icon-only" icon={searchOutline} aria-hidden="true" /></Button>}
      </div>
      {chatOpen && !routesOpen && <section ref={chatPage} tabIndex={-1} className="foundation-chat-page" aria-label="Conversation" aria-describedby="foundation-chat-disclaimer">
        <span id="foundation-chat-disclaimer" className="sr-only">Replies in this prototype are sample answers.</span>
        <div ref={chatScroll} className="foundation-chat-thread" role="log" aria-label="Messages" aria-live="polite" aria-relevant="additions text">
          {!messages.length && <p className="foundation-chat-empty">Ask about a place to start exploring.</p>}
          {messages.map(message => <div className="foundation-chat-turn" key={message.id}>
            <div className="foundation-user-message" aria-label="Your message">
              {message.attachment && <div className="foundation-message-attachment" role="group" aria-label="Sent attachment">
                <span className="foundation-attachment-icon"><IonIcon icon={message.attachment.upload ? (message.attachment.source === 'photo' ? imageOutline : documentOutline) : locationOutline} aria-hidden="true" /></span>
                <div><strong>{attachmentTitle(message.attachment)}</strong><small>{message.attachment.upload ? `${message.attachment.source === 'photo' ? 'Photo' : 'File'} · ${Math.max(1, Math.ceil(message.attachment.upload.size / 1024))} KB` : 'Attached place'}</small></div>
              </div>}
              <p>{message.text}</p>
            </div>
            <div className="foundation-assistant-message" aria-label="Placewise response">
              {message.pending ? <p className="foundation-chat-typing" role="status"><span aria-hidden="true">•••</span> Placewise is replying…</p> : <><p>{message.answer.reply}</p>{message.answer.source && <a href={message.answer.source} target="_blank" rel="noreferrer">View source</a>}</>}
            </div>
          </div>)}
        </div>
      </section>}
      {routesOpen && <section className="foundation-chat-page foundation-routes-page" aria-label="Routes">
        <div className="foundation-chat-thread"><h2>Routes</h2><p className="foundation-chat-empty">No routes yet.</p></div>
      </section>}
      <div ref={dock} className="foundation-chat-dock" hidden={routesOpen}>
        {(notice || context) && <div className="foundation-chat-context"><span role="status">{notice || context}</span><Button variant="ghost" size="icon" aria-label={notice ? 'Dismiss message' : 'Remove context'} onClick={() => { if (notice) setNotice(''); else { setUpload(undefined); setSelected(undefined) } }}><IonIcon icon={closeOutline} aria-hidden="true" /></Button></div>}
        <form className="foundation-map-composer" onSubmit={event => {
          event.preventDefault()
          submitMessage()
        }}>
          <Button variant="ghost" size="icon" aria-label="Add attachment" onClick={() => { cancelVoice(); setKeyboardOpen(false); picker.current?.click() }}><IonIcon slot="icon-only" icon={addOutline} aria-hidden="true" /></Button>
          <input ref={field} type="text" aria-label="Message" placeholder={listening ? 'Listening…' : 'Ask about this place…'} maxLength={500} value={draft} onFocus={() => { cancelVoice(); setKeyboardOpen(true) }} onClick={() => setKeyboardOpen(true)} onChange={event => { cancelVoice(); setDraft(event.target.value) }} onKeyDown={event => { if (event.key === 'Escape') { cancelVoice(); setKeyboardOpen(false); event.currentTarget.blur() } }} autoComplete="off" enterKeyHint="send" />
          {draft.trim() && !listening ? <Button key="send" type="submit" size="icon" aria-label="Send message"><IonIcon slot="icon-only" icon={arrowUpOutline} aria-hidden="true" /></Button> : <Button key="voice" variant="ghost" size="icon" aria-label={listening ? 'Stop listening' : 'Use microphone'} aria-pressed={listening} onClick={startVoice}><IonIcon slot="icon-only" icon={listening ? stopOutline : micOutline} aria-hidden="true" /></Button>}
        </form>
      </div>
      {showKeyboard && <div ref={keyboard} className="foundation-map-keyboard"><KeyboardPreview onType={typeKey} returnLabel="send" /></div>}
      <input ref={picker} type="file" hidden onChange={event => {
        const file = event.currentTarget.files?.[0]
        if (file) { setUpload(makeUploadAttachment(file, file.type.startsWith('image/') ? 'photo' : 'file').upload); setNotice(''); focusElement(field.current) }
        event.currentTarget.value = ''
      }} />
      <span className="sr-only" role="status">{selected ? `Selected ${selected.place?.name || 'map location'}` : ''}</span>
    </div>
    {panel && <div className={`foundation-map-scrim${panel === 'menu' ? ' foundation-menu-scrim' : panel === 'options' ? ' foundation-options-scrim' : ''}`} data-closing={menuClosing} onClick={event => { if (event.target === event.currentTarget) closePanel() }}>
      <div ref={dialog} tabIndex={-1} className={`foundation-map-panel${panel === 'menu' ? ' foundation-menu-drawer' : panel === 'options' ? ' foundation-options-sheet' : ''}`} inert={menuClosing} role="dialog" aria-modal="true" aria-label={panel === 'search' ? 'Search places' : panel === 'options' ? 'Chat options' : 'App menu'} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); closePanel() } else trapFocus(event, event.currentTarget) }}>
        <header><h2>{panel === 'search' ? 'Search places' : panel === 'options' ? 'Chat options' : 'Placewise'}</h2>{panel !== 'menu' && <Button variant="ghost" size="icon" aria-label="Close panel" onClick={() => closePanel()}><IonIcon icon={closeOutline} aria-hidden="true" /></Button>}</header>
        {panel === 'menu' && <>
          <nav className="foundation-panel-actions" aria-label="Library">
            <Button variant="ghost" onClick={backToMap}><IonIcon slot="start" icon={locationOutline} aria-hidden="true" /><span className="foundation-menu-label">Places</span></Button>
            <Button variant="ghost" onClick={openRoutes}><IonIcon slot="start" icon={navigateOutline} aria-hidden="true" /><span className="foundation-menu-label">Routes</span></Button>
          </nav>
          <section className="foundation-recent" aria-labelledby="foundation-recent-title">
            <h3 id="foundation-recent-title">Recent</h3>
            {recent.length ? <div className="foundation-panel-actions">{recent.map(conversation => <Button key={conversation.id} variant="ghost" aria-current={chatOpen && !routesOpen && conversation.id === currentId ? 'page' : undefined} onClick={() => reopenConversation(conversation.id)}><span className="foundation-menu-label foundation-recent-title">{conversation.messages[0].text}</span></Button>)}</div> : <p>No conversations yet.</p>}
          </section>
        </>}
        {panel === 'options' && <>
          <div className="foundation-panel-actions">
            <Button variant="ghost" onClick={backToMap}><span className="foundation-menu-label">View map</span></Button>
            <Button variant="ghost" onClick={() => setPanel('search')}><span className="foundation-menu-label">Find a place</span></Button>
          </div>
          <p className="foundation-panel-note">Replies in this prototype are sample answers.</p>
        </>}
        {panel === 'search' && <>
          <input type="search" aria-label="Search sample places" placeholder="Search nearby places…" value={query} onChange={event => setQuery(event.target.value)} />
          <p className="foundation-panel-note">Sample places near Grand Central</p>
          <div className="foundation-panel-actions">{matches.map(item => <Button key={item.subject} variant="ghost" onClick={() => { setSelected({ ...item.coordinates, place: { name: subjects[item.subject].name } }); setUpload(undefined); closePanel() }}>{subjects[item.subject].name}</Button>)}</div>
          {!matches.length && <p role="status">No matching sample places.</p>}
        </>}
      </div>
    </div>}
  </div>
}
