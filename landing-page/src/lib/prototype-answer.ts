import { demoNeighborhood, type Question } from './mockup-state'

/** Shared, deterministic sample content for both local prototypes. */
export function prototypeAnswer(question: Question) {
    const place = question.attachment?.subject
    const more = /more|look|notice|detail|interesting|else|style|rat/i.test(question.text)
    const reply = question.attachment?.upload ? `${question.attachment.upload.name} is attached. This preview doesn’t read uploaded photos or files yet.`
      : place === 'graybar'
      ? more ? 'Look for the metal rats around the south entrance. They are part of the building’s maritime decoration, a reference to New York’s role as a port.' : 'Sloan & Robertson designed the Graybar Building, completed in 1927. Its decoration blends Art Deco and Byzantine influences.'
      : place === 'chrysler'
        ? more ? 'Look up at the crown and its spire. The Chrysler Building briefly held the title of the world’s tallest building, until 1931.' : 'William Van Alen designed the Chrysler Building. It opened in 1930 and became one of New York’s best-known Art Deco towers.'
        : place === 'station' ? 'Grand Central Terminal opened in 1913. Its architects were Reed & Stem and Warren & Wetmore.'
          : place === 'statue' ? 'The sculpture above the clock is by Jules-Félix Coutan. It depicts Mercury, Hercules and Minerva.'
            : question.attachment?.place ? `I’ve identified ${question.attachment.place.name}, but I don’t have verified details about it yet.`
            : question.attachment?.coordinates ? 'I have the location you selected. What is the building called, or can you add a photo so I can identify it?'
              : question.neighborhood === demoNeighborhood ? more ? 'For a closer look around Grand Central, compare the terminal’s south façade, the Graybar Building’s entrance and the Chrysler Building’s crown.' : 'Around Grand Central, you can explore Grand Central Terminal, the Graybar Building and the Chrysler Building. Are you interested in architecture, local history or somewhere to walk?'
              : question.neighborhood ? `Let’s explore ${question.neighborhood.replace(/^around\s+/i, '')}. Are you interested in architecture, local history or somewhere to walk?`
              : 'What would you like to explore about this place? Add a place or a photo to give me more context.'
    const source = place === 'graybar' ? 'https://www.nyc.gov/assets/lpc/downloads/pdf/announcements/The%20Graybar%20Building%20FINAL_160509.pdf'
      : place === 'chrysler' ? 'https://chryslerbuilding.com/history/' : place === 'station' ? 'https://www.planning.org/greatplaces/spaces/2013/grandcentral.htm' : place === 'statue' ? 'https://www.nyc.gov/assets/planning/download/pdf/applicants/env-review/vanderbilt/06_feis.pdf' : null
    return { reply, source }
}
