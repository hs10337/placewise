export const productChapters = [
  ['idea', 'The idea'], ['problem', 'The problem'], ['people', 'The people'], ['experience', 'The experience'],
  ['trust', 'The trust'], ['scope', 'The scope'], ['foundation', 'The foundation'], ['next', 'What’s next'],
] as const

export const brandChapters = [
  ['introduction', 'Introduction'], ['logo', 'Logo'], ['color', 'Color'], ['typography', 'Typography'],
  ['iconography', 'Iconography'], ['photography', 'Photography'], ['data-visualization', 'Data visualization'],
] as const

export function goToPresentationChapter(view: 'product' | 'brand', index: number) {
  const chapter = (view === 'brand' ? brandChapters : productChapters)[index]
  if (!chapter) return
  const target = document.getElementById(`${view}-${chapter[0]}`)
  if (!target) return
  history.replaceState(null, '', `#${view}-${chapter[0]}`)
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  target.focus({ preventScroll: true })
}
