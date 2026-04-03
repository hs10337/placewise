import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

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
  const query = url.searchParams.get("q")?.trim();
  const city = url.searchParams.get("city") ?? "san-francisco";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? "8"), 1), 20);

  if (!query) {
    return Response.json({ error: "q required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("places")
    .select("id, name, latitude, longitude, place_type, confidence")
    .eq("city_slug", city)
    .ilike("name", `%${query}%`)
    .order("name")
    .limit(limit);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    results: (data ?? []).map((place) => ({
      id: place.id,
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      placeType: place.place_type,
      confidence: place.confidence
    }))
  });
});
