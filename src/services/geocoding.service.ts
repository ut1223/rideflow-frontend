/**
 * Free, keyless location search via OpenStreetMap's Nominatim API — no signup, no billing.
 * Routed through our own /api/geocode route handler rather than called directly: Nominatim
 * doesn't send CORS headers, so the browser silently blocks a direct cross-origin fetch even
 * though the request itself succeeds — see src/app/api/geocode/route.ts.
 */

export interface GeocodeResult {
  address: string;
  latitude: number;
  longitude: number;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export async function searchLocations(
  query: string,
  signal?: AbortSignal
): Promise<GeocodeResult[]> {
  const params = new URLSearchParams({ q: query });

  const response = await fetch(`/api/geocode?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error("Location search failed");
  }

  const results = (await response.json()) as NominatimResult[];
  return results.map((result) => ({
    address: result.display_name,
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon),
  }));
}
