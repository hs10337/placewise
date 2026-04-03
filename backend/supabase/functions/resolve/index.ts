import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  const city = url.searchParams.get("city") ?? "san-francisco";

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return Response.json({ error: "lat/lng required" }, { status: 400 });
  }

  return Response.json({
    selection: { lat, lng },
    mode: "area_context",
    confidence: "low",
    distanceMeters: null,
    city,
    place: null
  });
});
