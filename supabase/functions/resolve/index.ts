import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

type ResolutionRow = {
  mode: string;
  confidence: string;
  distance_meters: number | null;
  place_id: string | null;
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("API_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok");
  }

  const url = new URL(req.url);
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  const city = url.searchParams.get("city") ?? "san-francisco";

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return Response.json({ error: "lat/lng required" }, { status: 400 });
  }

  const { data: resolution, error: resolutionError } = await supabase
    .rpc("resolve_place", {
      in_lat: lat,
      in_lng: lng,
      in_city: city
    })
    .maybeSingle<ResolutionRow>();

  if (resolutionError) {
    return Response.json({ error: resolutionError.message }, { status: 500 });
  }

  let place = null;

  if (resolution?.place_id && resolution.mode !== "area_context") {
    const { data: placeRow, error: placeError } = await supabase
      .from("places")
      .select("id, name, latitude, longitude, place_type, coverage_type, confidence")
      .eq("id", resolution.place_id)
      .maybeSingle();

    if (placeError) {
      return Response.json({ error: placeError.message }, { status: 500 });
    }

    if (placeRow) {
      place = {
        id: placeRow.id,
        name: placeRow.name,
        latitude: placeRow.latitude,
        longitude: placeRow.longitude,
        placeType: placeRow.place_type,
        coverageType: placeRow.coverage_type,
        confidence: placeRow.confidence
      };
    }
  }

  return Response.json({
    selection: { lat, lng },
    mode: resolution?.mode ?? "area_context",
    confidence: resolution?.confidence ?? "low",
    distanceMeters: resolution?.distance_meters ?? null,
    place
  });
});
