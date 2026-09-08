"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Input, InputProps } from "@/components/ui/Input";
import { GeocodeResult, searchLocations } from "@/services/geocoding.service";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cn } from "@/lib/utils";

export type PlaceSelection = GeocodeResult;

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 400;

export interface LocationAutocompleteProps extends Omit<InputProps, "onChange" | "value"> {
  onPlaceSelect: (place: PlaceSelection) => void;
}

/**
 * A text input with a live suggestions dropdown, backed by OpenStreetMap search
 * (services/geocoding.service.ts). Fully self-contained/controlled — manages its own text,
 * debounced search, and dropdown state; the caller only gets the final selection via
 * onPlaceSelect (address + lat/lng), same contract as before.
 *
 * `isLoading`/`showDropdown` are computed at render time from `query` + `completedQuery`
 * rather than tracked as separate state synced inside the search effect — the effect only
 * calls setState from within its async callbacks (after the fetch settles), never
 * synchronously in the effect body itself.
 */
export function LocationAutocomplete({
  onPlaceSelect,
  label,
  placeholder,
  error,
  hint,
  ...inputProps
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [completedQuery, setCompletedQuery] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  // The most recently selected address — state, not a ref, since it's read during render
  // (isJustSelected below); refs can't be read during render under React Compiler rules.
  const [lastSelectedAddress, setLastSelectedAddress] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);

  useEffect(() => {
    if (debouncedQuery === lastSelectedAddress) return;
    if (debouncedQuery.trim().length < MIN_QUERY_LENGTH) return;

    const controller = new AbortController();

    searchLocations(debouncedQuery, controller.signal)
      .then((results) => {
        setSuggestions(results);
        setCompletedQuery(debouncedQuery);
        setHighlightedIndex(-1);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Location search failed:", err);
        setSuggestions([]);
        setCompletedQuery(debouncedQuery);
      });

    return () => controller.abort();
  }, [debouncedQuery, lastSelectedAddress]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDismissed(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmedQuery = query.trim();
  const isJustSelected = query === lastSelectedAddress;
  const meetsMinLength = trimmedQuery.length >= MIN_QUERY_LENGTH;
  const isLoading = meetsMinLength && !isJustSelected && query !== completedQuery;
  const showDropdown = !dismissed && meetsMinLength && !isJustSelected;

  function handleSelect(suggestion: GeocodeResult) {
    setLastSelectedAddress(suggestion.address);
    setQuery(suggestion.address);
    setSuggestions([]);
    onPlaceSelect(suggestion);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      event.preventDefault();
      handleSelect(suggestions[highlightedIndex]);
    } else if (event.key === "Escape") {
      setDismissed(true);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        label={label}
        placeholder={placeholder}
        error={error}
        hint={hint}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setDismissed(false);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setDismissed(false)}
        autoComplete="off"
        {...inputProps}
      />
      {showDropdown && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
          {isLoading ? (
            <div className="flex items-center gap-2 p-3 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching&hellip;
            </div>
          ) : suggestions.length === 0 ? (
            <p className="p-3 text-sm text-slate-400">No results found</p>
          ) : (
            <ul className="max-h-64 overflow-y-auto py-1">
              {suggestions.map((suggestion, index) => (
                <li key={`${suggestion.latitude}-${suggestion.longitude}-${index}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(suggestion)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "flex w-full items-start gap-2 px-3 py-2 text-left text-sm",
                      index === highlightedIndex ? "bg-slate-100" : "hover:bg-slate-50"
                    )}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <span className="text-slate-700">{suggestion.address}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
