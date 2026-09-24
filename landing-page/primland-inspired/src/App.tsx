import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, ArrowUp, BookOpen, Check, ChevronDown, Compass, MapPin, Menu, RotateCcw, X } from 'lucide-react'
import { Button } from './components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion'
import { NeighborhoodMap } from './components/neighborhood-map'
import { PHOTO, PHOTO_SOURCE, interests, placeIds, places, suggestionsFor, type Exchange, type Interest, type PlaceId } from './lib/places'

const STORAGE_KEY = 'placewise-primland-demo-v1'
type DemoState = {
  selected: PlaceId; interest: Interest; visible: PlaceId[]; kept: PlaceId[]; excluded: PlaceId[];
  drafts: Record<PlaceId, string>; conversations: Record<PlaceId, Exchange[]>
}
const initialState: DemoState = {
  selected: 'coit', interest: 'A little of everything', visible: [...placeIds], kept: [], excluded: [],
  drafts: { coit: '', hill: '', steps: '' },
  conversations: { coit: [places.coit.questions[0]], hill: [places.hill.questions[0]], steps: [places.steps.questions[0]] },
}

function restoreDemo(): DemoState {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!saved || !placeIds.includes(saved.selected) || !interests.includes(saved.interest)) return initialState
    const validIds = (value: unknown): value is PlaceId[] => Array.isArray(value) && value.every(id => placeIds.includes(id))
    if (!validIds(saved.visible) || !validIds(saved.kept)) return initialState
    if (!placeIds.every(id => typeof saved.drafts?.[id] === 'string' && Array.isArray(saved.conversations?.[id]))) return initialState
    // Rehydrate only known, sourced examples. Stored text never becomes source content.
    const conversations = Object.fromEntries(placeIds.map(id => [id, saved.conversations[id].map((item: Exchange) => places[id].questions.find(q => q.question === item?.question)).filter(Boolean)])) as Record<PlaceId, Exchange[]>
    return { ...saved, excluded: validIds(saved.excluded) ? saved.excluded : [], conversations }
  } catch { return initialState }
}

function Source({ exchange }: { exchange: Exchange }) {
  return <a className="source-link" href={exchange.source} target="_blank" rel="noreferrer"><BookOpen size={13} aria-hidden="true" />{exchange.sourceLabel}<ArrowUpRight size={12} aria-hidden="true" /></a>
}

function Brand({ className = '' }: { className?: string }) {
  return <a className={`brand ${className}`} href="#home" aria-label="Placewise home">placewise<span className="brand-star" aria-hidden="true">✳</span></a>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [state, setState] = useState<DemoState>(restoreDemo)
  const [pendingInterest, setPendingInterest] = useState<Interest>(state.interest)
  const [notice, setNotice] = useState('')
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [photoFailed, setPhotoFailed] = useState(false)
  const composer = useRef<HTMLInputElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const conversationPanel = useRef<HTMLElement>(null)
  const current = places[state.selected]
  const conversation = state.conversations[state.selected]
  const currentExchange = conversation[conversation.length - 1] || current.questions[0]

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }
    catch { setStorageAvailable(false) }
  }, [state])

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.1 })
    targets.forEach(target => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus() }
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [menuOpen])

  function selectPlace(id: PlaceId, revealAnswer = false) {
    if (revealAnswer && window.matchMedia('(max-width: 600px)').matches) {
      conversationPanel.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    }
    setState(previous => ({ ...previous, selected: id }))
    setNotice('')
  }

  function fillQuestion(question: string) {
    setState(previous => ({ ...previous, drafts: { ...previous.drafts, [previous.selected]: question } }))
    setNotice('')
    composer.current?.focus({ preventScroll: true })
  }

  function submitQuestion(event: FormEvent) {
    event.preventDefault()
    const typed = state.drafts[state.selected].trim()
    if (!typed) return
    const normalize = (text: string) => text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, '').trim()
    const match = current.questions.find(item => normalize(item.question) === normalize(typed))
    if (!match) {
      setNotice('This preview has a few prepared answers. Choose a suggested question below to continue; live answers are not connected yet.')
      return
    }
    setState(previous => ({ ...previous, drafts: { ...previous.drafts, [previous.selected]: '' }, conversations: { ...previous.conversations, [previous.selected]: [...previous.conversations[previous.selected], match] } }))
    setNotice('')
  }

  function updatePlaces() {
    const visible = [...new Set([...state.kept, ...suggestionsFor(pendingInterest).filter(id => !state.excluded.includes(id))])]
    setState(previous => ({ ...previous, interest: pendingInterest, visible, selected: visible.includes(previous.selected) ? previous.selected : visible[0] || previous.selected }))
    setNotice(`Example updated for ${pendingInterest.toLowerCase()}. Kept places stay in your group.`)
  }

  function removePlace(id: PlaceId) {
    setState(previous => {
      const visible = previous.visible.filter(item => item !== id)
      return { ...previous, visible, excluded: [...new Set([...previous.excluded, id])], kept: previous.kept.filter(item => item !== id), selected: previous.selected === id && visible.length ? visible[0] : previous.selected }
    })
    setNotice(`${places[id].name} removed. Use “Restore places” to bring the example group back.`)
  }

  function reset() {
    setState({ ...initialState, drafts: { ...initialState.drafts }, conversations: { ...initialState.conversations } })
    setPendingInterest(initialState.interest)
    setNotice('Example reset. Your demo questions and choices have been cleared.')
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <main>
    <section className={`hero ${photoFailed ? 'photo-unavailable' : ''}`} id="home" aria-label="Meet Placewise">
      <div className="hero-image"><img src={PHOTO} alt="Coit Tower rises above the green slopes and homes of Telegraph Hill, with San Francisco Bay beyond" fetchPriority="high" onError={() => setPhotoFailed(true)} /></div>
      <div className="hero-shade" />
      <header className="site-header">
        <a className="header-note" aria-label="The idea behind Placewise" href="#how-it-works"><Compass size={17} strokeWidth={1.3} aria-hidden="true" /><span>Made for the curious</span></a>
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#how-it-works">The idea</a><a className="nav-cta" href="#explore">Try Placewise<ArrowUpRight size={15} aria-hidden="true" /></a></nav>
        <Button ref={menuButton} className="mobile-menu-toggle" variant="ghost" size="icon" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </header>
      {menuOpen && <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation"><a onClick={() => setMenuOpen(false)} href="#how-it-works">The idea<ArrowUpRight size={16} /></a><a onClick={() => setMenuOpen(false)} href="#explore">Try Placewise<ArrowUpRight size={16} /></a><a onClick={() => setMenuOpen(false)} href="#questions">A few answers<ArrowUpRight size={16} /></a></nav>}
      <div id="main" className="hero-content" tabIndex={-1}>
        <p className="eyebrow hero-eyebrow"><span className="tiny-line" />A world worth wondering about</p>
        <h1>There’s more<br />to <em>every place.</em></h1>
        <p className="hero-description">Find a place that sparks your curiosity.<br className="desktop-break" /> Ask a question. See where it takes you.</p>
        <div className="hero-actions"><Button asChild variant="light"><a href="#explore">Explore the example<ArrowUpRight size={18} aria-hidden="true" /></a></Button><a className="hero-secondary" href="#how-it-works">Meet Placewise<ArrowDown size={14} aria-hidden="true" /></a></div>
      </div>
      <div className="hero-place-marker" aria-hidden="true"><span className="photo-pin"><MapPin size={18} /></span><span>Coit Tower<small>San Francisco, California</small></span></div>
      <aside className="hero-answer" aria-label="A sourced example about Coit Tower">
        <div className="answer-eyebrow"><span className="dot" />One place. A little more to it.<span className="sample-label">Example</span></div>
        <h2>Why was this tower built?</h2>
        <p>{places.coit.questions[0].answer}</p>
        <Source exchange={places.coit.questions[0]} />
        <a className="answer-followup" href="#explore" onClick={() => { selectPlace('coit'); setState(previous => ({ ...previous, selected: 'coit', drafts: { ...previous.drafts, coit: 'What’s inside?' } })) }}>And what’s inside?<ArrowRight size={15} aria-hidden="true" /></a>
      </aside>
      <div className="hero-bottom"><a href="#how-it-works" className="scroll-cue"><span>Let curiosity lead</span><ArrowDown size={15} aria-hidden="true" /></a><a href={PHOTO_SOURCE} target="_blank" rel="noreferrer" className="photo-credit">Telegraph Hill, San Francisco<span>Photo: Sasha / @sanfrancisco · CC0<ArrowUpRight size={11} /></span></a></div>
      {photoFailed && <span className="image-fallback-note">Telegraph Hill · photograph unavailable</span>}
    </section>

    <section className="introduction section-shell" id="how-it-works" aria-labelledby="intro-heading">
      <div className="section-note" data-reveal><span className="section-number">01 / THE IDEA</span><span className="small-star" aria-hidden="true">✳</span></div>
      <div className="intro-copy" data-reveal><h2 id="intro-heading">You don’t need a plan.<br />Just a little <em>curiosity.</em></h2><p>That tower on the hill. A stairway between houses. The neighborhood you’ve walked through a hundred times. Placewise helps you find what’s interesting, and understand what’s in front of you.</p></div>
      <div className="two-ways" data-reveal><a href="#explore" onClick={() => setNotice('Choose an interest, then update the example places.')}><Compass size={23} strokeWidth={1.3} /><div><h3>Start with an area</h3><p>A few places, shaped by your interests.</p></div><ArrowUpRight size={18} /></a><a href="#explore" onClick={() => { selectPlace('coit'); fillQuestion('What’s inside?') }}><MapPin size={23} strokeWidth={1.3} /><div><h3>Or start with a question</h3><p>Pick a place. Follow what catches your eye.</p></div><ArrowUpRight size={18} /></a></div>
    </section>

    <section className="explore-section" id="explore" aria-labelledby="explore-heading">
      <div className="section-shell explore-heading" data-reveal><div><span className="section-number">02 / FOLLOW YOUR INTERESTS</span><h2 id="explore-heading">A familiar city.<br /><em>A different way in.</em></h2></div><p>Let’s start on Telegraph Hill. <br />Choose what you’re curious about, <br className="desktop-break" /> then open a place and ask.</p></div>
      <div className="exploration section-shell">
        <div className="explore-toolbar"><div className="area-label"><MapPin size={18} strokeWidth={1.5} /><div><strong>Telegraph Hill</strong><span>San Francisco, California</span></div></div><span className="demo-label"><span className="dot" />Interactive example</span><Button variant="ghost" size="sm" onClick={reset} className="reset-button" aria-label="Reset example"><RotateCcw size={13} />Reset</Button></div>
        <div className="interest-bar"><label htmlFor="interest">I’m curious about</label><div className="select-wrap"><select id="interest" value={pendingInterest} onChange={event => setPendingInterest(event.target.value as Interest)}>{interests.map(interest => <option key={interest}>{interest}</option>)}</select><ChevronDown size={14} aria-hidden="true" /></div><Button variant="secondary" size="sm" onClick={updatePlaces} disabled={pendingInterest === state.interest}>Update places<ArrowRight size={13} /></Button><span className="interest-note">A few ideas, at your own pace.</span></div>
        <div className="explore-workspace"><div className="map-and-places" id="example-map"><NeighborhoodMap selected={state.selected} onSelect={id => selectPlace(id, true)} visiblePlaces={state.visible} /><div className="place-list" aria-label="Suggested places"><div className="place-list-heading"><span>{state.visible.length} places to get curious about</span>{state.visible.length < 3 && <button onClick={() => { setState(previous => ({ ...previous, visible: [...placeIds], excluded: [] })); setNotice('All three example places restored.') }}>Restore places</button>}</div>{state.visible.map(id => <div className={`place-row ${state.selected === id ? 'selected' : ''}`} key={id}><button className="place-select" onClick={() => selectPlace(id, true)} aria-pressed={state.selected === id}><span className="list-pin"><MapPin size={15} strokeWidth={1.6} /></span><span><strong>{places[id].name}</strong><small>{places[id].reason}</small></span></button><button className={`keep-place ${state.kept.includes(id) ? 'is-kept' : ''}`} aria-label={`${state.kept.includes(id) ? 'Unkeep' : 'Keep'} ${places[id].name}`} aria-pressed={state.kept.includes(id)} onClick={() => setState(previous => ({ ...previous, kept: previous.kept.includes(id) ? previous.kept.filter(p => p !== id) : [...previous.kept, id] }))}>{state.kept.includes(id) ? <Check size={14} /> : <span>Keep</span>}</button><button className="remove-place" aria-label={`Remove ${places[id].name}`} onClick={() => removePlace(id)}><X size={14} /></button></div>)}{!state.visible.length && <p className="empty-places">Your group is empty. Restore the example places to keep exploring.</p>}</div></div>
          <section ref={conversationPanel} className="conversation" aria-label={`Conversation about ${current.name}`}><a className="back-to-places" href="#example-map"><ArrowUp size={12} />Back to places</a><div className="conversation-heading"><span className="category-icon"><MapPin size={20} strokeWidth={1.2} /></span><div><span className="eyebrow">{current.category}</span><h3>{current.name}</h3></div><span className="conversation-coordinates">{current.coordinates}</span></div>
            <div className="conversation-body" aria-live="polite" aria-atomic="true"><span className="question-label">YOU ASKED</span><h4>{currentExchange.question}</h4><div className="placewise-answer-label"><span className="small-star" aria-hidden="true">✳</span>Placewise</div><p>{currentExchange.answer}</p><Source exchange={currentExchange} />{conversation.length > 1 && <details className="previous-exchanges"><summary>Earlier in this conversation ({conversation.length - 1})</summary>{conversation.slice(0, -1).map((exchange, index) => <div key={index}><strong>{exchange.question}</strong><p>{exchange.answer}</p><Source exchange={exchange} /></div>)}</details>}</div>
            <div className="composer-section"><p>There’s always another question.</p><div className="starter-questions" aria-label="Suggested questions">{current.questions.filter(question => question.question !== currentExchange.question).map(question => <button key={question.question} onClick={() => fillQuestion(question.question)}>{question.question}<ArrowUpRight size={12} /></button>)}</div><form className="composer" onSubmit={submitQuestion}><label className="sr-only" htmlFor="place-question">Your question about {current.name}</label><input id="place-question" ref={composer} value={state.drafts[state.selected]} onChange={event => setState(previous => ({ ...previous, drafts: { ...previous.drafts, [previous.selected]: event.target.value } }))} maxLength={300} placeholder="Follow your curiosity…" autoComplete="off" /><Button size="icon" type="submit" aria-label="Ask your question" disabled={!state.drafts[state.selected].trim()}><ArrowUp size={18} /></Button></form><small>Prepared answers for this example. No live AI.</small></div>
          </section>
        </div>
        <div className="demo-footer"><span><BookOpen size={13} />Real places. Linked sources. A small taste of Placewise.</span><span>{storageAvailable ? 'Your example stays in this browser.' : 'Browser storage is unavailable. This example lasts for this visit.'}</span></div>
        <p className="demo-notice" role="status">{notice}</p>
      </div>
    </section>

    <section className="story-section" id="sources" aria-labelledby="story-heading"><figure className="story-photo"><img src={PHOTO} loading="lazy" alt="A closer view of Coit Tower among the trees of Telegraph Hill" onError={event => { event.currentTarget.style.visibility = 'hidden' }} /><figcaption><span>37.8024° N<br />122.4058° W</span><a href={PHOTO_SOURCE} target="_blank" rel="noreferrer">Sasha / @sanfrancisco · CC0<ArrowUpRight size={12} /></a></figcaption><span className="photo-caption">Look a little closer.</span></figure><div className="story-copy" data-reveal><span className="section-number">03 / WONDER, WITH SOMETHING BEHIND IT</span><h2 id="story-heading">A good story.<br /><em>A source to go with it.</em></h2><p>Curiosity deserves more than a confident answer. See where a story comes from, check it for yourself, and keep asking.</p><div className="trust-detail"><BookOpen size={21} strokeWidth={1.25} /><div><h3>Follow the source</h3><p>References stay beside the answer, so you can read the original.</p></div></div><div className="trust-detail"><Compass size={21} strokeWidth={1.25} /><div><h3>Leave room for the unknown</h3><p>Some places have more to tell than others. When evidence is thin, the answer should say so.</p></div></div><a className="text-link" href={places.coit.questions[0].source} target="_blank" rel="noreferrer">Read the Coit Tower story<ArrowUpRight size={16} /></a></div></section>

    <section className="faq-section section-shell" id="questions" aria-labelledby="faq-heading"><div data-reveal><span className="section-number">A FEW THINGS YOU MIGHT WONDER</span><h2 id="faq-heading">Before you<br /><em>wander off.</em></h2></div><Accordion type="single" collapsible className="faq-list"><AccordionItem value="try"><AccordionTrigger>Can I try Placewise now?</AccordionTrigger><AccordionContent>You can explore the interactive Telegraph Hill example on this page. It uses prepared, sourced answers. The full map exploration experience and live answers are still being built.</AccordionContent></AccordionItem><AccordionItem value="place"><AccordionTrigger>Is it just for San Francisco?</AccordionTrigger><AccordionContent>San Francisco is the setting for this example. Placewise is being built for curiosity anywhere: a new city, your own neighborhood, or a place across the world. The detail available will depend on the sources for each place.</AccordionContent></AccordionItem><AccordionItem value="plan"><AccordionTrigger>Will it plan my day?</AccordionTrigger><AccordionContent>Placewise helps you discover and understand a few places that interest you. The places form a group you can refine, without a set order, schedule, or turn-by-turn route. You decide where curiosity takes you.</AccordionContent></AccordionItem><AccordionItem value="account"><AccordionTrigger>Do I need an account or my location?</AccordionTrigger><AccordionContent>No account or location permission is needed for this example. The planned web prototype will also work without sign-in, and sharing your location will be optional.</AccordionContent></AccordionItem><AccordionItem value="saved"><AccordionTrigger>What happens to my questions?</AccordionTrigger><AccordionContent>This example saves your choices and prepared conversations in this browser when storage is available. Reset clears the example. Nothing syncs between devices. The future live prototype will send questions to an AI service; browser-local history does not mean answers are generated on your device.</AccordionContent></AccordionItem></Accordion></section>

    </main>
    <footer className="site-footer"><div className="footer-invitation" data-reveal><span className="small-star" aria-hidden="true">✳</span><span className="eyebrow">The world is still full of stories</span><h2>What caught<br /><em>your eye?</em></h2><Button asChild variant="light"><a href="#explore">Follow your curiosity<ArrowUpRight size={18} /></a></Button><p>Try the example. No account needed.</p></div><div className="footer-bottom"><Brand /><span>A little more curious. A little more connected.</span><a href="#sources">Sources & approach<ArrowUpRight size={13} /></a><span className="copyright">© {new Date().getFullYear()} Placewise</span></div><span className="footer-watermark" aria-hidden="true">placewise</span></footer>
  </>
}

export default App
