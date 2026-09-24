import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..')
execFileSync(process.execPath, ['scripts/design-system.mjs'], { cwd: project, stdio: 'inherit' })
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '--noEmit'], { cwd: project, stdio: 'inherit' })
execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--config', 'vite.studio.config.ts'], { cwd: project, stdio: 'inherit' })

const output = resolve(project, '../outputs/placewise-studio')
const build = resolve(output, 'build')
let html = readFileSync(resolve(build, 'design-preview.html'), 'utf8')
html = html.replace(/<script type="module" crossorigin src="([^\"]+)"><\/script>/g, (_, asset) => {
  const script = readFileSync(resolve(build, asset), 'utf8').replace(/<\/script/gi, '<\\/script')
  return `<script type="module">${script}</script>`
})
html = html.replace(/<link rel="stylesheet" crossorigin href="([^\"]+)">/g, (_, asset) => `<style>${readFileSync(resolve(build, asset), 'utf8')}</style>`)
writeFileSync(resolve(output, 'index.html'), html)
writeFileSync(resolve(project, '../docs/design-system.html'), html.replace('<body>', '<body>\n<script>if (!location.hash) location.replace("#design-system");</script>'))
execFileSync(process.execPath, ['scripts/design-system-artifacts.mjs'], { cwd: project, stdio: 'inherit' })
console.log('Standalone HTML: outputs/placewise-studio/index.html')
console.log('Visual documentation: docs/design-system.html')
