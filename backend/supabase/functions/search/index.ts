import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

serve(async (_req) => {
  return Response.json({ results: [] });
});
