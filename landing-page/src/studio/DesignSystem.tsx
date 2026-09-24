import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { ArrowRight, Check, Copy, Download, Menu, Moon, Sun, X } from 'lucide-react'
import { tokenRecords, type TokenRecord } from '../design-system/token-catalog.mjs'
import { primitiveTokens, resolveToken, typographyRoles, type ThemeMode } from '../design-system/tokens'
import DesignSystemExamples from './DesignSystemExamples'
import './design-system.css'
import { pageInfo, navGroups, readPage } from '../design-system/navigation'

type Preference = ThemeMode | 'system'
type Props = { mode: ThemeMode; themePreference: Preference; onThemeChange: (value: Preference) => void; embedded?: boolean }
const isType = (record: TokenRecord) => /^--(?:primitive-)?(?:font|leading|tracking|type-|letter-spacing)/.test(record.name)
const layerNames: Record<string, string> = { primitive: 'Primitive', semantic: 'Semantic' }
const recordsByName = new Map(tokenRecords.map(record => [record.name, record]))
const primitiveColors = tokenRecords.filter(record => record.layer === 'primitive' && record.type === 'COLOR')
const colorUsage = new Map(primitiveColors.map(record => [record.name, new Set<ThemeMode>()]))
for (const record of tokenRecords.filter(record => record.layer === 'semantic' && record.type === 'COLOR')) {
  for (const mode of ['light', 'dark'] as const) {
    let primitive = record
    while (primitive.aliases[mode]) primitive = recordsByName.get(primitive.aliases[mode]!)!
    colorUsage.get(primitive.name)?.add(mode)
  }
}
function colorUsageLabel(name: string) {
  const usage = colorUsage.get(name)!
  return usage.size === 2 ? 'Light + Dark' : usage.has('dark') ? 'Dark' : usage.has('light') ? 'Light' : 'Available; unused'
}

function TokenValue({ record, mode }: { record: TokenRecord; mode: ThemeMode }) {
  return <div className="ds-record-value">{record.type === 'COLOR' && <span className="ds-record-color" style={{ background: record.cssValues[mode] }} aria-hidden="true" />}<div><code>{record.cssValues[mode]}</code>{record.aliases[mode] && <span className="ds-record-alias">↳ {record.aliases[mode]}</span>}</div></div>
}

function TokenReference({ category, mode }: { category: 'colors' | 'sizes' | 'typography'; mode: ThemeMode }) {
  const [layer, setLayer] = useState(category === 'colors' ? 'primitive' : 'semantic')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('Select a token name to copy its CSS reference.')
  const [copied, setCopied] = useState('')
  const categories = tokenRecords.filter(record => category === 'colors' ? record.type === 'COLOR' : category === 'typography' ? isType(record) : record.type !== 'COLOR' && !isType(record))
  const layers = [...new Set(categories.map(record => record.layer))]
  const records = categories.filter(record => record.layer === layer && `${record.name} ${record.description} ${record.figmaName}`.toLowerCase().includes(query.toLowerCase()))
  async function copy(record: TokenRecord) {
    try { await navigator.clipboard.writeText(`var(${record.name})`); setCopied(record.name); setMessage(`Copied var(${record.name}).`) }
    catch { setMessage(`Copy this reference: var(${record.name})`) }
  }
  return <section className="ds-token-reference" aria-labelledby="ds-token-reference-title">
    <div className="ds-subheading"><div><h2 id="ds-token-reference-title">Token reference</h2><p>Layers describe the value’s job. Appearance selects its theme.</p></div><a href="#ds-figma">Figma mapping <ArrowRight size={16} aria-hidden="true" /></a></div>
    <div className="ds-token-tools"><div className="ds-layer-choice" role="group" aria-label="Token layer">{layers.map(item => <button key={item} aria-pressed={layer === item} onClick={() => setLayer(item)}>{layerNames[item] || item}</button>)}</div><label className="ds-filter">Filter tokens<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name or purpose" /></label></div>
    <div className="ds-record-summary"><p>{records.length} {layerNames[layer].toLowerCase()} tokens · {layer === 'primitive' ? 'Default values shared by both themes' : `Viewing ${mode}; both mode mappings shown`}</p><p role="status">{message}</p></div>
    <div className="ds-table-wrap" tabIndex={0} role="region" aria-label={`${category} token records. Scroll horizontally for both modes.`}>
      <table className="ds-token-table"><thead><tr><th scope="col">Token / purpose</th><th scope="col">{layer === 'primitive' ? 'Shared value' : 'Light'}</th><th scope="col">{layer === 'primitive' ? 'Figma mapping' : 'Dark'}</th></tr></thead><tbody>{records.map(record => <tr key={record.name}>
        <th scope="row"><button className="ds-copy-token" onClick={() => void copy(record)} aria-label={`Copy ${record.name}`}><code>{record.name}</code>{copied === record.name ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}</button><span className="ds-record-meta">{layerNames[record.layer]} · {record.type.toLowerCase()} · {record.unit || 'no unit'}</span><p>{record.description}</p>{layer === 'semantic' && <span className="ds-record-mapping">{record.collection} / {record.figmaName}</span>}</th>
        <td><TokenValue record={record} mode="light" /></td><td>{layer === 'primitive' ? <div className="ds-record-mapping"><strong>{record.collection}</strong><code>{record.figmaName}</code><span>One invariant value</span>{record.type === 'COLOR' && <span>Theme use: {colorUsageLabel(record.name)}</span>}</div> : <TokenValue record={record} mode="dark" />}</td>
      </tr>)}</tbody></table>{!records.length && <p className="ds-empty" role="status">No matching tokens. Try a shorter name or choose the other layer.</p>}
    </div><p className="ds-note">Values come from <a href="source/src/design-system/tokens.json">tokens.json</a>. Component tokens will be added when components need their own reusable decisions.</p>
  </section>
}

function Colors({ mode }: { mode: ThemeMode }) {
  const [usage, setUsage] = useState<'all' | ThemeMode>('all')
  const familyOf = (record: TokenRecord) => {
    const family = record.name.replace('--primitive-color-', '').replace(/-\d+$/, '')
    return family === 'white' || family === 'slate' ? 'neutrals' : family
  }
  const families = [...new Set(Object.keys(primitiveTokens).filter(name => colorUsage.has(name)).map(name => familyOf(recordsByName.get(name)!)))]
  const visible = primitiveColors.filter(record => usage === 'all' || colorUsage.get(record.name)!.has(usage))
  return <><section className="ds-color-palette" aria-labelledby="ds-color-palette-title">
    <div className="ds-subheading"><div><h2 id="ds-color-palette-title">Primitive palette</h2><p>Every shade used by the light and dark themes. Each primitive keeps one value; semantic roles choose the shade.</p></div><label className="ds-filter">Palette usage<select value={usage} onChange={event => setUsage(event.target.value as typeof usage)}><option value="all">All colors</option><option value="light">Used in Light</option><option value="dark">Used in Dark</option></select></label></div>
    <p className="ds-palette-summary" role="status">{visible.length} of {primitiveColors.length} primitive colors · Labels show semantic theme use.</p>
    {families.map(family => {
      const shades = visible.filter(record => familyOf(record) === family).sort((a, b) => a.name === '--primitive-color-white' ? -1 : b.name === '--primitive-color-white' ? 1 : a.name.localeCompare(b.name, undefined, { numeric: true }))
      return shades.length > 0 && <section className="ds-color-family" key={family} aria-labelledby={`ds-palette-${family}`}><h3 id={`ds-palette-${family}`}>{family}</h3><div className="ds-color-ramp">{shades.map(record => <figure key={record.name} data-primitive={record.name}><div className="ds-palette-swatch" style={{ background: `var(${record.name})` }} aria-hidden="true"/><figcaption><strong>{record.name.replace('--primitive-color-', '')}</strong><code>{record.cssValues.light}</code><span>{colorUsageLabel(record.name)}</span></figcaption></figure>)}</div></section>
    })}
    <p className="ds-note">Names use the <code>--primitive-color-</code> prefix. “Available; unused” shades have no semantic role yet. Theme usage is derived from the actual aliases, including shared roles.</p>
  </section><div className="ds-callout"><strong>Start with a role.</strong><p>Use <code>--primary</code> with <code>--primary-foreground</code> for an action. Keep Peach for brand details; feedback has its own surface and text pairs.</p></div><TokenReference category="colors" mode={mode} /></>
}

function Typography({ mode }: { mode: ThemeMode }) {
  const [sample, setSample] = useState('A little context changes the view.')
  return <><div className="ds-type-pair"><article><span>Short headlines</span><h2>Bricolage Grotesque</h2><p className="ds-type-display">Aa?</p><code>--font-display</code></article><article><span>Reading and interface</span><h2>Instrument Sans</h2><p className="ds-type-body">Aa?</p><code>--font-body</code></article></div><label className="ds-type-edit">Try a place, question or headline<input value={sample} onChange={event => setSample(event.target.value)} maxLength={100} /></label><div className="ds-type-roles">{typographyRoles.map(role => <article key={role.name}><div><h3>{role.name}</h3><span>{resolveToken(role.size, mode)} / {resolveToken(role.weight, mode)} / {resolveToken(role.lineHeight, mode)} leading</span><span>{resolveToken(role.tracking, mode)} tracking</span></div><p style={{fontFamily:`var(${role.font})`,fontSize:`var(${role.size})`,fontWeight:`var(${role.weight})`,lineHeight:`var(${role.lineHeight})`,letterSpacing:`var(${role.tracking})`} as CSSProperties}>{sample || 'Get to know a place.'}</p></article>)}</div><p className="ds-note">Keep Bricolage upright with optical sizing enabled. Use Instrument for reading at 16px or larger. Rem measurements assume a 16px root; text must reflow when enlarged.</p><TokenReference category="typography" mode={mode} /></>
}

function Sizes({ mode }: { mode: ThemeMode }) {
  const spaces = ['xs','sm','md','lg','xl','2xl','3xl']
  const [moved, setMoved] = useState(false)
  return <><section className="ds-size-overview"><div><h2>Spacing rhythm</h2><div className="ds-space-specimen">{spaces.map(size => <div key={size}><span style={{height:`var(--space-${size})`}} /><strong>{size}</strong><code>{resolveToken(`--space-${size}`, mode)}</code></div>)}</div></div><div><h2>Shape and depth</h2><div className="ds-shape-specimen">{['--radius-sm','--radius','--radius-lg'].map(token => <div key={token}><span style={{borderRadius:`var(${token})`}}/><code>{resolveToken(token,mode)}</code></div>)}</div><div className="ds-depth-specimen">{['--shadow-sm','--shadow-md'].map(token=><div key={token} style={{boxShadow:`var(${token})`}}><code>{token}</code></div>)}</div></div></section><div className="ds-callout"><strong>Give the action room.</strong><p>Use <code>--target-min</code> ({resolveToken('--target-min',mode)}) as the target floor and <code>--control-height</code> ({resolveToken('--control-height',mode)}) for default controls. Keep icons at 16, 20 or 24px inside those targets.</p></div><section className="ds-motion-example"><div><h2>Motion with a purpose</h2><p>Normal transitions use {resolveToken('--motion-normal',mode)}. Reduced motion removes this transition.</p><button className="button button-secondary" aria-pressed={moved} onClick={()=>setMoved(value=>!value)}>Preview transition</button></div><div className="ds-motion-track" aria-hidden="true"><span className={moved?'is-moved':''}/></div></section><TokenReference category="sizes" mode={mode} /></>
}

function Foundations() {
  return <><div className="ds-foundation-intro"><p>Use quiet surfaces and clear hierarchy around the place, question and answer. Keep sources close. The interface should make exploring feel natural.</p><div><a className="ds-doc-link" href="source/docs/brand_guidelines.md">Brand guidelines <ArrowRight size={18} aria-hidden="true" /></a><a className="ds-doc-link" href="source/docs/DESIGN_SYSTEM.md">Implementation guide <ArrowRight size={18} aria-hidden="true" /></a></div></div><section className="ds-principles"><article><h2>Start with the place</h2><p>Keep location context visible while someone reads or asks a follow-up. The map and answer should feel connected.</p></article><article><h2>Respect attention</h2><p>Give a concise first answer. Use progressive disclosure for detail and short forms for preferences.</p></article><article><h2>Make trust visible</h2><p>Keep source links beside supported claims. Label prepared examples and make missing evidence plain.</p></article><article><h2>Give curiosity room</h2><p>Use the chosen type hierarchy and whitespace. Reserve wit for invitations; keep errors direct.</p></article></section><section className="ds-guidance"><h2>iOS component patterns</h2><p>The <a href="#mockup">iPhone prototype</a> uses <a href="https://ionicframework.com/docs/react/add-to-existing">Ionic React</a> in iOS mode for navigation, its sidebar, buttons, lists, popovers, selects, form controls, icons and loading feedback. Preserve Ionic’s component geometry and interaction states while applying Placewise typography and colors. The attachment popover stays above + inside the phone, and the approved compact composer behavior stays intact.</p><p>Ionic supplies third-party web components, with Ionicons for app icons. Apple’s <a href="https://developer.apple.com/design/human-interface-guidelines/buttons">button</a>, <a href="https://developer.apple.com/design/human-interface-guidelines/menus">menu</a> and <a href="https://developer.apple.com/design/human-interface-guidelines/toggles">toggle</a> guidance informs their use; native UIKit, SwiftUI and SF Symbols are not imported. Mapbox remains the map provider. File pickers and the real mobile keyboard remain OS features; the desktop keyboard uses Ionic buttons in its simulated layout. The marketing page and documentation shell retain their existing primitives; live phone-control specimens use Ionic components.</p></section><section className="ds-guidance"><h2>Layout and responsive behavior</h2><p>Use the 8px spacing rhythm with a 4px step for compact gaps. This reference uses a 272px desktop sidebar, an independently scrolling menu and a reading column capped at 1120px. At 850px, the sidebar becomes a labeled menu drawer.</p><p>Keep readable content within the viewport. Wide token tables scroll inside their own region. Reflow text and forms before reducing their size. Structural grid tracks and breakpoint mechanics remain local layout choices.</p></section><section className="ds-guidance"><h2>Accessibility is part of the foundation</h2><p>Pair semantic surfaces with their matching foregrounds. The current token checks cover 4.5:1 text and 3:1 input/focus boundaries. Label controls, expose selection states and keep a visible keyboard focus ring.</p><p>Use 44px minimum interaction targets for new components. Preserve Ionic’s keyboard behavior in the phone and live specimens, and native or Radix behavior in the documentation shell and marketing controls. Honor reduced motion, support Escape in the mobile menu and return focus when it closes.</p></section><section className="ds-guidance"><h2>Content guidance</h2><p>Use sentence case, familiar words and clear actions: “Explore this area,” “Ask a question,” “Try again.” Preserve names and questions during recovery. Never imply that prepared answers are live AI or that a suggested group is a route.</p></section><div className="ds-related-links"><a href="#ds-colors">Colors <ArrowRight size={18}/></a><a href="#ds-typography">Typography <ArrowRight size={18}/></a><a href="#ds-ui-patterns">UI patterns <ArrowRight size={18}/></a></div></>
}

function FigmaLibrary() {
  const primary = tokenRecords.find(record=>record.name==='--primary')!
  return <><div className="ds-sync-status"><span className="ds-status-mark" aria-hidden="true"/><div><strong>Library not connected</strong><p>No target Figma file is configured. The local mapping is available; it has not been applied to a Figma library.</p></div></div><div className="ds-download-row"><a className="button button-primary" href="design-system.tokens.json" download><Download size={16} aria-hidden="true"/>Download token mapping</a><span>Generated from the code token source</span></div><section className="ds-guidance"><h2>Collections and theme modes</h2><div className="ds-table-wrap" tabIndex={0} role="region" aria-label="Figma collection mapping"><table className="ds-compact-table"><thead><tr><th>Collection</th><th>Modes</th><th>Contents</th></tr></thead><tbody><tr><th>Primitives</th><td>Default</td><td>Invariant raw values. Shared by both themes.</td></tr><tr><th>Semantic</th><td>Light · Dark</td><td>One identity per role, with aliases for each mode.</td></tr></tbody></table></div><p>Component tokens are deferred. The export preserves code names as stable keys and provides explicit slash-separated Figma variable names.</p></section><section className="ds-guidance"><h2>An alias, end to end</h2><pre className="ds-code-block">{JSON.stringify({code:primary.name,collection:primary.collection,variable:primary.figmaName,type:primary.type,light:primary.aliases.light,dark:primary.aliases.dark},null,2)}</pre><p>A writer must resolve canonical alias keys to actual Figma variable IDs. This mapping is an adapter contract, not a claim that arbitrary JSON can be imported directly.</p></section><section className="ds-guidance"><h2>Units and mapping limits</h2><p>Color exports use RGBA values. Rem dimensions use a documented 16px base. Unitless line height, em letter spacing and pixel dimensions retain distinct unit metadata. Typography exports scalar attributes; a writer must compose the text styles.</p><p>CSS font stacks need font-family mapping. Shadows need effect styles or decomposed bindings. Easing and duration records preserve the source data but need writer-specific motion support. The export records these limits per token.</p></section><section className="ds-guidance"><h2>Synchronization status</h2><p>Code → Figma is the intended direction. Applying this mapping requires a target file and a verified writer, followed by read-back checks of values, aliases, modes and bindings. No external write or recurring synchronization is configured.</p><a className="ds-inline-code-link" href="source/src/design-system/token-catalog.mjs">View the mapping adapter <ArrowRight size={16} aria-hidden="true"/></a></section></>
}

type SidebarProps = Props & { page: string; mobile?: boolean; onNavigate?: () => void }

function Sidebar({page,mode,themePreference,onThemeChange,mobile=false,onNavigate}:SidebarProps) {
  return <><div className="ds-sidebar-title"><span>Placewise</span><strong>Design system</strong><small>Foundation v0.3</small><a href="#mockup" className="ds-mockup-link">iPhone mockup</a></div><nav className="ds-sidebar-nav" aria-label={mobile?'Mobile design system sections':'Design system sections'}>{navGroups.map((group,index)=><div className="ds-nav-group" key={index}>{group.label&&<h2>{group.label}</h2>}{group.pages.map(key=><a key={key} href={`#ds-${key}`} aria-current={page===key?'page':undefined} onClick={mobile?onNavigate:undefined}>{pageInfo[key].title}</a>)}</div>)}</nav><div className="ds-sidebar-footer"><span>Appearance</span><div className="ds-theme-row"><button type="button" role="switch" aria-checked={mode==='dark'} aria-label="Dark mode" className="ds-theme-switch" onClick={()=>onThemeChange(mode==='dark'?'light':'dark')}><span className="ds-switch-track"><span/></span>{mode==='dark'?<Moon size={16} aria-hidden="true"/>:<Sun size={16} aria-hidden="true"/>}<span>{mode==='dark'?'Dark':'Light'}</span></button><button type="button" className="ds-system-button" aria-pressed={themePreference==='system'} onClick={()=>onThemeChange('system')}>System</button></div></div></>
}

export default function DesignSystem({mode,themePreference,onThemeChange,embedded=false}:Props) {
  const [page,setPage] = useState(readPage)
  const [menuOpen,setMenuOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const contentHeading = useRef<HTMLHeadingElement>(null)
  const closeFocus = useRef<'menu' | 'content' | 'none'>('menu')
  const mounted = useRef(false)
  useEffect(()=>{const update=()=>{setPage(readPage());if(dialog.current?.open){closeFocus.current=/^(#design-system|#ds-)/.test(location.hash)?'content':'none';dialog.current.close()}};window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update)},[])
  useEffect(()=>{if(mounted.current){window.scrollTo({top:0,behavior:'instant'});contentHeading.current?.focus({preventScroll:true})}else mounted.current=true},[page])
  useEffect(()=>{if(!menuOpen)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous}},[menuOpen])
  useEffect(()=>{
    try {
      if(typeof window.matchMedia!=='function')return
      const mq=window.matchMedia('(min-width: 851px)')
      const close=()=>{if(mq.matches&&dialog.current?.open){closeFocus.current='content';dialog.current.close()}}
      if(typeof mq.addEventListener==='function'){mq.addEventListener('change',close);return()=>mq.removeEventListener('change',close)}
      if(typeof mq.addListener==='function'){mq.addListener(close);return()=>mq.removeListener(close)}
    }catch{/* The menu still works when the viewport-query API is unavailable. */}
  },[])
  function closeMenu(){dialog.current?.close()}
  function trapMenuFocus(event: ReactKeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]')).filter(element => element.getClientRects().length > 0)
    const first = controls[0], last = controls[controls.length - 1]
    if (event.shiftKey && (document.activeElement === first || !event.currentTarget.contains(document.activeElement))) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
  function openMenu(){if(!dialog.current||dialog.current.open)return;closeFocus.current='menu';dialog.current.showModal();setMenuOpen(true)}
  function navigateFromMenu(){closeFocus.current='content';closeMenu()}
  function handleMenuClosed(){
    setMenuOpen(false)
    if(closeFocus.current==='menu')menuButton.current?.focus()
    // Hash navigation and the dialog's native focus restoration finish first.
    if(closeFocus.current==='content')requestAnimationFrame(()=>contentHeading.current?.focus({preventScroll:true}))
  }
  const info=pageInfo[page]
  return <div className={`ds-shell${embedded ? ' ds-shell--embedded' : ''}`}>{!embedded && <><aside className="ds-sidebar"><Sidebar page={page} mode={mode} themePreference={themePreference} onThemeChange={onThemeChange}/></aside><div className="ds-mobile-bar"><button ref={menuButton} aria-expanded={menuOpen} aria-controls="ds-mobile-menu" aria-haspopup="dialog" onClick={openMenu}><Menu size={20} aria-hidden="true"/>Menu</button><span>{info.title}</span></div><dialog id="ds-mobile-menu" className="ds-mobile-dialog" ref={dialog} aria-label="Design system menu" onKeyDown={trapMenuFocus} onClose={handleMenuClosed} onClick={event=>{if(event.target===event.currentTarget)closeMenu()}}><div className="ds-drawer"><div className="ds-drawer-header"><strong>Contents</strong><button aria-label="Close menu" onClick={closeMenu}><X size={20} aria-hidden="true"/></button></div><Sidebar mobile page={page} mode={mode} themePreference={themePreference} onThemeChange={onThemeChange} onNavigate={navigateFromMenu}/></div></dialog></>}<div className="ds-document" id="design-system-content"><header className="ds-page-heading"><p>{info.group}</p><h1 ref={contentHeading} tabIndex={-1} id={`ds-${page}`}>{info.title}</h1><div>{info.description}</div></header>{page==='figma'?<FigmaLibrary/>:page==='foundations'?<Foundations/>:page==='colors'?<Colors mode={mode}/>:page==='sizes'?<Sizes mode={mode}/>:page==='typography'?<Typography mode={mode}/>:<DesignSystemExamples page={page}/>}<footer className="ds-document-footer"><span>Code is the source of truth.</span><a href="source/docs/DESIGN_SYSTEM.md">Implementation guide <ArrowRight size={14} aria-hidden="true"/></a></footer></div></div>
}
