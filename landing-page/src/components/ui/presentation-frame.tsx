import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Download } from 'lucide-react'
import { Button } from './button'
import { brandChapters, productChapters, goToPresentationChapter } from '../../lib/presentation-chapters'

export function PresentationFrame({ view, title, sourceText, fileName, active, onChapterChange, children }: {
  view: 'product' | 'brand'; title: string; sourceText: string; fileName: string
  active: number; onChapterChange: (chapter: number) => void
  children: (downloadUrl: string | undefined) => ReactNode
}) {
  const page = useRef<HTMLElement>(null)
  const [downloadUrl, setDownloadUrl] = useState<string>()
  const chapters = view === 'brand' ? brandChapters : productChapters
  const currentChapter = Math.max(0, Math.min(active, chapters.length - 1))
  useEffect(() => {
    const url = URL.createObjectURL(new Blob([sourceText], { type: 'text/markdown;charset=utf-8' }))
    setDownloadUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [sourceText])
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        let current = 0
        page.current?.querySelectorAll<HTMLElement>('[data-chapter]').forEach((section, index) => {
          if (section.getBoundingClientRect().top <= Math.min(window.innerHeight * .4, 320)) current = index
        })
        onChapterChange(current)
      })
    }
    const target = document.getElementById(location.hash.slice(1))
    if (target?.hasAttribute('data-chapter')) target.scrollIntoView({ behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [onChapterChange, view])
  return <article className={`product-story ${view === 'brand' ? 'brand-story' : ''}`} ref={page} aria-label={`Placewise ${view} presentation`}>
    <header className="product-masthead">
      <a className="product-wordmark" href={`#${view}-${chapters[0][0]}`} aria-label="Placewise, back to the beginning">Placewise<span aria-hidden="true">.</span></a>
      <span className="product-masthead-label">{title}</span><span className="product-draft">Working draft</span>
      <Button asChild variant="ghost" size="sm"><a href={downloadUrl} download={fileName}><Download size={16} aria-hidden="true" /><span>Full {view === 'brand' ? 'guidelines' : 'brief'}</span></a></Button>
    </header>
    {children(downloadUrl)}
    <footer className="product-presentation-controls" aria-label="Presentation controls">
      <div className="product-progress" aria-hidden="true"><span style={{ width: `${(currentChapter + 1) / chapters.length * 100}%` }} /></div>
      <span className="product-page-count">{String(currentChapter + 1).padStart(2, '0')} <span>/ {String(chapters.length).padStart(2, '0')}</span></span>
      <span className="product-current-chapter">{chapters[currentChapter][1]}</span>
      <Button variant="ghost" size="icon" disabled={currentChapter === 0} aria-label="Previous chapter" onClick={() => goToPresentationChapter(view, currentChapter - 1)}><ArrowLeft size={18} aria-hidden="true" /></Button>
      <Button variant="ghost" size="icon" disabled={currentChapter === chapters.length - 1} aria-label="Next chapter" onClick={() => goToPresentationChapter(view, currentChapter + 1)}><ArrowRight size={18} aria-hidden="true" /></Button>
    </footer>
  </article>
}
