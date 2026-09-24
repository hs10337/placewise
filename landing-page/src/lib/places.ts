export type PlaceId = 'coit' | 'hill' | 'steps'
export type Interest = 'A little of everything' | 'Art & architecture' | 'Local history' | 'Hidden greenery'
export type Exchange = { question: string; answer: string; source: string; sourceLabel: string }

export const PHOTO = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Coit_Tower_From_Above_%28Unsplash%29.jpg/960px-Coit_Tower_From_Above_%28Unsplash%29.jpg'
export const PHOTO_SOURCE = 'https://commons.wikimedia.org/wiki/File:Coit_Tower_From_Above_(Unsplash).jpg'
const PARKS_SOURCE = 'https://sfrecpark.org/Facilities/Facility/Details/Coit-Tower-290'
const HILL_SOURCE = 'https://sfrecpark.org/facilities/facility/details/Pioneer-Park-381'
export const interests: Interest[] = ['A little of everything', 'Art & architecture', 'Local history', 'Hidden greenery']
export const placeIds: PlaceId[] = ['coit', 'hill', 'steps']

export const places: Record<PlaceId, {
  name: string; category: string; coordinates: string; reason: string; questions: Exchange[]
}> = {
  coit: {
    name: 'Coit Tower', category: 'Art & architecture', coordinates: '37.8024° N, 122.4058° W',
    reason: 'A city landmark with Depression-era murals inside.',
    questions: [
      { question: 'Why was this tower built?', answer: 'Lillie Hitchcock Coit left money to make San Francisco more beautiful. Her bequest funded the tower, completed in 1933.', source: PARKS_SOURCE, sourceLabel: 'SF Recreation & Parks' },
      { question: 'What’s inside?', answer: 'Murals painted in 1934 show California life during the Depression. The artists worked through the Public Works of Art Project.', source: PARKS_SOURCE, sourceLabel: 'SF Recreation & Parks' },
      { question: 'How can I get up the hill?', answer: 'The Filbert Steps climb the eastern slope through Grace Marchant Garden toward Coit Tower. Check local conditions before visiting; this example does not verify accessibility or current access.', source: PARKS_SOURCE, sourceLabel: 'SF Recreation & Parks' },
    ],
  },
  hill: {
    name: 'Telegraph Hill', category: 'Local history', coordinates: '37.8024° N, 122.4059° W',
    reason: 'A hill named for the signals that welcomed arriving ships.',
    questions: [
      { question: 'Why is it called Telegraph Hill?', answer: 'A semaphore telegraph stood on the summit from 1850, signaling the arrival of ships to the city below.', source: HILL_SOURCE, sourceLabel: 'SF Recreation & Parks' },
      { question: 'What’s there now?', answer: 'Pioneer Park surrounds Coit Tower. The park was established in 1876 on the former telegraph station site.', source: HILL_SOURCE, sourceLabel: 'SF Recreation & Parks' },
      { question: 'What can I learn about the tower?', answer: 'Coit Tower was completed in 1933 with funds from Lillie Hitchcock Coit’s bequest. Its murals offer a glimpse of California life during the Depression.', source: PARKS_SOURCE, sourceLabel: 'SF Recreation & Parks' },
    ],
  },
  steps: {
    name: 'Filbert Steps', category: 'Hidden greenery', coordinates: '37.8021° N, 122.4038° W',
    reason: 'A stairway through the gardens on the hill’s eastern slope.',
    questions: [
      { question: 'Where do these steps lead?', answer: 'The Filbert Steps climb Telegraph Hill’s eastern slope through Grace Marchant Garden toward Coit Tower.', source: PARKS_SOURCE, sourceLabel: 'SF Recreation & Parks' },
      { question: 'What’s at the top?', answer: 'Coit Tower stands at the summit of Telegraph Hill, surrounded by Pioneer Park. The tower was completed in 1933.', source: PARKS_SOURCE, sourceLabel: 'SF Recreation & Parks' },
      { question: 'Is this a step-free path?', answer: 'This is a stairway. These sources do not establish a step-free alternative or current access conditions. Check with SF Recreation & Parks before planning your visit.', source: PARKS_SOURCE, sourceLabel: 'SF Recreation & Parks' },
    ],
  },
}

export function suggestionsFor(interest: Interest): PlaceId[] {
  if (interest === 'Art & architecture') return ['coit', 'hill']
  if (interest === 'Local history') return ['hill', 'coit']
  if (interest === 'Hidden greenery') return ['steps', 'hill']
  return [...placeIds]
}
