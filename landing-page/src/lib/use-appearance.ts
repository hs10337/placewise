import { useEffect, useLayoutEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'
const storageKey = 'placewise.studio.theme'
const valid = (value: string | null): value is ThemePreference => value === 'light' || value === 'dark' || value === 'system'
const readPreference = (): ThemePreference => {
  try { const value = localStorage.getItem(storageKey); return valid(value) ? value : 'system' } catch { return 'system' }
}

/** Shared by the workspace and its embedded project views. */
export function useAppearance() {
  const [preference, setPreference] = useState<ThemePreference>(readPreference)
  const [systemDark, setSystemDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches)
  const mode = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemDark(media.matches)
    const sync = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) setPreference(readPreference()) }
    media.addEventListener('change', update)
    window.addEventListener('storage', sync)
    return () => { media.removeEventListener('change', update); window.removeEventListener('storage', sync) }
  }, [])
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = mode
    document.documentElement.style.colorScheme = mode
    const canvas = getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
    if (canvas) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', canvas)
    try { if (localStorage.getItem(storageKey) !== preference) localStorage.setItem(storageKey, preference) } catch { /* Session-only theme. */ }
  }, [mode, preference])
  return { preference, setPreference, mode }
}
