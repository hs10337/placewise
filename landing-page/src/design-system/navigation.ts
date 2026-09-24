export const pageInfo: Record<string, { title: string; group: string; description: string }> = {
  figma: { title: 'Figma library', group: 'Design system', description: 'Code defines the system. Figma is a downstream representation of those same decisions.' },
  foundations: { title: 'Foundations', group: 'Design system', description: 'Curious and thoughtful, with a little wit. These are the rules that turn that character into a useful interface.' },
  icons: { title: 'Icons', group: 'Design system', description: 'A small, consistent vocabulary. Use icons to make an action or a place easier to understand.' },
  colors: { title: 'Colors', group: 'Primitives', description: 'White surfaces by day, Slate by night. The full palette supports both themes, with Oxblood, Glacier and Peach for character.' },
  sizes: { title: 'Sizes', group: 'Primitives', description: 'An 8px rhythm, comfortable targets and restrained shape. Use shared roles for recurring visual decisions.' },
  typography: { title: 'Typography', group: 'Primitives', description: 'Bricolage Grotesque gives short headlines character. Instrument Sans gives questions, answers and controls clarity.' },
  'ui-patterns': { title: 'UI patterns', group: 'Patterns', description: 'Reusable arrangements for forms, feedback and navigation, composed from the controls already in the product.' },
  'scenario-patterns': { title: 'Scenario patterns', group: 'Patterns', description: 'Keep the place and the person’s question connected from the first selection through the next step.' },
  button: { title: 'Button', group: 'Components', description: 'Give each view one clear next action. Make secondary and optional actions quieter.' },
  toggle: { title: 'Toggle', group: 'Components', description: 'Use a pressed action for selection and a switch for a persistent on/off setting.' },
  radio: { title: 'Radio', group: 'Components', description: 'Let people choose one option from a small, visible set.' },
  'text-input': { title: 'TextInput', group: 'Components', description: 'Keep labels visible, help close by and recovery specific.' },
  select: { title: 'Select', group: 'Components', description: 'Offer a compact choice when the options are familiar and the selected value matters.' },
  accordion: { title: 'Accordion', group: 'Components', description: 'Keep the first answer focused. Make further detail available when it is useful.' },
}
export const navGroups = [
  { label: '', pages: ['figma', 'foundations', 'icons'] },
  { label: 'Primitives', pages: ['colors', 'sizes', 'typography'] },
  { label: '', pages: ['ui-patterns'] },
  { label: '', pages: ['scenario-patterns'] },
  { label: 'Components', pages: ['button', 'toggle', 'radio', 'text-input', 'select', 'accordion'] },
]
const legacyPages: Record<string, string> = { primitives: 'colors', semantics: 'colors', components: 'button' }
export function readPage() {
  const key = location.hash.replace(/^#ds-/, '')
  return legacyPages[key] || (pageInfo[key] ? key : 'foundations')
}
