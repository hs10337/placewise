// Vite includes this public browser token in the preview bundle.
// Keep secret tokens out of VITE_* variables.
export const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN?.trim() ?? ''
export const mapboxTokenConfigured = mapboxAccessToken.length > 0

export const mapboxStyle = (mode: 'light' | 'dark') => `mapbox://styles/mapbox/${mode}-v11`
