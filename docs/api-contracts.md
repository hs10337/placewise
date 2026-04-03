# API Contracts (MVP)

## GET /resolve
Query:
- `lat` number
- `lng` number
- `city` string (default `san-francisco`)

Response:
```json
{
  "selection": {
    "lat": 37.7749,
    "lng": -122.4194
  },
  "mode": "exact_place",
  "confidence": "high",
  "distanceMeters": 12,
  "place": {
    "id": "plc_123",
    "name": "Ferry Building",
    "latitude": 37.7955,
    "longitude": -122.3937,
    "placeType": "landmark",
    "coverageType": "exact_place"
  }
}
```

## GET /place/{id}
Response:
```json
{
  "id": "plc_123",
  "name": "Ferry Building",
  "hook": "A rebuilt waterfront icon shaped by fire and recovery.",
  "summary": "...",
  "whyItMatters": "...",
  "facts": ["..."],
  "lenses": [
    {"type": "history", "body": "..."}
  ],
  "sources": [
    {"labelType": "official", "title": "Port of SF", "url": "https://..."}
  ],
  "confidence": "high",
  "coverageType": "exact_place"
}
```

## GET /search
Query:
- `q` string (required)
- `city` string (default `san-francisco`)
- `limit` int (default 8)

Response:
```json
{
  "results": [
    {
      "id": "plc_123",
      "name": "Ferry Building",
      "latitude": 37.7955,
      "longitude": -122.3937,
      "placeType": "landmark",
      "confidence": "high"
    }
  ]
}
```
