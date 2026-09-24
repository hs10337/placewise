import { useId } from 'react'
import './neighborhood-map.css'

type PlaceId = 'coit' | 'hill' | 'steps'

type NeighborhoodMapProps = {
  selected: PlaceId
  onSelect: (id: PlaceId) => void
  visiblePlaces: PlaceId[]
  compact?: boolean
}

const places: { id: PlaceId; label: string; x: number; y: number; number: string }[] = [
  { id: 'coit', label: 'Coit Tower', x: 50.2, y: 40.5, number: '01' },
  { id: 'hill', label: 'Telegraph Hill', x: 31.8, y: 61.5, number: '02' },
  { id: 'steps', label: 'Filbert Steps', x: 66.5, y: 57.3, number: '03' },
]

const cityBlocks = [
  'M-28 8H115V79H-28Z', 'M134 8H253V79H134Z', 'M273 8H396V79H273Z',
  'M416 8H535V79H416Z', 'M554 8H632L610 79H554Z',
  'M-28 98H115V174H-28Z', 'M134 98H253V174H134Z', 'M273 98H396V142L369 174H273Z',
  'M416 98H535V165L479 174H416Z', 'M554 98H606L590 174H554Z',
  'M-28 194H115V266H-28Z', 'M134 194H253V235L230 266H134Z',
  'M-28 286H115V358H-28Z', 'M134 286H226L233 358H134Z',
  'M-28 378H115V451H-28Z', 'M134 378H241L253 407V451H134Z',
  'M273 390L345 414L396 417V451H273Z', 'M416 412L535 395V451H416Z',
  'M554 372L615 338L679 394L699 451H554Z',
  'M-28 470H115V558H-28Z', 'M134 470H253V558H134Z', 'M273 470H396V558H273Z',
  'M416 470H535V558H416Z', 'M554 470H703L744 558H554Z',
]

const contours = [
  'M287 178C333 139 438 138 504 170C571 201 616 251 592 319C572 379 488 418 404 414C327 411 258 394 239 331C219 268 239 218 287 178Z',
  'M303 191C348 159 431 158 492 187C549 214 588 256 568 309C549 360 480 393 407 394C342 395 283 377 265 325C245 270 264 220 303 191Z',
  'M321 204C361 178 429 180 479 204C527 227 559 264 542 308C525 349 472 372 413 374C356 376 307 360 289 317C271 274 288 230 321 204Z',
  'M339 216C373 195 428 200 465 220C505 241 531 270 516 306C502 340 461 353 414 354C370 355 330 342 313 309C297 276 310 234 339 216Z',
  'M355 228C384 211 426 218 453 235C483 253 504 276 491 303C479 329 449 337 415 335C382 333 352 326 337 302C323 277 331 244 355 228Z',
]

export function NeighborhoodMap({ selected, onSelect, visiblePlaces, compact = false }: NeighborhoodMapProps) {
  const mapId = useId().replace(/:/g, '')

  return (
    <div className={`neighborhood-map${compact ? ' neighborhood-map--compact' : ''}`} role="group" aria-label="Illustrated map of Telegraph Hill, San Francisco">
      <div className="neighborhood-map__scene">
        <svg className="neighborhood-map__drawing" viewBox="0 0 800 560" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <pattern id={`${mapId}-water`} width="34" height="28" patternUnits="userSpaceOnUse">
              <path d="M2 15h9m10 0h5" stroke="var(--map-water-detail)" strokeWidth=".7" opacity=".3" />
            </pattern>
            <pattern id={`${mapId}-gardens`} width="17" height="17" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="6" r="1" fill="var(--map-park-detail)" opacity=".2" />
            </pattern>
          </defs>
          <path fill="var(--map-land)" d="M0 0h800v560H0z" />

          <g transform="rotate(-13 400 280)">
            <g fill="var(--map-block)" stroke="var(--map-block-border)" strokeWidth="1.2">
              {cityBlocks.map((d, index) => <path d={d} key={index} />)}
            </g>
            <g fill="none" stroke="var(--map-road)" strokeWidth="13">
              <path d="M-80 89H650M-80 184H612M-80 276H244M-80 368H247M-80 461H734" />
              <path d="M124 -70V640M263 -70V187M263 400V640M406 -70V146M406 416V640M544 -70V177M544 389V640" />
            </g>
            <g fill="var(--map-garden)" stroke="var(--map-park-border)" strokeWidth="1">
              <path d="M36 211h63v41H36zM26 307h37v35H26zM149 125h81v25h-81zM432 27h77v34h-77z" />
              <path d="M280 488h43v48h-43zM445 492h69v40h-69zM157 399h63v27h-63z" />
            </g>

            <path d="M287 178C333 139 438 138 504 170C571 201 616 251 592 319C572 379 488 418 404 414C327 411 258 394 239 331C219 268 239 218 287 178Z" fill="var(--map-park)" />
            <path d="M287 178C333 139 438 138 504 170C571 201 616 251 592 319C572 379 488 418 404 414C327 411 258 394 239 331C219 268 239 218 287 178Z" fill={`url(#${mapId}-gardens)`} />
            <g fill="none" stroke="var(--map-park-border)" strokeWidth="1.1" opacity=".72">
              {contours.map((d, index) => <path d={d} key={index} />)}
            </g>
            <path d="M243 376C279 377 307 368 323 339C339 310 308 275 333 246C359 214 407 217 432 238C451 254 454 282 434 297C417 310 392 307 381 292" fill="none" stroke="var(--map-park-border)" strokeWidth="11" />
            <path d="M243 376C279 377 307 368 323 339C339 310 308 275 333 246C359 214 407 217 432 238C451 254 454 282 434 297C417 310 392 307 381 292" fill="none" stroke="var(--map-road)" strokeWidth="7" />
            <path d="M430 296C474 304 514 312 546 327L613 327" fill="none" stroke="var(--map-road)" strokeWidth="5" />
            <path d="M442 294L546 326" fill="none" stroke="var(--map-park-detail)" strokeWidth="8" strokeDasharray="1 5" />

            <g className="neighborhood-map__street-label" fill="var(--map-label)" fontSize="11">
              <text x="191" y="92" textAnchor="middle">BAY STREET</text>
              <text x="183" y="187" textAnchor="middle">CHESTNUT ST</text>
              <text x="81" y="279" textAnchor="middle">LOMBARD ST</text>
              <text x="79" y="371" textAnchor="middle">FILBERT ST</text>
              <text x="313" y="464" textAnchor="middle">GREENWICH STREET</text>
              <text x="121" y="433" transform="rotate(-90 121 433)">STOCKTON ST</text>
              <text x="260" y="540" transform="rotate(-90 260 540)">GRANT AVE</text>
              <text x="541" y="543" transform="rotate(-90 541 543)">SANSOME ST</text>
            </g>
          </g>

          <path d="M654-30C620 55 616 128 635 192C656 264 716 293 745 357C769 410 783 466 840 499V-30Z" fill="var(--map-water)" />
          <path d="M654-30C620 55 616 128 635 192C656 264 716 293 745 357C769 410 783 466 840 499V-30Z" fill={`url(#${mapId}-water)`} />
          <path d="M654-30C620 55 616 128 635 192C656 264 716 293 745 357C769 410 783 466 840 499" fill="none" stroke="var(--map-water-edge)" strokeWidth="19" />
          <path d="M648-30C614 55 610 128 629 192C650 264 710 293 739 357C763 410 777 466 834 499" fill="none" stroke="var(--map-road)" strokeWidth="11" />
          <path d="M680 235L739 214L750 238L694 258Z" fill="var(--map-block)" stroke="var(--map-water-edge)" strokeWidth="1.5" />
          <path d="M713 282L780 262L789 286L728 303Z" fill="var(--map-block)" stroke="var(--map-water-edge)" strokeWidth="1.5" />
          <g fill="var(--map-water-label)" fontSize="15" letterSpacing=".4">
            <text x="710" y="116" textAnchor="middle">San Francisco</text>
            <text x="710" y="140" textAnchor="middle">Bay</text>
          </g>
          <text x="622" y="102" transform="rotate(83 622 102)" fill="var(--map-label)" fontSize="10" letterSpacing="1.5">THE EMBARCADERO</text>
          <text x="401" y="184" fill="var(--map-park-label)" textAnchor="middle" fontSize="11" letterSpacing="2.5">PIONEER PARK</text>
          <text x="347" y="433" fill="var(--map-label)" textAnchor="middle" fontSize="13" letterSpacing="2.6">TELEGRAPH HILL</text>
          <g fill="var(--map-tree)" opacity=".8">
            <circle cx="319" cy="196" r="4" /><circle cx="306" cy="205" r="3" /><circle cx="470" cy="177" r="3.5" />
            <circle cx="507" cy="206" r="4" /><circle cx="512" cy="222" r="3" /><circle cx="482" cy="344" r="4" />
            <circle cx="496" cy="349" r="3" /><circle cx="351" cy="365" r="3.5" /><circle cx="282" cy="306" r="4" />
          </g>
        </svg>

        {places.filter((place) => visiblePlaces.includes(place.id)).map((place) => (
          <button
            key={place.id}
            type="button"
            className={`neighborhood-map__marker neighborhood-map__marker--${place.id}${selected === place.id ? ' is-selected' : ''}`}
            style={{ left: `${place.x}%`, top: `${place.y}%` }}
            aria-label={`Explore ${place.label}`}
            aria-pressed={selected === place.id}
            onClick={() => onSelect(place.id)}
          >
            <span className="neighborhood-map__pin" aria-hidden="true">{place.number}</span>
            <span className="neighborhood-map__place-name">{place.label}</span>
          </button>
        ))}
      </div>

      <div className="neighborhood-map__compass" aria-hidden="true">
        <span>N</span>
        <svg width="20" height="29" viewBox="0 0 20 29" fill="none">
          <path d="M10 2 17 23 10 19 3 23Z" fill="currentColor" />
          <path d="M10 2v17l7 4Z" fill="var(--map-land)" stroke="currentColor" strokeWidth=".8" />
        </svg>
      </div>
      <p className="neighborhood-map__caption">Illustrated map <span aria-hidden="true">·</span> San Francisco</p>
    </div>
  )
}
