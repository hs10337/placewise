import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const root = resolve(project, '..')
const studio = 'outputs/placewise-studio'
const manifestPath = resolve(root, studio, 'design-system.manifest.json')
function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name)
    return entry.isDirectory() ? filesUnder(path) : [path]
  }).sort()
}
const sourceFiles = filesUnder(resolve(project, 'src'))
const contractFiles = ['docs/brand_guidelines.md', 'docs/DESIGN_SYSTEM.md', 'docs/product.md', 'docs/ios-component-audit.md']
const inputs = [...sourceFiles.map(path => relative(root, path)), ...contractFiles,
  'landing-page/package.json', 'landing-page/package-lock.json', 'landing-page/tsconfig.json',
  'landing-page/vite.studio.config.ts', 'landing-page/design-preview.html',
  ...filesUnder(resolve(project, 'scripts')).map(path => relative(root, path)),
].sort()
const snapshots = [...sourceFiles.map(path => [path, `source/${relative(project, path)}`]), ...contractFiles.map(path => [resolve(root, path), `source/${path}`])]
function digest(path) { return createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex') }
function sourceHashes() { return Object.fromEntries(inputs.map(path => [path, digest(path)])) }
const artifacts = [`${studio}/index.html`, 'docs/design-system.html', 'docs/design-system.tokens.json', `${studio}/design-system.tokens.json`, ...[studio, 'docs'].flatMap(destination => snapshots.map(([, path]) => `${destination}/${path}`))].sort()
if (process.argv.includes('--check')) {
  let manifest
  try { manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) }
  catch { throw new Error('Documentation manifest is missing. Run npm run design-system:docs.') }
  assert.deepEqual(manifest.sources, sourceHashes(), 'Documentation sources changed. Run npm run design-system:docs.')
  assert.deepEqual(Object.keys(manifest.artifacts).sort(), artifacts, 'Documentation artifact coverage changed. Rebuild the documentation.')
  for (const path of artifacts) assert.equal(manifest.artifacts[path], digest(path), `Stale or changed documentation output: ${path}`)
  console.log('Verified visual documentation freshness, source snapshots and token download.')
} else {
  for (const destination of [studio, 'docs']) for (const [source, path] of snapshots) {
    const output = resolve(root, destination, path)
    mkdirSync(dirname(output), { recursive: true })
    copyFileSync(source, output)
  }
  copyFileSync(resolve(root, 'docs/design-system.tokens.json'), resolve(root, studio, 'design-system.tokens.json'))
  writeFileSync(manifestPath, `${JSON.stringify({ schemaVersion: 1, sources: sourceHashes(), artifacts: Object.fromEntries(artifacts.map(path => [path, digest(path)])) }, null, 2)}\n`)
  console.log('Updated documentation source links, token download and freshness manifest.')
}
