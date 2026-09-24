export type ThemeMode = 'light' | 'dark'
export type TokenLayer = 'primitive' | 'semantic'
export type TokenType = 'COLOR' | 'FLOAT' | 'STRING'
export type TokenLiteral = { r: number; g: number; b: number; a: number } | number | string
export type TokenModeValue = { kind: 'literal'; value: TokenLiteral } | { kind: 'alias'; key: string }
export type TokenKind = 'color' | 'dimension' | 'font-family' | 'font-weight' | 'line-height' | 'letter-spacing' | 'duration' | 'easing' | 'shadow'
export interface TokenMapping {
  kind: TokenKind
  status: 'variable-ready' | 'style-conversion' | 'metadata-only'
  notes: string
  cssFontStack?: string
  genericFamily?: boolean
}
export interface TokenRecord {
  id: string
  name: string
  layer: TokenLayer
  collection: 'Primitives' | 'Semantic'
  figmaName: string
  type: TokenType
  unit: 'rem' | 'px' | 'unitless' | 'em' | 'ms' | null
  exportUnit: 'px' | 'unitless' | 'ratio' | 'em' | 'ms' | null
  description: string
  cssValues: Record<ThemeMode, string>
  aliases: Record<ThemeMode, string | null>
  modeValues: Partial<Record<'Default' | 'Light' | 'Dark', TokenModeValue>>
  resolvedValues: Record<ThemeMode, TokenLiteral>
  mapping: TokenMapping
}
export interface TokenSource {
  version?: string
  primitives: Record<string, string>
  shared: Record<string, string>
  modes: Record<ThemeMode, Record<string, string>>
  groups?: { id: string; label: string; description: string; tokens: string[] }[]
  deprecatedAliases?: string[]
  typography?: string[]
}
export interface TokenCollection {
  name: 'Primitives' | 'Semantic'
  layer: TokenLayer
  modes: ('Default' | 'Light' | 'Dark')[]
}
export interface TokenCatalog {
  sourceVersion: string
  collections: TokenCollection[]
  conversion: { remBasePx: number; color: string; dimension: string; leading: string; tracking: string; duration: string; family: string; alias: string }
  limitations: string[]
  records: TokenRecord[]
}
export interface TokenExport extends TokenCatalog {
  schemaVersion: string
  source: string
  generatedBy: string
  authority: 'code'
  figma: { status: 'not-configured'; fileKey: null; applied: false; direction: string; identifiers: string; modeSelection: string }
}
export const tokenCollections: TokenCollection[]
export const tokenConversion: TokenCatalog['conversion']
export const tokenMappingLimitations: string[]
export function createTokenCatalog(sourceData?: TokenSource): TokenCatalog
export function createTokenExport(sourceData?: TokenSource): TokenExport
export const tokenCatalog: TokenCatalog
export const tokenRecords: TokenRecord[]
