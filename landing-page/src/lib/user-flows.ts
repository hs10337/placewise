export const userFlowGroups = [
  { label: 'Here', flows: [
    { id: 'nearby-place', title: 'Ask about a nearby place', description: 'Walking past a place, I want to ask about it with the right place attached to my question.' },
    { id: 'neighborhood', title: 'Ask about the neighborhood', description: 'In a neighborhood, I want to understand the area or something I notice around me.' },
    { id: 'take-photo', title: 'Ask with a new photo', description: 'I see something, take a photo and use it as context for a question.' },
    { id: 'identify-place', title: 'Identify what I’m looking at', description: 'I can see a building or landmark but do not know its name. Help me identify it before I ask more.' },
  ] },
  { label: 'Somewhere else', flows: [
    { id: 'past-photo', title: 'Ask about a past photo', description: 'I choose a photo from an earlier visit, establish where it was taken and ask about what it shows.' },
    { id: 'remote-place', title: 'Ask about somewhere else', description: 'I find a place through search, a map or a shared location and ask about it before visiting.' },
  ] },
  { label: 'Return', flows: [
    { id: 'previous-discovery', title: 'Revisit a discovery', description: 'I return to a saved place or earlier conversation and pick up where I left off.' },
  ] },
]

export function readMockupFlow() {
  const id = location.hash.replace(/^#flow-/, '')
  return userFlowGroups.flatMap(group => group.flows).find(flow => flow.id === id)
}
