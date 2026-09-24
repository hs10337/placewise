import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = JSON.parse(readFileSync(resolve(project, 'src/design-system/tokens.json'), 'utf8'))
const alias = /^\{(--[\w-]+)\}$/
const primitive = source.primitives
const modes = ['light', 'dark']
const keys = object => Object.keys(object).sort()
assert.deepEqual(keys(source.modes.light), keys(source.modes.dark), 'Modes must expose identical roles')
for (const [name, value] of Object.entries(primitive)) {
  assert(name.startsWith('--primitive-') && typeof value === 'string' && !/[{}]/.test(value), `Invalid primitive ${name}`)
}
for (const mode of modes) {
  assert(!keys(source.shared).some(name => name in source.modes[mode]), 'Shared and mode roles must not collide')
  const tokens = { ...primitive, ...source.shared, ...source.modes[mode] }
  for (const name of [...keys(source.shared), ...keys(source.modes[mode])]) {
    assert(alias.test(tokens[name]), `Semantic token ${name} must alias a token`)
    resolveToken(name, tokens)
  }
  for (const group of source.groups) for (const name of group.tokens) assert(name in tokens, `Unknown documentation token ${name}`)
  for (const role of source.typography) for (const suffix of ['font', 'size', 'weight', 'leading', 'tracking']) assert(`--type-${role}-${suffix}` in tokens)
}

function resolveToken(name, tokens, seen = new Set()) {
  assert(name in tokens, `Missing token ${name}`)
  assert(!seen.has(name), `Cyclic alias at ${name}`)
  seen.add(name)
  const value = tokens[name]
  const reference = alias.exec(value)
  return reference ? resolveToken(reference[1], tokens, seen) : value
}

function luminance(hex) {
  assert(/^#[0-9a-f]{6}$/i.test(hex), `Expected opaque sRGB value, received ${hex}`)
  const rgb = [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
}

const pairs = [
  ['foreground', 'background'], ['card-foreground', 'card'], ['popover-foreground', 'popover'],
  ['muted-foreground', 'card'], ['muted-foreground', 'background'], ['muted-foreground', 'muted'],
  ['text-brand', 'background'], ['text-brand', 'card'],
  ['primary-foreground', 'primary'], ['primary-foreground', 'primary-hover'], ['primary-foreground', 'primary-active'],
  ['secondary-foreground', 'secondary'], ['secondary-foreground', 'secondary-hover'], ['secondary-foreground', 'secondary-active'],
  ['accent-foreground', 'accent'], ['brand-accent-foreground', 'brand-accent'], ['disabled-foreground', 'disabled'],
  ['destructive-foreground', 'destructive'], ['destructive-foreground', 'destructive-hover'],
  ['danger-subtle-foreground', 'danger-subtle'], ['success-foreground', 'success'], ['warning-foreground', 'warning'],
  ['info-foreground', 'info'], ['foreground-inverse', 'background-inverse'],
  ['ring', 'card', 3], ['ring', 'background', 3], ['input', 'card', 3], ['input', 'background', 3],
]
for (const mode of modes) {
  const tokens = { ...primitive, ...source.shared, ...source.modes[mode] }
  let minimumText = Infinity
  for (const [fg, bg, minimum = 4.5] of pairs) {
    const values = [fg, bg].map(name => luminance(resolveToken(`--${name}`, tokens))).sort((a, b) => a - b)
    const ratio = (values[1] + 0.05) / (values[0] + 0.05)
    assert(ratio >= minimum, `${mode}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1; needs ${minimum}:1`)
    if (minimum === 4.5) minimumText = Math.min(minimumText, ratio)
  }
  console.log(`${mode}: ${pairs.length} contrast pairs pass; minimum text ${minimumText.toFixed(2)}:1`)
}

function declarations(values) {
  return Object.entries(values).map(([name, value]) => `  ${name}: ${value.replace(alias, 'var($1)')};`).join('\n')
}
function modeBlock(mode) {
  return `  color-scheme: ${mode};\n${declarations({ ...source.shared, ...source.modes[mode] })}`
}
const css = `/* Generated from design-system/tokens.json. Do not edit. */\n:root {\n${declarations(primitive)}\n}\n\n:root, [data-theme="light"] {\n${modeBlock('light')}\n}\n\n[data-theme="dark"], :root.dark {\n${modeBlock('dark')}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme]):not(.light) {\n${modeBlock('dark')}\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  :root, [data-theme] {\n    --motion-fast: var(--primitive-duration-none);\n    --motion-normal: var(--primitive-duration-none);\n    --motion-slow: var(--primitive-duration-none);\n  }\n}\n`
const destination = resolve(project, 'src/tokens.css')
if (process.argv.includes('--check')) {
  assert.equal(readFileSync(destination, 'utf8'), css, 'Generated CSS is stale. Run npm run design-system:generate.')
  console.log('Token references, mode parity, documentation metadata, contrast and generated CSS verified.')
} else {
  writeFileSync(destination, css)
  console.log('Generated src/tokens.css')
}
execFileSync(process.execPath, ['scripts/export-design-tokens.mjs', ...(process.argv.includes('--check') ? ['--check'] : [])], { cwd: project, stdio: 'inherit' })
