import { ArrowDown, ChevronDown, Download, MapPin, MessageCircle, Store, LocateFixed, Image as ImageIcon, Compass, ArrowUpRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { PresentationFrame } from '../components/ui/presentation-frame'
import { brandChapters, goToPresentationChapter } from '../lib/presentation-chapters'
import brandGuidelines from '../../../docs/brand_guidelines.md?raw'
import './product-presentation.css'
import './brand-presentation.css'

// The numbered specifications come directly from the downloadable guidelines.
const chapters = brandGuidelines.split('## Appendix:')[0].split(/^## (?=\d\.0 )/m).slice(1).map(text => {
  const [intro, ...sections] = text.split(/^### /m)
  return { intro, sections: sections.map(section => {
    const [title, ...body] = section.split('\n')
    return { title, body: body.join('\n').split(/^## Appendix:/m)[0].trim() }
  }) }
})
const appendix = brandGuidelines.split('## Appendix: Placewise-specific guidance')[1].split(/^### /m).slice(1, 4).map(text => {
  const [title, ...body] = text.split('\n')
  return { title, body: body.join('\n').trim() }
})
const descriptions = [
  'A map-based way to understand places. Curious and thoughtful, with a little wit.',
  'A recognizable identity starts with a considered mark. Our final logo and its specifications are still to be defined.',
  'White gives content room. Glacier gives it context. Oxblood brings the voice. Peach adds a small touch of warmth.',
  'Bricolage Grotesque for character. Instrument Sans for clarity. Two approved families, with distinct roles.',
  'Familiar symbols keep attention on the place and the question. Build on the existing interface vocabulary.',
  'Streets, buildings and ordinary life belong alongside landmarks. Show the actual place, with its context intact.',
  'Make evidence understandable. The chart system is a placeholder until its rules and examples are defined.',
]

function InlineText({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>
    if (part.startsWith('[')) return <span key={index}>{part.slice(1, part.indexOf(']'))}</span>
    return part
  })}</>
}
function Paragraphs({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}><InlineText text={paragraph} /></p>)}</>
}
function Specifications({ index }: { index: number }) {
  return <div className="brand-specifications" aria-label={`${brandChapters[index][1]} specifications`}>
    <div className="brand-spec-label"><span>In this chapter</span><span>Open a topic to read the specification</span></div>
    {chapters[index].sections.map(section => {
      const split = section.title.indexOf(' ')
      const pending = section.body.includes('**To be defined:**')
      return <details className="brand-spec" key={section.title}>
        <summary><span className="brand-spec-number">{section.title.slice(0, split)}</span><span>{section.title.slice(split + 1)}</span>{pending && <span className="brand-spec-status">To be defined</span>}<ChevronDown size={16} aria-hidden="true" /></summary>
        <div className="brand-spec-copy"><Paragraphs text={section.body} /></div>
      </details>
    })}
  </div>
}
function Placeholder({ label, note, className = '' }: { label: string; note: string; className?: string }) {
  return <div className={`brand-placeholder ${className}`}><span className="brand-placeholder-label">To be defined</span><strong>{label}</strong><p>{note}</p></div>
}
function Specimen({ index }: { index: number }) {
  switch (index) {
    case 0: return <div className="brand-introduction">
      <div className="brand-values"><span className="product-small-label">The approved personality</span><p>Curious.<br />Thoughtful.<br /><span>A little wit.</span></p><span className="brand-purpose">Places first. Questions welcome.</span></div>
      <div className="brand-intro-aside"><Placeholder label="Our mission" note="The final approved mission statement belongs here." /><p className="brand-purpose-note">Our product purpose is to help people understand places through map-connected questions.</p><Button variant="ghost" onClick={() => goToPresentationChapter('brand', 1)}>Explore the identity <ArrowDown size={16} aria-hidden="true" /></Button></div>
    </div>
    case 1: return <div className="brand-logo-specimen"><Placeholder label="The Placewise logo" note="Final artwork, logomark and logotype" className="brand-logo-main" /><div className="brand-logo-aside"><Placeholder label="Lockup" note="Symbol + logotype relationship" /><Placeholder label="Avatar" note="App icon + social identity" /></div><p className="brand-specimen-caption">The lowercase wordmark, compass and trailing period remain provisional studies.</p></div>
    case 2: return <><div className="brand-palette" aria-label="Approved palette swatches">{[
      ['glacier', 'Glacier', '#D9F2F4', 'Supporting surfaces'], ['oxblood', 'Oxblood', '#592338', 'Lettering and actions'], ['white', 'White', '#FFFFFF', 'Canvas and reading'], ['peach', 'Peach', '#FF9479', 'A restrained detail'],
    ].map(([id, title, hex, role], i) => <div key={id} className={`brand-swatch brand-swatch-${id}`}><span>0{i + 1}</span><div><h3>{title}</h3><code>{hex}</code><p>{role}</p></div></div>)}</div><p className="brand-specimen-caption">Approved identity anchors. Primary, secondary and tertiary classification is still to be defined. Product colors use semantic tokens in both themes.</p></>
    case 3: return <><div className="brand-type-specimens"><div className="brand-type-display"><span className="product-small-label">Bricolage Grotesque · 600</span><div className="brand-type-glyph" aria-hidden="true">Aa<span>?</span></div><h3>Get to know<br />a place.</h3><p>Prominent headlines and the wordmark study. Always upright.</p></div><div className="brand-type-body"><span className="product-small-label">Instrument Sans · 400 / 500 / 600</span><div className="brand-type-glyph" aria-hidden="true">Aa<span>?</span></div><h3>Follow your questions.</h3><p>Explore an area around your interests, or pick a point on the map and ask. Follow your questions with sources you can check.</p><div className="brand-weight-row"><span>400 · Reading</span><span>500 · Controls</span><span>600 · Headings</span></div></div></div><div className="brand-serif-placeholder"><span>4.2 / Serif</span><strong>To be defined</strong><p>No serif family is approved. Both current families are sans-serif.</p></div></>
    case 4: return <><div className="brand-icon-specimens" aria-label="Existing Lucide interface icons">{[[MapPin, 'Place'], [MessageCircle, 'Question'], [Store, 'Business'], [LocateFixed, 'Location'], [ImageIcon, 'Image'], [Compass, 'Explore']].map(([Icon, label]) => {
      const Glyph = Icon as typeof MapPin
      return <div key={String(label)}><Glyph size={40} strokeWidth={1.5} aria-hidden="true" /><span>{String(label)}</span></div>
    })}</div><div className="brand-icon-notes"><p><strong>16 / 20 / 24px</strong>Implemented interface sizes</p><p><strong>44px</strong>Minimum touch target</p><p><strong>Custom construction</strong>Grid, weight and optical rules to be defined</p></div><p className="brand-specimen-caption">Lucide library specimens, enlarged for presentation. Platform-specific libraries follow the product requirements.</p></>
    case 5: return <><div className="brand-photo-specimens">{[['01', 'A street', 'Everyday neighborhood context'], ['02', 'A building', 'A verified geographic subject'], ['03', 'Ordinary life', 'People and places in context']].map(([number, title, note]) => <figure key={number}><div className="brand-photo-frame"><span>{number}</span><ImageIcon size={32} strokeWidth={1} aria-hidden="true" /><span>Photograph to be selected</span></div><figcaption><strong>{title}</strong><span>{note}</span><small>Source, credit and license to be defined</small></figcaption></figure>)}</div><p className="brand-specimen-caption">Reserved for verified photography. Generated or unrelated imagery must never stand in for documentary evidence of a real place.</p></>
    default: return <div className="brand-data-specimen"><div className="brand-data-caption"><span className="product-small-label">System status</span><h3>Evidence first.<br />Style follows.</h3><p>Axes, colors, spacing and chart behavior will be documented here once defined.</p></div><Placeholder label="Chart system" note="Approved chart examples and real source data belong here." /></div>
  }
}

export default function BrandPresentation({ active, onChapterChange }: { active: number; onChapterChange: (chapter: number) => void }) {
  return <PresentationFrame view="brand" title="Brand guidelines" sourceText={brandGuidelines} fileName="placewise-brand-guidelines.md" active={active} onChapterChange={onChapterChange}>
    {downloadUrl => <div className="product-content">
      {brandChapters.map(([id, title], index) => <section key={id} id={`brand-${id}`} data-chapter tabIndex={-1} className={`product-chapter brand-guideline-chapter ${index === 0 ? 'brand-cover' : ''}`} aria-labelledby={`brand-${id}-title`}>
        <div className="product-section-top"><span>Placewise / Brand guidelines</span><span>{index === 0 ? 'Version 0.5.0 · September 2026' : `${String(index + 1).padStart(2, '0')} / 07`}</span></div>
        <div className="brand-chapter-heading"><span className="brand-chapter-number">{index + 1}.0</span><div>{index === 0 ? <h1 id={`brand-${id}-title`}>{title}</h1> : <h2 id={`brand-${id}-title`}>{title}</h2>}<p>{descriptions[index]}</p></div></div>
        <Specimen index={index} />
        <Specifications index={index} />
        {index === 0 && <p className="brand-status-key"><strong>How to read this guide</strong> Approved decisions, implemented choices and draft guidance stay distinct. “To be defined” marks an open decision.</p>}
      </section>)}
      <section className="product-chapter brand-appendix" aria-labelledby="brand-appendix-title"><div className="product-section-top"><span>Appendix</span><span>The Placewise details</span></div><div className="brand-appendix-heading"><h2 id="brand-appendix-title">The way we speak.<br />The trust we keep.</h2><p>Our voice, product behavior and guardrails remain part of the guidelines, alongside the seven identity chapters.</p></div><div className="brand-specifications">{appendix.map(section => <details className="brand-spec" key={section.title}><summary><span>{section.title}</span><ChevronDown size={16} aria-hidden="true" /></summary><div className="brand-spec-copy"><Paragraphs text={section.body} /></div></details>)}</div><div className="brand-final-note"><p>One place. One question.<br /><strong>A little more understanding.</strong></p><Button asChild variant="secondary"><a href="?view=product">The product direction <ArrowUpRight size={16} aria-hidden="true" /></a></Button></div><footer className="product-colophon"><span>Placewise · Brand guidelines v0.5.0 · Working draft</span><a href={downloadUrl} download="placewise-brand-guidelines.md">Full guidelines & references <Download size={14} aria-hidden="true" /></a></footer></section>
    </div>}
  </PresentationFrame>
}
