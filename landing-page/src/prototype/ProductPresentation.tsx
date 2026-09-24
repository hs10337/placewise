import { useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Compass, Download, Globe2, MapPin, MessageCircle, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { NeighborhoodMap } from '../components/neighborhood-map'
import { places, placeIds, type PlaceId } from '../lib/places'
import { goToPresentationChapter } from '../lib/presentation-chapters'
import { PresentationFrame } from '../components/ui/presentation-frame'
import productBrief from '../../../docs/product.md?raw'
import './product-presentation.css'

export default function ProductPresentation({ active, onChapterChange }: { active: number; onChapterChange: (chapter: number) => void }) {
  const [selected, setSelected] = useState<PlaceId>('coit')
  const place = places[selected]
  return <PresentationFrame view="product" title="Product brief" sourceText={productBrief} fileName="placewise-product.md" active={active} onChapterChange={onChapterChange}>
    {downloadUrl => <>
    <div className="product-content">
      <section id="product-idea" data-chapter tabIndex={-1} className="product-chapter product-hero" aria-labelledby="product-title">
        <div className="product-section-top"><span>01 / The idea</span><span>A map. A place. A question.</span></div>
        <div className="product-hero-grid">
          <div className="product-hero-copy">
            <p className="product-kicker"><Compass size={16} aria-hidden="true" /> For the curious among us</p>
            <h1 id="product-title">Get to know<br />a place.</h1>
            <p className="product-lead">The map shows you where.<br />Placewise helps you understand.</p>
            <p className="product-description">Explore an area around your interests, or pick a point and ask. Follow your curiosity with sources you can check.</p>
            <Button onClick={() => goToPresentationChapter('product', 1)}>Discover the idea <ArrowDown size={17} aria-hidden="true" /></Button>
          </div>
          <figure className="product-map-example">
            <div className="product-example-label"><MapPin size={15} aria-hidden="true" /><span>Telegraph Hill, San Francisco</span></div>
            <div className="product-hero-map"><NeighborhoodMap selected={selected} onSelect={setSelected} visiblePlaces={placeIds} /></div>
            <div className="product-example-question" aria-live="polite"><span><MessageCircle size={15} aria-hidden="true" />{place.name}</span><p>“{place.questions[0].question}”</p></div>
            <figcaption>Prepared example · Select a place to change the question.</figcaption>
          </figure>
        </div>
        <div className="product-hero-foot"><span>Map-first. iPhone-first. Curiosity-led.</span><span>Scroll to explore <ArrowDown size={14} aria-hidden="true" /></span></div>
      </section>

      <section id="product-problem" data-chapter tabIndex={-1} className="product-chapter" aria-labelledby="product-problem-title">
        <div className="product-section-top"><span>02 / The problem</span><span>Less searching. More being there.</span></div>
        <h2 id="product-problem-title">Curiosity shouldn’t<br />feel like homework.</h2>
        <p className="product-intro">The interesting part is the place. Getting to know it takes too much work.</p>
        <div className="product-frictions">
          {[
            ['01', 'Before you go', 'Too much to piece together.', 'Choosing worthwhile places means sifting through searches, recommendations and saved links.', 'Choose with confidence.'],
            ['02', 'While you explore', 'The moment gets interrupted.', 'A building catches your eye. Finding its name and searching for an answer pulls you away from it.', 'Ask without losing the moment.'],
            ['03', 'When you return', 'The context gets lost.', 'Places, conversations and research live apart. You have to reconstruct what you already learned.', 'Pick up where you left off.'],
          ].map(([number, label, title, body, outcome]) => <div className="product-friction" key={number}><span className="product-large-number">{number}</span><p className="product-small-label">{label}</p><h3>{title}</h3><p>{body}</p><div className="product-outcome"><ArrowRight size={16} aria-hidden="true" />{outcome}</div></div>)}
        </div>
      </section>

      <section id="product-people" data-chapter tabIndex={-1} className="product-chapter product-tinted" aria-labelledby="product-people-title">
        <div className="product-section-top"><span>03 / The people</span><span>One person. Two ways to explore.</span></div>
        <div className="product-heading-split"><h2 id="product-people-title">For people who<br />look a little closer.</h2><p>Curious, independent travelers who want to understand their surroundings and decide for themselves what’s worth their time.</p></div>
        <div className="product-modes">
          <div><span className="product-mode-icon"><Compass size={26} aria-hidden="true" /></span><p className="product-small-label">Explore an area</p><h3>“What’s interesting<br />around here?”</h3><p>Discover a small group of places shaped by your interests. Refine the group and explore each place in its own conversation.</p><span className="product-mode-note">A few places. A clearer sense of the area.</span></div>
          <div><span className="product-mode-icon"><MapPin size={26} aria-hidden="true" /></span><p className="product-small-label">Follow a question</p><h3>“What’s that?”</h3><p>Select the place that catches your attention and ask. No name, itinerary or exploration setup required.</p><span className="product-mode-note">A perfectly good place to start.</span></div>
        </div>
        <p className="product-audience-note">Also for locals rediscovering home, new residents finding their bearings, and people exploring from afar.</p>
      </section>

      <section id="product-experience" data-chapter tabIndex={-1} className="product-chapter" aria-labelledby="product-experience-title">
        <div className="product-section-top"><span>04 / The experience</span><span>Planned core interaction</span></div>
        <h2 id="product-experience-title">Start with a place.<br />See where the questions go.</h2>
        <div className="product-journey">
          {[
            ['Find', 'Choose an area or any point on the map. Search the world, or explore nearby.'],
            ['Shape', 'Share interests if you want. Discover up to five places, then keep, remove or add your own.'],
            ['Ask', 'Open a place and ask naturally. Follow-ups stay connected to that place and its sources.'],
            ['Return', 'Revisit your explorations and separate place conversations, saved in this browser.'],
          ].map(([title, body], index) => <div key={title}><span className="product-journey-dot">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{body}</p></div>)}
        </div>
        <div className="product-experience-note"><MapPin size={28} aria-hidden="true" /><div><h3>The place stays in the conversation.</h3><p>Panning the map never changes the subject of a question. Each place keeps its own context, preferences and history.</p></div></div>
        <p className="product-footnote">A direct question can skip discovery. Suggested places are an unordered group, with no implied route or schedule.</p>
      </section>

      <section id="product-trust" data-chapter tabIndex={-1} className="product-chapter product-tinted" aria-labelledby="product-trust-title">
        <div className="product-section-top"><span>05 / The trust</span><span>Useful answers. Visible evidence.</span></div>
        <div className="product-trust-grid">
          <div><h2 id="product-trust-title">Curiosity is open.<br />Facts need grounding.</h2><p className="product-intro">Specific when the evidence supports it. Honest when it doesn’t.</p><div className="product-trust-rules">
            <div><Check size={18} aria-hidden="true" /><p><strong>Sources beside the answer.</strong> Relevant evidence, with changing details checked when asked.</p></div>
            <div><Check size={18} aria-hidden="true" /><p><strong>The right place, every time.</strong> Nearby doesn’t mean identical. Unclear matches ask for a choice.</p></div>
            <div><Check size={18} aria-hidden="true" /><p><strong>Uncertainty in plain language.</strong> Missing evidence never becomes an invented identity or history.</p></div>
          </div></div>
          <div className="product-answer-example"><div className="product-answer-place"><MapPin size={18} aria-hidden="true" /><div><strong>{place.name}</strong><span>Prepared answer example</span></div></div><p className="product-answer-question">{place.questions[0].question}</p><p className="product-answer-body">{place.questions[0].answer}</p><a href={place.questions[0].source} target="_blank" rel="noreferrer" className="product-source"><span>1</span>{place.questions[0].sourceLabel}<ArrowUpRight size={14} aria-hidden="true" /></a><div className="product-evidence-note"><ShieldCheck size={18} aria-hidden="true" /><p>When evidence is missing:<br /><q>I couldn’t verify what this building was used for.</q></p></div></div>
        </div>
        <div className="product-global-note"><Globe2 size={20} aria-hidden="true" /><p><strong>Select anywhere in the world.</strong> Identification, photos and answer depth depend on the evidence available. Coordinates remain a useful starting point.</p></div>
      </section>

      <section id="product-scope" data-chapter tabIndex={-1} className="product-chapter" aria-labelledby="product-scope-title">
        <div className="product-section-top"><span>06 / The scope</span><span>Keep the first version focused.</span></div>
        <h2 id="product-scope-title">Prove the experience.<br />Then take it native.</h2>
        <div className="product-phases">
          <div className="product-phase-current"><p className="product-small-label"><span className="product-status-dot" /> Phase 1 / Current focus</p><h3>A global web prototype.</h3><p>Real maps and OpenAI answers. Built around the iPhone experience, available without an account.</p><div className="product-scope-items"><span>Area discovery and optional preferences</span><span>Any-point selection and place questions</span><span>Sources and honest missing-data fallbacks</span><span>Explorations and conversations saved locally</span></div><p className="product-footnote">Planned scope. Browser history can be lost when browsing data is cleared.</p></div>
          <div className="product-phase-later"><p className="product-small-label">Later / Native iOS</p><h3>The same curiosity.<br />Across devices.</h3><p>Carry the validated interaction into a native app. Add Sign in with Apple and account-based sync for explorations, preferences and conversations.</p><span className="product-later-note">Native delivery, accounts and sync are deferred.</span></div>
        </div>
        <div className="product-boundary"><span>Outside this scope</span><p>Full-day itineraries, navigation, bookings, venue rankings, social feeds, voice and AR. Offline answer generation and guaranteed complete coverage are also out.</p></div>
      </section>

      <section id="product-foundation" data-chapter tabIndex={-1} className="product-chapter product-tinted" aria-labelledby="product-foundation-title">
        <div className="product-section-top"><span>07 / The foundation</span><span>Proposed technical direction</span></div>
        <div className="product-heading-split"><h2 id="product-foundation-title">One experience.<br />A foundation that carries forward.</h2><p>Validate the map-and-question interaction on the web, with a shared backend the later iOS app can reuse.</p></div>
        <div className="product-stack">
          <div><span className="product-small-label">01 / In the browser</span><h3>Map, questions,<br />local memory.</h3><p>React + TypeScript + Vite<br />Ionic for the iPhone prototype<br />MapKit JS proposed for live maps<br />IndexedDB for browser history</p><span className="product-stack-note">The current map study uses Mapbox.</span></div>
          <div><span className="product-small-label">02 / Shared backend</span><h3>Evidence and answers.<br />Bounded requests.</h3><p>TypeScript on Supabase Edge Functions<br />OpenAI Responses API with web search<br />Server-side secrets and spending limits<br />Request deduplication and cancellation</p><span className="product-stack-note">Phase 1 server storage holds operational metadata.</span></div>
          <div><span className="product-small-label">03 / Later on iOS</span><h3>Native interaction.<br />Synced context.</h3><p>Swift + SwiftUI + native MapKit<br />Sign in with Apple<br />Supabase account history and sync<br />The same context and request contracts</p><span className="product-stack-note">Prototype history migration is outside scope.</span></div>
        </div>
        <p className="product-footnote">Before live implementation: resolve map-provider data permissions and validate model quality, latency and cost. No monthly budget has been set.</p>
      </section>

      <section id="product-next" data-chapter tabIndex={-1} className="product-chapter product-closing" aria-labelledby="product-next-title">
        <div className="product-section-top"><span>08 / What’s next</span><span>Validate before expanding.</span></div>
        <p className="product-kicker">The question to answer</p><h2 id="product-next-title">Can we make understanding<br />a place feel effortless?</h2>
        <p className="product-intro">Test the whole loop: discover a place, ask a question, trust the answer, and return without losing context.</p>
        <div className="product-targets"><div><strong>150<span>ms</span></strong><p>Selection feedback</p></div><div><strong>3<span>sec</span></strong><p>Resolved context or useful fallback<br />95% of the evaluation set</p></div><div><strong>5<span>sec</span></strong><p>First useful answer text<br />Median response time</p></div></div>
        <p className="product-footnote">Proposed performance targets from the PRD. These are goals to validate, not measured results.</p>
        <div className="product-closing-action"><p>Less effort finding answers.<br /><strong>More attention for the place.</strong></p><Button asChild><a href="?view=mockup">Open the map study <ArrowUpRight size={17} aria-hidden="true" /></a></Button></div>
        <footer className="product-colophon"><span>Placewise · Product direction</span><a href={downloadUrl} download="placewise-product.md">Read the full product brief <Download size={14} aria-hidden="true" /></a></footer>
      </section>
    </div>
    </>}
  </PresentationFrame>
}
