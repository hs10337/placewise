import source from './tokens.json' with { type: 'json' }

const themes = ['light', 'dark']
const canonicalName = /^--[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const aliasPattern = /^\{(--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)\}$/
const numberPattern = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/
const sorted = values => [...values].sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
const own = (object, name) => Object.prototype.hasOwnProperty.call(object, name)
const assert = (condition, message) => { if (!condition) throw new Error(`Token catalog: ${message}`) }

// Purpose metadata only; token values and alias relationships come from tokens.json.
const semanticColorPurposes = {
  '--accent': 'Subtle selection or interaction surface; pair with --accent-foreground.',
  '--accent-foreground': 'Text and icons on the --accent selection surface.',
  '--action-foreground': 'Legacy text and icon role for primary actions; use --primary-foreground in new code.',
  '--background': 'Main page canvas behind content and reading surfaces; pair with --foreground.',
  '--background-inverse': 'Contrasting branded section surface; pair with --foreground-inverse.',
  '--border': 'Quiet dividers and container boundaries that do not define an interactive control.',
  '--border-strong': 'Stronger boundaries for controls and structure that must remain distinguishable.',
  '--brand-accent': 'Restrained decorative brand highlight; pair with --brand-accent-foreground when carrying text.',
  '--brand-accent-foreground': 'Text and icons placed on the --brand-accent highlight.',
  '--card': 'Content and reading surface above the page canvas; pair with --card-foreground.',
  '--card-foreground': 'Primary text and icons on the --card reading surface.',
  '--danger-subtle': 'Subtle error or danger notice surface; pair with --danger-subtle-foreground and a readable label.',
  '--danger-subtle-foreground': 'Error or danger text and icons on --danger-subtle.',
  '--deep-teal': 'Legacy contrasting section surface; use --background-inverse in new code.',
  '--destructive': 'Destructive action background; pair with --destructive-foreground.',
  '--destructive-foreground': 'Text and icons on default and hovered destructive actions.',
  '--destructive-hover': 'Pointer-hover background for a destructive action.',
  '--disabled': 'Unavailable control background; pair with --disabled-foreground and disabled behavior.',
  '--disabled-foreground': 'Text and icons on unavailable controls using --disabled.',
  '--foreground': 'Primary text and icons on the main --background canvas.',
  '--foreground-inverse': 'Text and icons on the --background-inverse section surface.',
  '--info': 'Informational feedback surface; pair with --info-foreground and a readable label.',
  '--info-foreground': 'Informational text and icons on --info.',
  '--ink-teal': 'Legacy brand text role; use --text-brand in new code.',
  '--input': 'Input and select control boundary, inherited from --border-strong; this role is a border color.',
  '--muted': 'Quiet supporting surface for secondary content; pair with an appropriate foreground.',
  '--muted-foreground': 'Secondary text, supporting labels and descriptions on compatible reading surfaces.',
  '--popover': 'Floating menu and popover surface; pair with --popover-foreground.',
  '--popover-foreground': 'Primary text and icons inside the --popover surface.',
  '--primary': 'Principal action background in its default state; pair with --primary-foreground.',
  '--primary-active': 'Pressed background for the principal action.',
  '--primary-foreground': 'Text and icons on default, hovered and pressed primary actions.',
  '--primary-hover': 'Pointer-hover background for the principal action.',
  '--ring': 'Visible keyboard-focus indicator around interactive controls.',
  '--secondary': 'Secondary action background in its default state; pair with --secondary-foreground.',
  '--secondary-active': 'Pressed background for a secondary action.',
  '--secondary-foreground': 'Text and icons on default, hovered and pressed secondary actions.',
  '--secondary-hover': 'Pointer-hover background for a secondary action.',
  '--success': 'Success feedback surface; pair with --success-foreground and a readable label.',
  '--success-foreground': 'Success text and icons on --success.',
  '--text-brand': 'Branded emphasis in text and icons on compatible page and reading surfaces.',
  '--warning': 'Warning feedback surface; pair with --warning-foreground and a readable label.',
  '--warning-foreground': 'Warning text and icons on --warning.',
}

export const tokenCollections = [
  { name: 'Primitives', layer: 'primitive', modes: ['Default'] },
  { name: 'Semantic', layer: 'semantic', modes: ['Light', 'Dark'] },
]

export const tokenConversion = {
  remBasePx: 16,
  color: 'CSS hex sRGB becomes numeric RGBA, with each channel and alpha in [0, 1].',
  dimension: 'rem dimensions use a 16px reference root; px dimensions are unchanged.',
  leading: 'Unitless line heights remain ratios; a text-style writer can multiply by 100 for percent line height.',
  tracking: 'em letter spacing remains em, independent of rem dimensions; a text-style writer can multiply by 100 for percent tracking.',
  duration: 'Duration numbers remain milliseconds; a prototype writer must convert to its required time unit.',
  family: 'A concrete CSS stack exports its first family; the complete stack remains in cssValues and mapping.cssFontStack.',
  alias: 'Alias keys are canonical CSS names, not Figma variable IDs. A writer must resolve them to applied variable IDs.',
}

export const tokenMappingLimitations = [
  'This is a local variable catalog, not a Figma API payload or an applied library. No destination or writer is configured.',
  'Only the source format in use is supported: hex sRGB colors, rem/px dimensions, scalar weights, unitless leading, em tracking, ms durations, CSS font stacks, shadows and easing. New formats must receive an explicit conversion.',
  'Font stacks and system-generic families do not map faithfully to one Figma font family. Concrete fonts must be available to the writer; generic families require an explicit installed-font choice.',
  'Typography attributes are separate scalars. Text styles still require composition, font availability checks and property-specific binding support. Leading ratios and em tracking are not pixel values.',
  'Shadow strings preserve CSS exactly but do not create or bind Figma effects. A writer must parse offsets, blur, spread, color and any inset/multiple-effect behavior into supported effect styles.',
  'Easing strings and duration numbers are reference data. They do not establish variable-bound prototype transitions; the writer must support the curve and convert milliseconds when required.',
  'Reduced-motion CSS overrides are behavioral rules outside the Light/Dark variable modes. A variable export alone does not apply those overrides.',
  'The 16px rem reference is an explicit conversion baseline. It cannot reproduce changes to the browser root font size without reconversion.',
]

function recordObject(value, label) {
  assert(value !== null && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`)
  return value
}

function rawValue(value, name) {
  assert(typeof value === 'string' && value.trim().length > 0, `${name} requires a nonempty CSS string`)
  return value.trim()
}

function primitiveKind(name) {
  if (name.startsWith('--primitive-color-')) return 'color'
  if (name.startsWith('--primitive-font-size-')) return 'dimension'
  if (name.startsWith('--primitive-font-weight-')) return 'font-weight'
  if (name.startsWith('--primitive-font-')) return 'font-family'
  if (name.startsWith('--primitive-leading-')) return 'line-height'
  if (name.startsWith('--primitive-tracking-')) return 'letter-spacing'
  if (/^--primitive-(space|radius|size|border)-/.test(name)) return 'dimension'
  if (name.startsWith('--primitive-duration-')) return 'duration'
  if (name.startsWith('--primitive-ease-')) return 'easing'
  if (name.startsWith('--primitive-shadow-')) return 'shadow'
  throw new Error(`Token catalog: unsupported primitive category ${name}`)
}

function semanticKind(name) {
  const typography = /^--type-.+-(font|size|weight|leading|tracking)$/.exec(name)
  if (typography) return { font: 'font-family', size: 'dimension', weight: 'font-weight', leading: 'line-height', tracking: 'letter-spacing' }[typography[1]]
  if (name.startsWith('--font-')) return 'font-family'
  if (name === '--letter-spacing') return 'letter-spacing'
  if (/^--(?:spacing$|space-|radius(?:-|$)|icon-|target-|control-height$|border-width$|focus-(?:width|offset)$)/.test(name)) return 'dimension'
  if (name.startsWith('--motion-')) return 'duration'
  if (name.startsWith('--ease-')) return 'easing'
  if (name.startsWith('--shadow-')) return 'shadow'
  return 'color'
}

function typedLiteral(css, kind, name) {
  const mapping = { kind, status: 'variable-ready', notes: '' }
  if (kind === 'color') {
    assert(/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(css), `${name} requires a supported hex sRGB color, received ${css}`)
    let hex = css.slice(1)
    if (hex.length <= 4) hex = [...hex].map(character => character.repeat(2)).join('')
    if (hex.length === 6) hex += 'ff'
    const [r, g, b, a] = [0, 2, 4, 6].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
    mapping.notes = 'Numeric sRGB RGBA; bind only to supported color properties.'
    return { type: 'COLOR', unit: null, exportUnit: null, value: { r, g, b, a }, mapping }
  }
  if (kind === 'dimension') {
    const match = /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))(rem|px)$/.exec(css)
    assert(match, `${name} requires a rem or px dimension, received ${css}`)
    const value = Number(match[1]) * (match[2] === 'rem' ? tokenConversion.remBasePx : 1)
    assert(Number.isFinite(value) && value >= 0, `${name} requires a finite nonnegative dimension`)
    mapping.notes = match[2] === 'rem' ? 'Converted to px using the documented 16px root baseline.' : 'Pixel scalar; bind only to compatible numeric dimensions.'
    return { type: 'FLOAT', unit: match[2], exportUnit: 'px', value, mapping }
  }
  if (kind === 'font-weight' || kind === 'line-height') {
    assert(numberPattern.test(css), `${name} requires a unitless number, received ${css}`)
    const value = Number(css)
    assert(Number.isFinite(value) && value > 0, `${name} requires a finite positive number`)
    if (kind === 'font-weight') assert(value <= 1000, `${name} exceeds the supported CSS font-weight range`)
    mapping.status = 'style-conversion'
    mapping.notes = kind === 'line-height'
      ? 'Stored as a ratio, not pixels. Compose a text style with percent line height = ratio × 100; check writer binding support.'
      : 'Numeric font weight; an available matching face/axis and supported text-property binding are still required.'
    return { type: 'FLOAT', unit: 'unitless', exportUnit: kind === 'line-height' ? 'ratio' : 'unitless', value, mapping }
  }
  if (kind === 'letter-spacing' || kind === 'duration') {
    const unit = kind === 'letter-spacing' ? 'em' : 'ms'
    const match = new RegExp(`^([+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+))${unit}$`).exec(css)
    assert(match, `${name} requires ${unit}, received ${css}`)
    const value = Number(match[1])
    assert(Number.isFinite(value) && (kind !== 'duration' || value >= 0), `${name} requires a valid finite ${unit} value`)
    mapping.status = kind === 'letter-spacing' ? 'style-conversion' : 'metadata-only'
    mapping.notes = kind === 'letter-spacing'
      ? 'Stored as em, not px. Compose percent letter spacing = em × 100; pixel conversion depends on the applied font size.'
      : 'Milliseconds retained as a scalar. Prototype duration/binding support and time-unit conversion require a writer.'
    return { type: 'FLOAT', unit, exportUnit: unit, value, mapping }
  }
  if (kind === 'font-family') {
    const family = /^(?:"([^"]+)"|'([^']+)'|([^,]+))\s*(?:,|$)/.exec(css)
    assert(family, `${name} has an unsupported CSS font stack`)
    const value = (family[1] || family[2] || family[3]).trim()
    const generic = /^(?:serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-serif|ui-sans-serif|ui-monospace|ui-rounded|emoji|math|fangsong)$/i.test(value)
    mapping.status = generic ? 'metadata-only' : 'style-conversion'
    mapping.cssFontStack = css
    mapping.genericFamily = generic
    mapping.notes = generic
      ? 'The first CSS family is system-generic. Preserve this reference string; choose an actual installed font before applying a Figma text style.'
      : 'Exports the first concrete family name. CSS fallbacks remain in cssFontStack; verify font availability before binding or composing a text style.'
    return { type: 'STRING', unit: null, exportUnit: null, value, mapping }
  }
  assert(kind === 'shadow' || kind === 'easing', `${name} has unsupported type ${kind}`)
  assert(!/[{}]/.test(css) && !/\bvar\(/.test(css), `${name} must be a literal composite`)
  mapping.status = 'metadata-only'
  mapping.notes = kind === 'shadow'
    ? 'Exact CSS reference string. A Figma effect style needs parsed offsets, blur, spread, color and inset/multiple-shadow handling; this STRING is not an effect binding.'
    : 'Exact CSS timing-function string. Applying a supported prototype easing curve requires a separate writer conversion; this STRING is not a transition binding.'
  return { type: 'STRING', unit: null, exportUnit: null, value: css, mapping }
}

function descriptionFor(name, layer, kind, sourceData) {
  const label = name.replace(/^--(?:primitive-)?/, '').replaceAll('-', ' ')
  if (layer === 'primitive') return `${label}: invariant ${kind} primitive shared by both themes.`
  const group = sourceData.groups?.find(group => group.tokens.includes(name))
  const usage = semanticColorPurposes[name] ?? (group ? `${group.label}: ${group.description}` : `Shared ${kind} role.`)
  const deprecated = sourceData.deprecatedAliases?.includes(name) ? ' Compatibility alias retained for existing consumers.' : ''
  return `${label}. ${usage}${deprecated}`
}

/** Pure conversion of the canonical CSS-token data; no browser, filesystem or Figma APIs. */
export function createTokenCatalog(sourceData = source) {
  recordObject(sourceData, 'source')
  const primitives = recordObject(sourceData.primitives, 'primitives')
  const shared = recordObject(sourceData.shared, 'shared')
  const sourceModes = recordObject(sourceData.modes, 'modes')
  assert(JSON.stringify(sorted(Object.keys(sourceModes))) === JSON.stringify(sorted(themes)), 'modes must contain exactly light and dark')
  const perTheme = Object.fromEntries(themes.map(theme => [theme, recordObject(sourceModes[theme], `modes.${theme}`)]))
  assert(JSON.stringify(sorted(Object.keys(perTheme.light))) === JSON.stringify(sorted(Object.keys(perTheme.dark))), 'Light/Dark semantic roles must have complete matching coverage')
  const primitiveNames = sorted(Object.keys(primitives))
  const semanticNames = sorted([...Object.keys(shared), ...Object.keys(perTheme.light)])
  assert(primitiveNames.length > 0 && semanticNames.length > 0, 'both token layers must contain records')
  const canonicalIds = new Set()
  for (const [layer, names] of [['primitive', primitiveNames], ['semantic', semanticNames]]) {
    for (const name of names) {
      assert(canonicalName.test(name), `invalid canonical name ${name}`)
      assert(!canonicalIds.has(name), `duplicate canonical token ${name}`)
      canonicalIds.add(name)
      assert(layer === 'primitive' ? name.startsWith('--primitive-') : !name.startsWith('--primitive-'), `${name} is in the wrong layer`)
    }
  }
  for (const theme of themes) {
    for (const name of Object.keys(shared)) assert(!own(perTheme[theme], name), `shared/mode duplicate ${name} in ${theme}`)
  }
  if (sourceData.groups !== undefined) {
    assert(Array.isArray(sourceData.groups), 'groups must be an array')
    const groupIds = new Set()
    for (const group of sourceData.groups) {
      assert(group && typeof group.id === 'string' && !groupIds.has(group.id), 'documentation groups require unique IDs')
      groupIds.add(group.id)
      assert(typeof group.label === 'string' && typeof group.description === 'string' && Array.isArray(group.tokens), `invalid documentation group ${group.id}`)
      for (const name of group.tokens) assert(canonicalIds.has(name), `unknown documentation token ${name}`)
    }
  }
  if (sourceData.deprecatedAliases !== undefined) {
    assert(Array.isArray(sourceData.deprecatedAliases), 'deprecatedAliases must be an array')
    for (const name of sourceData.deprecatedAliases) assert(semanticNames.includes(name), `unknown deprecated alias ${name}`)
  }
  if (sourceData.typography !== undefined) {
    assert(Array.isArray(sourceData.typography), 'typography must be an array')
    for (const role of sourceData.typography) {
      for (const attribute of ['font', 'size', 'weight', 'leading', 'tracking']) assert(canonicalIds.has(`--type-${role}-${attribute}`), `incomplete typography role ${role}: missing ${attribute}`)
    }
  }
  const primitiveValues = new Map(primitiveNames.map(name => {
    const css = rawValue(primitives[name], name)
    assert(!/[{}]/.test(css) && !/\bvar\(/.test(css), `primitive ${name} must be literal; aliases cannot point to a higher layer`)
    return [name, { css, ...typedLiteral(css, primitiveKind(name), name) }]
  }))
  const resolved = {}
  const semanticSources = {}
  for (const theme of themes) {
    const tokens = { ...shared, ...perTheme[theme] }
    semanticSources[theme] = tokens
    const cache = new Map(primitiveValues)
    function resolve(name, path = []) {
      if (cache.has(name)) return cache.get(name)
      assert(!path.includes(name), `cyclic alias in ${theme}: ${[...path, name].join(' → ')}`)
      assert(own(tokens, name), `unresolved alias ${name} in ${theme}`)
      const match = aliasPattern.exec(rawValue(tokens[name], name))
      assert(match, `semantic ${name} must contain a canonical alias in ${theme}`)
      const target = resolve(match[1], [...path, name])
      assert(semanticKind(name) === target.mapping.kind, `type/unit mismatch: ${name} (${semanticKind(name)}) aliases ${match[1]} (${target.mapping.kind}) in ${theme}`)
      cache.set(name, target)
      return target
    }
    semanticNames.forEach(name => resolve(name))
    resolved[theme] = cache
  }
  const mappedNames = new Set()
  const records = [...primitiveNames, ...semanticNames].map(name => {
    const layer = primitiveValues.has(name) ? 'primitive' : 'semantic'
    const collection = layer === 'primitive' ? 'Primitives' : 'Semantic'
    const tokenPath = name.replace(layer === 'primitive' ? /^--primitive-/ : /^--/, '').replaceAll('-', '/')
    const figmaName = layer === 'semantic' && semanticKind(name) === 'color' ? `color/${tokenPath}` : tokenPath
    const mappedKey = `${collection}/${figmaName}`.normalize('NFKC').toLowerCase()
    assert(!mappedNames.has(mappedKey), `duplicate mapped Figma name ${mappedKey}`)
    mappedNames.add(mappedKey)
    const light = resolved.light.get(name)
    const dark = resolved.dark.get(name)
    for (const attribute of ['type', 'unit', 'exportUnit']) assert(light[attribute] === dark[attribute], `${name} changes ${attribute} between themes`)
    assert(light.mapping.kind === dark.mapping.kind, `${name} changes kind between themes`)
    const aliases = Object.fromEntries(themes.map(theme => [theme, layer === 'primitive' ? null : aliasPattern.exec(semanticSources[theme][name].trim())[1]]))
    const modeValues = layer === 'primitive'
      ? { Default: { kind: 'literal', value: light.value } }
      : Object.fromEntries(themes.map(theme => [theme === 'light' ? 'Light' : 'Dark', { kind: 'alias', key: aliases[theme] }]))
    return {
      id: name, name, layer, collection, figmaName,
      type: light.type, unit: light.unit, exportUnit: light.exportUnit,
      description: descriptionFor(name, layer, light.mapping.kind, sourceData),
      cssValues: { light: light.css, dark: dark.css }, aliases, modeValues,
      resolvedValues: { light: light.value, dark: dark.value },
      mapping: light.mapping,
    }
  })
  return {
    sourceVersion: String(sourceData.version ?? 'unversioned'),
    collections: tokenCollections,
    conversion: tokenConversion,
    limitations: tokenMappingLimitations,
    records,
  }
}

export function createTokenExport(sourceData = source) {
  const catalog = createTokenCatalog(sourceData)
  return {
    schemaVersion: '1.0.0',
    source: 'landing-page/src/design-system/tokens.json',
    generatedBy: 'landing-page/scripts/export-design-tokens.mjs',
    authority: 'code',
    figma: {
      status: 'not-configured', fileKey: null, applied: false, direction: 'code → Figma',
      identifiers: 'Record IDs and alias keys are stable local canonical names. Resolve to actual Figma variable IDs before applying.',
      modeSelection: 'Primitives uses Default in both product themes. Select Semantic Light or Dark explicitly on the target; names alone do not apply modes.',
    },
    ...catalog,
  }
}

export const tokenCatalog = createTokenCatalog()
export const tokenRecords = tokenCatalog.records
