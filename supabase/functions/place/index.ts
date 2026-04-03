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
  const placeID = url.searchParams.get("id");

  if (!placeID) {
    return Response.json({ error: "id required" }, { status: 400 });
  }

  const { data: placeRow, error: placeError } = await supabase
    .from("places")
    .select("id, name, coverage_type, confidence")
    .eq("id", placeID)
    .maybeSingle();

  if (placeError) {
    return Response.json({ error: placeError.message }, { status: 500 });
  }

  if (!placeRow) {
    return Response.json({ error: "place not found" }, { status: 404 });
  }

  const { data: briefRow, error: briefError } = await supabase
    .from("place_briefs")
    .select("hook, summary, why_it_matters, facts")
    .eq("place_id", placeID)
    .maybeSingle();

  if (briefError) {
    return Response.json({ error: briefError.message }, { status: 500 });
  }

  const { data: lensRows, error: lensesError } = await supabase
    .from("place_lenses")
    .select("lens_type, body")
    .eq("place_id", placeID)
    .order("id");

  if (lensesError) {
    return Response.json({ error: lensesError.message }, { status: 500 });
  }

  const { data: sourceRows, error: sourcesError } = await supabase
    .from("sources")
    .select("label_type, title, url")
    .eq("place_id", placeID)
    .order("id");

  if (sourcesError) {
    return Response.json({ error: sourcesError.message }, { status: 500 });
  }

  return Response.json({
    id: placeRow.id,
    name: placeRow.name,
    hook: briefRow?.hook ?? "",
    summary: briefRow?.summary ?? "",
    whyItMatters: briefRow?.why_it_matters ?? "",
    facts: briefRow?.facts ?? [],
    lenses: (lensRows ?? []).map((lens) => ({
      type: lens.lens_type,
      body: lens.body
    })),
    sources: (sourceRows ?? []).map((source) => ({
      labelType: source.label_type,
      title: source.title,
      url: source.url
    })),
    confidence: placeRow.confidence,
    coverageType: placeRow.coverage_type
  });
});
