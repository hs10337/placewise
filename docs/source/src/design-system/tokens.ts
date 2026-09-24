import source from './tokens.json'

export type ThemeMode = 'light' | 'dark'
export const primitiveTokens: Record<string, string> = source.primitives
export const semanticTokens: Record<ThemeMode, Record<string, string>> = {
  light: { ...source.shared, ...source.modes.light },
  dark: { ...source.shared, ...source.modes.dark },
}
export const tokenGroups = source.groups
export const typographyRoles = source.typography.map(name => ({
  name, font: `--type-${name}-font`, size: `--type-${name}-size`,
  weight: `--type-${name}-weight`, lineHeight: `--type-${name}-leading`,
  tracking: `--type-${name}-tracking`,
}))

export function resolveToken(name: string, mode: ThemeMode): string {
  const tokens = { ...primitiveTokens, ...semanticTokens[mode] }
  const visited = new Set<string>()
  function resolve(key: string): string {
    if (!(key in tokens)) throw new Error(`Unknown token: ${key}`)
    if (visited.has(key)) throw new Error(`Cyclic token: ${key}`)
    visited.add(key)
    const value = tokens[key]
    const alias = /^\{(--[\w-]+)\}$/.exec(value)
    return alias ? resolve(alias[1]) : value
  }
  return resolve(name)
}
