import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, ArrowUp, BookOpen, Bookmark, Check, ChevronDown, Compass, Leaf, MapPin, Menu, Plus, RotateCcw, Sparkles, X } from 'lucide-react'
import { Button } from './components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion'
import { NeighborhoodMap } from './components/neighborhood-map'
import { PHOTO, PHOTO_SOURCE, interests, placeIds, places, suggestionsFor, type Exchange, type Interest, type PlaceId } from './lib/places'

const STORAGE_KEY = 'placewise-landing-demo-v1'
type DemoState = {
  selected: PlaceId; interest: Interest; visible: PlaceId[]; kept: PlaceId[]; added: PlaceId[]; excluded: PlaceId[];
  drafts: Record<PlaceId, string>; conversations: Record<PlaceId, Exchange[]>
}
const initialState: DemoState = {
  selected: 'coit', interest: 'A little of everything', visible: [...placeIds], kept: [], added: [], excluded: [],
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
    const conversations = Object.fromEntries(placeIds.map(id => [id, saved.conversations[id].map((item: Exchange) => places[id].questions.find(q => q.question === item?.question)).filter(Boolean)])) as Record<PlaceId, Exchange[]>
    return { selected: saved.selected, interest: saved.interest, visible: saved.visible, kept: saved.kept, added: validIds(saved.added) ? saved.added : [], excluded: validIds(saved.excluded) ? saved.excluded : [], drafts: saved.drafts, conversations }
  } catch { return initialState }
}

function Source({ exchange }: { exchange: Exchange }) {
  return <a className="source-link" href={exchange.source} target="_blank" rel="noreferrer"><BookOpen size={13} aria-hidden="true" />{exchange.sourceLabel}<ArrowUpRight size={12} aria-hidden="true" /></a>
}

function Brand() {
  return <a className="brand" href="#home" aria-label="Placewise home"><span className="brand-symbol" aria-hidden="true"><Compass size={24} strokeWidth={1.65} /></span>placewise<span className="brand-period">.</span></a>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [state, setState] = useState<DemoState>(restoreDemo)
  const [heroPlace, setHeroPlace] = useState<PlaceId>('coit')
  const [pendingInterest, setPendingInterest] = useState<Interest>(state.interest)
  const [notice, setNotice] = useState('')
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [photoFailed, setPhotoFailed] = useState(false)
  const [conversationOpen, setConversationOpen] = useState(true)
  const composer = useRef<HTMLInputElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const current = places[state.selected]
  const conversation = state.conversations[state.selected]
  const currentExchange = conversation[conversation.length - 1] || current.questions[0]
  const heroCurrent = places[heroPlace]

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }
    catch { setStorageAvailable(false) }
  }, [state])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.08 })
    targets.forEach(target => { target.classList.add('reveal-ready'); observer.observe(target) })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 761px)')
    const reopenOnDesktop = () => { if (desktop.matches) setConversationOpen(true) }
    desktop.addEventListener('change', reopenOnDesktop)
    return () => desktop.removeEventListener('change', reopenOnDesktop)
  }, [])

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus() }
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [menuOpen])

  function selectPlace(id: PlaceId) {
    setState(previous => ({ ...previous, selected: id }))
    setConversationOpen(true)
    setNotice('')
  }

  function fillQuestion(question: string) {
    setState(previous => ({ ...previous, drafts: { ...previous.drafts, [previous.selected]: question } }))
    setNotice('')
    composer.current?.focus({ preventScroll: true })
  }

  function openExample(id: PlaceId, question?: string) {
    setState(previous => ({ ...previous, selected: id, drafts: { ...previous.drafts, [id]: question || previous.drafts[id] } }))
    setConversationOpen(true)
    setNotice('')
  }

  function submitQuestion(event: FormEvent) {
    event.preventDefault()
    const typed = state.drafts[state.selected].trim()
    if (!typed) return
    const normalize = (text: string) => text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, '').trim()
    const match = current.questions.find(item => normalize(item.question) === normalize(typed))
    if (!match) {
      setNotice('This example has prepared answers. Choose one of the suggested questions to continue. Live answers are still being built.')
      return
    }
    setState(previous => ({ ...previous, drafts: { ...previous.drafts, [previous.selected]: '' }, conversations: { ...previous.conversations, [previous.selected]: [...previous.conversations[previous.selected], match] } }))
    setNotice('')
  }

  function updatePlaces() {
    const visible = [...new Set([...state.kept, ...state.added, ...suggestionsFor(pendingInterest).filter(id => !state.excluded.includes(id))])]
    setState(previous => ({ ...previous, interest: pendingInterest, visible, selected: visible.includes(previous.selected) ? previous.selected : visible[0] || previous.selected }))
    setNotice(`Places updated for ${pendingInterest.toLowerCase()}. Kept places stay in your group.`)
  }

  function removePlace(id: PlaceId) {
    setState(previous => {
      const visible = previous.visible.filter(item => item !== id)
      return { ...previous, visible, excluded: [...new Set([...previous.excluded, id])], kept: previous.kept.filter(item => item !== id), added: previous.added.filter(item => item !== id), selected: previous.selected === id && visible.length ? visible[0] : previous.selected }
    })
    setNotice(`${places[id].name} removed from your group. Its conversation is still saved.`)
  }

  function addPlace(id: PlaceId) {
    setState(previous => ({ ...previous, visible: [...new Set([...previous.visible, id])], added: [...new Set([...previous.added, id])], excluded: previous.excluded.filter(p => p !== id), selected: id }))
    setConversationOpen(true)
    setNotice(`${places[id].name} added to your places.`)
  }

  function reset() {
    setState({ ...initialState, drafts: { ...initialState.drafts }, conversations: { ...initialState.conversations } })
    setPendingInterest(initialState.interest)
    setNotice('Example reset. Your demo questions and choices have been cleared.')
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header" id="home">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#how-it-works">The idea</a><a href="#explore">Explore an example</a><a href="#sources">Our approach</a></nav>
        <Button asChild size="sm" className="header-cta"><a href="#explore">Follow your curiosity<ArrowUpRight size={16} /></a></Button>
        <Button ref={menuButton} className="mobile-menu-toggle" variant="ghost" size="icon" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation"><a onClick={() => setMenuOpen(false)} href="#how-it-works">The idea<ArrowUpRight size={16} /></a><a onClick={() => setMenuOpen(false)} href="#explore">Explore an example<ArrowUpRight size={16} /></a><a onClick={() => setMenuOpen(false)} href="#sources">Our approach<ArrowUpRight size={16} /></a></nav>}
    </header>
    <main id="main" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" />FOR THE CURIOUS, WHEREVER YOU ARE</p>
            <h1 id="hero-title">Find places<br />that spark<br /><em>your curiosity.</em></h1>
            <p className="hero-description">A new neighborhood. An unexpected detail.<br className="desktop-break" /> Discover places around your interests, or pick<br className="desktop-break" /> a spot and ask what’s on your mind.</p>
            <div className="hero-actions"><Button asChild><a href="#explore">Explore the example<ArrowUpRight size={18} /></a></Button><a className="text-link" href="#how-it-works">How it works<ArrowDown size={15} /></a></div>
            <p className="hero-note"><span className="mini-pin"><MapPin size={12} /></span>A little local knowledge. A whole new perspective.</p>
          </div>
          <div className="hero-visual">
            <figure className={`hero-photo ${photoFailed ? 'photo-unavailable' : ''}`}>
              <img src={PHOTO} alt="Coit Tower above the trees and homes of Telegraph Hill, with San Francisco Bay beyond" fetchPriority="high" onError={() => setPhotoFailed(true)} />
              <figcaption><MapPin size={15} /><span>Telegraph Hill<small>SAN FRANCISCO, CALIFORNIA</small></span><span className="photo-coordinates">37.8024° N<br />122.4058° W</span></figcaption>
              {photoFailed && <span className="image-fallback-note">Telegraph Hill · photograph unavailable</span>}
            </figure>
            <div className="hero-place-story">
              <div className="hero-map"><NeighborhoodMap selected={heroPlace} onSelect={setHeroPlace} visiblePlaces={[...placeIds]} compact /></div>
              <div className="hero-answer" aria-live="polite" aria-atomic="true">
                <div className="answer-place"><MapPin size={12} /><span>{heroCurrent.name}</span><span className="sample-label">EXAMPLE</span></div>
                <h2>{heroCurrent.questions[0].question}</h2>
                <p>{heroCurrent.questions[0].answer}</p>
                <Source exchange={heroCurrent.questions[0]} />
                <a className="answer-followup" href="#explore" onClick={() => openExample(heroPlace, heroCurrent.questions[1].question)}>{heroCurrent.questions[1].question}<ArrowRight size={15} /></a>
              </div>
            </div>
            <div className="hero-visual-caption"><span><span className="status-dot" />A REAL PLACE. A STORY WORTH ASKING ABOUT.</span><a href={PHOTO_SOURCE} target="_blank" rel="noreferrer" aria-label="Photo by Sasha, CC0, view source">Photo: Sasha · CC0<ArrowUpRight size={10} /></a></div>
          </div>
        </div>
        <div className="hero-bottom section-shell"><span>Less searching. More discovering.</span><a href="#how-it-works">THERE’S MORE AROUND THE CORNER<ArrowDown size={13} /></a></div>
      </section>

      <section className="introduction section-shell" id="how-it-works" aria-labelledby="intro-heading">
        <div className="intro-heading" data-reveal><p className="eyebrow">LET CURIOSITY LEAD</p><h2 id="intro-heading">You don’t need a plan.<br /><em>Just a place to begin.</em></h2><p>The street you’ve walked a hundred times.<br />The city you’re seeing for the first time.<br />There’s always something more to discover.</p></div>
        <div className="two-ways" data-reveal>
          <a href="#explore" onClick={() => setNotice('Choose an interest, then select Update places to explore the example.')}><div className="way-top"><Compass size={26} strokeWidth={1.4} /><span>01</span></div><h3>Start with a neighborhood.</h3><p>Find a few places that speak to your interests. Keep what catches your eye. Make it your own.</p><span className="way-link">Explore an area<ArrowUpRight size={16} /></span></a>
          <a href="#explore" onClick={() => openExample('coit', 'What’s inside?')}><div className="way-top"><MapPin size={26} strokeWidth={1.4} /><span>02</span></div><h3>Or one little question.</h3><p>That tower. Those steps. The story behind a name. Pick a place and see where the answer takes you.</p><span className="way-link">Ask about a place<ArrowUpRight size={16} /></span></a>
        </div>
      </section>

      <section className="explore-section" id="explore" aria-labelledby="explore-heading">
        <div className="section-shell">
          <div className="section-heading" data-reveal><div><p className="eyebrow">A SMALL TASTE OF PLACEWISE</p><h2 id="explore-heading">Your interests.<br /><em>Your kind of places.</em></h2></div><p>Let’s start on Telegraph Hill.<br />Choose an interest, open a place,<br />and ask a little more.</p></div>
          <div className="exploration">
            <div className="explore-toolbar"><div className="area-label"><span className="area-icon"><Compass size={21} strokeWidth={1.5} /></span><div><strong>Telegraph Hill</strong><span>San Francisco, California</span></div></div><span className="demo-label"><span className="status-dot" />Interactive example</span><Button variant="ghost" size="sm" onClick={reset} className="reset-button" aria-label="Reset example"><RotateCcw size={14} /><span>Reset</span></Button></div>
            <div className="interest-bar"><span className="interest-label" id="interest-label">I’m curious about</span><div className="interest-options" role="group" aria-labelledby="interest-label">{interests.map((interest, index) => <button key={interest} className={`interest-option ${pendingInterest === interest ? 'is-active' : ''}`} aria-pressed={pendingInterest === interest} onClick={() => setPendingInterest(interest)}>{index === 0 ? <Sparkles size={13} /> : index === 3 ? <Leaf size={13} /> : null}{interest}</button>)}</div><Button variant="secondary" size="sm" onClick={updatePlaces} disabled={pendingInterest === state.interest}>Update places<ArrowRight size={14} /></Button></div>
            {pendingInterest !== state.interest && <p className="preference-notice">Showing places for <strong>{state.interest.toLowerCase()}</strong>. Select Update places to apply your new interest.</p>}
            <div className="explore-workspace">
              <div className="map-and-places">
                <div className="explore-map"><NeighborhoodMap selected={state.selected} onSelect={selectPlace} visiblePlaces={[...placeIds]} /></div>
                <div className="place-list" aria-label="Suggested places"><div className="place-list-heading"><span>{state.visible.length} PLACES TO GET CURIOUS ABOUT</span><span>Yours to explore, in any order.</span></div>
                  {state.visible.map((id) => <div className={`place-row ${state.selected === id ? 'selected' : ''}`} key={id}><button className="place-select" onClick={() => selectPlace(id)} aria-pressed={state.selected === id}><span className="list-pin"><MapPin size={17} strokeWidth={1.5} /></span><span><strong>{places[id].name}</strong><small>{places[id].reason}</small></span></button><a className="place-source" href={places[id].questions[0].source} target="_blank" rel="noreferrer" aria-label={`Source for ${places[id].name}`}><ArrowUpRight size={14} /></a><button className={`keep-place ${state.kept.includes(id) ? 'is-kept' : ''}`} aria-label={`${state.kept.includes(id) ? 'Unkeep' : 'Keep'} ${places[id].name}`} aria-pressed={state.kept.includes(id)} onClick={() => setState(previous => ({ ...previous, kept: previous.kept.includes(id) ? previous.kept.filter(p => p !== id) : [...previous.kept, id] }))}>{state.kept.includes(id) ? <Check size={16} /> : <Bookmark size={16} />}</button><button className="remove-place" aria-label={`Remove ${places[id].name}`} onClick={() => removePlace(id)}><X size={15} /></button></div>)}
                  {!state.visible.length && <p className="empty-places">A fresh start. Add a place below, or pick one on the map.</p>}
                  {state.visible.length < placeIds.length && <div className="add-places">{placeIds.filter(id => !state.visible.includes(id)).map(id => <button key={id} onClick={() => addPlace(id)}><Plus size={13} />Add {places[id].name}</button>)}</div>}
                </div>
              </div>
              <section className="conversation" aria-label={`Conversation about ${current.name}`}>
                <div className="conversation-heading"><span className="category-icon"><MapPin size={21} strokeWidth={1.4} /></span><div><span className="eyebrow">{current.category}</span><h3>{current.name}</h3></div><button className="conversation-toggle" aria-label={conversationOpen ? 'Collapse conversation' : 'Expand conversation'} aria-expanded={conversationOpen} aria-controls="conversation-content" onClick={() => setConversationOpen(!conversationOpen)}><ChevronDown size={19} /></button></div>
                <div className="conversation-content" id="conversation-content" hidden={!conversationOpen}>
                  <div className="conversation-body" aria-live="polite" aria-atomic="true"><span className="question-label">YOUR CURIOSITY, ANSWERED</span><h4>{currentExchange.question}</h4><div className="placewise-answer-label"><Compass size={17} />placewise</div><p>{currentExchange.answer}</p><Source exchange={currentExchange} />{conversation.length > 1 && <details className="previous-exchanges"><summary>Earlier in this conversation ({conversation.length - 1})</summary>{conversation.slice(0, -1).map((exchange, index) => <div key={index}><strong>{exchange.question}</strong><p>{exchange.answer}</p><Source exchange={exchange} /></div>)}</details>}</div>
                  {!state.visible.includes(state.selected) && <Button variant="secondary" size="sm" onClick={() => addPlace(state.selected)}><Plus size={14} />Add to your places</Button>}
                  <div className="composer-section"><p>Keep the curiosity going.</p><div className="starter-questions" aria-label="Suggested questions">{current.questions.filter(question => question.question !== currentExchange.question).map(question => <button key={question.question} onClick={() => fillQuestion(question.question)}>{question.question}<ArrowUpRight size={12} /></button>)}</div><form className="composer" onSubmit={submitQuestion}><label className="sr-only" htmlFor="place-question">Your question about {current.name}</label><input id="place-question" ref={composer} value={state.drafts[state.selected]} onChange={event => setState(previous => ({ ...previous, drafts: { ...previous.drafts, [previous.selected]: event.target.value } }))} maxLength={300} placeholder="What else are you wondering?" autoComplete="off" /><Button size="icon" type="submit" aria-label="Ask your question" disabled={!state.drafts[state.selected].trim()}><ArrowUp size={18} /></Button></form><small>Prepared, sourced answers. Live exploration is on the way.</small></div>
                </div>
              </section>
            </div>
            <div className="demo-footer"><span><BookOpen size={13} />Real places. Sources you can follow.</span><span>{storageAvailable ? 'Your example is saved in this browser.' : 'Storage unavailable. Your example lasts for this visit.'}</span></div>
          </div>
          <p className="demo-notice" role="status">{notice}</p>
        </div>
      </section>

      <section className="story-section section-shell" id="sources" aria-labelledby="story-heading">
        <figure className="story-photo"><img src={PHOTO} loading="lazy" alt="Coit Tower and the green slopes of Telegraph Hill overlooking the San Francisco waterfront" onError={event => { event.currentTarget.style.visibility = 'hidden' }} /><div className="story-photo-overlay"><span className="eyebrow">THE FAMILIAR, SEEN DIFFERENTLY</span><p>There’s more<br />to <em>every place.</em></p></div><figcaption><span><MapPin size={13} />Telegraph Hill, San Francisco</span><a href={PHOTO_SOURCE} target="_blank" rel="noreferrer">Sasha · CC0<ArrowUpRight size={11} /></a></figcaption></figure>
        <div className="story-copy" data-reveal><p className="eyebrow">WONDER, WITH SOMETHING BEHIND IT</p><h2 id="story-heading">A good story.<br /><em>A source to go with it.</em></h2><p>Knowing a little more changes how you see a place. Knowing where it came from helps you trust it.</p><div className="trust-detail"><BookOpen size={21} strokeWidth={1.5} /><div><h3>Follow the source.</h3><p>References live beside the answer. Read the original, look closer, and make up your own mind.</p></div></div><div className="trust-detail"><Compass size={21} strokeWidth={1.5} /><div><h3>Leave room for the unknown.</h3><p>Some places have more to tell than others. When evidence is thin, the answer should say so.</p></div></div><a className="text-link" href={places.coit.questions[0].source} target="_blank" rel="noreferrer">Read the story of Coit Tower<ArrowUpRight size={16} /></a></div>
      </section>

      <section className="faq-section section-shell" id="questions" aria-labelledby="faq-heading"><div data-reveal><p className="eyebrow">A LITTLE MORE CONTEXT</p><h2 id="faq-heading">Before you<br /><em>wander off.</em></h2><p>A few things you might be wondering.</p></div><Accordion type="single" collapsible className="faq-list"><AccordionItem value="try"><AccordionTrigger>Can I try Placewise now?</AccordionTrigger><AccordionContent>Yes, you can explore the Telegraph Hill example right here. Select places, change your interests, and try the prepared, sourced questions. Full map exploration and live answers are still being built.</AccordionContent></AccordionItem><AccordionItem value="place"><AccordionTrigger>Is it just for San Francisco?</AccordionTrigger><AccordionContent>San Francisco is the setting for this example. Placewise is being built for curiosity anywhere: a new city, your own neighborhood, or a place across the world. The detail available will depend on the sources for each place.</AccordionContent></AccordionItem><AccordionItem value="plan"><AccordionTrigger>Will it plan my day?</AccordionTrigger><AccordionContent>Placewise helps you discover and understand a few places that interest you. Your group has no set order, schedule, or turn-by-turn route. You choose what to explore and where to go next.</AccordionContent></AccordionItem><AccordionItem value="account"><AccordionTrigger>Do I need an account or location access?</AccordionTrigger><AccordionContent>No account or location permission is needed for this example. The planned web prototype will also work without sign-in. Sharing your location will be optional.</AccordionContent></AccordionItem><AccordionItem value="saved"><AccordionTrigger>Will my questions be saved?</AccordionTrigger><AccordionContent>This example saves your choices, drafts, and prepared conversations in this browser when storage is available. Reset clears the example. Nothing syncs between devices, and clearing browser data removes the saved history. Future live questions will be sent to an AI service; browser-local history does not mean answers are generated on your device.</AccordionContent></AccordionItem><AccordionItem value="offline"><AccordionTrigger>Can I explore offline?</AccordionTrigger><AccordionContent>The planned prototype will need a connection for maps and new answers. Previously saved conversation text will remain readable. This landing-page example does not offer offline maps.</AccordionContent></AccordionItem></Accordion></section>

      <section className="final-invitation" aria-labelledby="invitation-heading"><div className="invitation-contours" aria-hidden="true" /><div className="invitation-content" data-reveal><span className="invitation-icon"><Compass size={30} strokeWidth={1.2} /></span><p className="eyebrow">THE WORLD IS STILL FULL OF STORIES</p><h2 id="invitation-heading">What caught <em>your eye?</em></h2><p>Start with one place. See where your curiosity takes you.</p><Button asChild><a href="#explore">Explore the example<ArrowUpRight size={18} /></a></Button><small>No account. Just curiosity.</small></div></section>
    </main>
    <footer className="site-footer section-shell"><Brand /><p>A little more curious. A little more connected.</p><div><a href="#sources">Sources & approach<ArrowUpRight size={13} /></a><span>© {new Date().getFullYear()} Placewise</span></div></footer>
  </>
}

export default App
