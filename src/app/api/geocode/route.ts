import { NextRequest, NextResponse } from "next/server";

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Server-side proxy for OpenStreetMap Nominatim search. Two reasons this can't be called
 * directly from the browser: (1) Nominatim doesn't send Access-Control-Allow-Origin, so the
 * browser blocks the response even though the request itself succeeds; (2) their usage policy
 * asks for an identifying User-Agent, which browsers refuse to let JS set on fetch() but a
 * server-side route handler can set freely.
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 3) {
    return NextResponse.json([]);
  }

  const params = new URLSearchParams({
    format: "jsonv2",
    q: query,
    addressdetails: "0",
    limit: "5",
  });

  const response = await fetch(`${NOMINATIM_SEARCH_URL}?${params.toString()}`, {
    headers: {
      "User-Agent": "RideFlowFrontend/1.0 (portfolio project, dev use only)",
    },
    // Identical queries resolve to the same results for a while — light caching is a good
    // citizen move given Nominatim's free-tier rate limits.
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Location search failed" }, { status: 502 });
  }

  const results = await response.json();
  return NextResponse.json(results);
}
