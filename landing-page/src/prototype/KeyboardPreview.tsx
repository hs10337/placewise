import { useState } from 'react'
import { IosButton } from '../components/ui/ios-button'

/** Desktop simulation of the inspected iOS 18 keyboard, never an OS keyboard. */
export function KeyboardPreview({ onType }: { onType: (key: string) => void }) {
  const [shift, setShift] = useState(false)
  const [layout, setLayout] = useState<'letters' | 'numbers' | 'emoji'>('letters')
  const rows = layout === 'emoji' ? ['😀😊😂😍😎🤔😮', '👍👎👏🙌👋🙏💪', '🏠🌳🌸🍕☕🎉✨'] : layout === 'numbers' ? ['1234567890', '-/:;()$&@"', ".,?!'"] : ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
  return <div className="foundation-keyboard" data-layout={layout} role="group" aria-label="iOS 18 keyboard preview" onPointerDown={event => event.preventDefault()}>
    {rows.map((row, index) => <div className="foundation-key-row" key={index}>
      {index === 2 && layout !== 'emoji' && <IosButton variant="secondary" className="foundation-key-modifier" aria-label={layout === 'letters' ? 'Shift' : 'Letters'} aria-pressed={shift && layout === 'letters'} onClick={() => layout === 'numbers' ? setLayout('letters') : setShift(value => !value)}>{layout === 'numbers' ? 'ABC' : <span className="foundation-key-symbol foundation-key-shift" aria-hidden="true" />}</IosButton>}
      {[...row].map(key => { const value = layout === 'letters' && shift ? key.toUpperCase() : key; return <IosButton key={key} variant="secondary" onClick={() => { onType(value); if (layout === 'letters') setShift(false) }}>{value}</IosButton> })}
      {index === 2 && <IosButton variant="secondary" className="foundation-key-modifier" aria-label="Delete" onClick={() => onType('Backspace')}><span className="foundation-key-symbol foundation-key-delete" aria-hidden="true" /></IosButton>}
    </div>)}
    <div className="foundation-key-row foundation-key-bottom">
      <IosButton variant="secondary" className="foundation-key-modifier" onClick={() => setLayout(layout === 'letters' ? 'numbers' : 'letters')}>{layout === 'letters' ? '123' : 'ABC'}</IosButton>
      <IosButton variant="secondary" className="foundation-key-space" onClick={() => onType(' ')}>space</IosButton>
      <IosButton variant="secondary" className="foundation-key-modifier" onClick={() => onType('\n')}>return</IosButton>
    </div>
    <div className="foundation-key-accessories">
      <IosButton variant="ghost" aria-label={layout === 'emoji' ? 'Show letter keyboard' : 'Show emoji keyboard'} onClick={() => setLayout(layout === 'emoji' ? 'letters' : 'emoji')}><span className="foundation-key-symbol foundation-key-emoji" aria-hidden="true" /></IosButton>
      <IosButton variant="ghost" disabled aria-label="Dictation unavailable in this preview"><span className="foundation-key-symbol foundation-key-microphone" aria-hidden="true" /></IosButton>
    </div>
  </div>
}
