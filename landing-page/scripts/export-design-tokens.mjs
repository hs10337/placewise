import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createTokenExport } from '../src/design-system/token-catalog.mjs'

const args = process.argv.slice(2)
if (args.some(argument => argument !== '--check')) {
  console.error('Usage: node scripts/export-design-tokens.mjs [--check]')
  process.exitCode = 1
} else {
  const destination = new URL('../../docs/design-system.tokens.json', import.meta.url)
  const exported = createTokenExport()
  const output = `${JSON.stringify(exported, null, 2)}\n`
  if (args.includes('--check')) {
    let existing
    try { existing = readFileSync(destination, 'utf8') }
    catch (error) { if (error.code !== 'ENOENT') throw error }
    if (existing !== output) {
      console.error('Design token export is missing or stale. Run node scripts/export-design-tokens.mjs from landing-page.')
      process.exitCode = 1
    } else {
      console.log(`Verified ${exported.records.length} typed tokens, alias resolution, full modes and current export.`)
    }
  } else {
    writeFileSync(destination, output)
    console.log(`Exported ${exported.records.length} tokens to ${fileURLToPath(destination)}`)
  }
}
