
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Airport, searchAirports } from "@/lib/data";
import { cn } from "@/lib/utils";

interface AirportSearchProps {
  onSelect: (airport: Airport) => void;
  placeholder?: string;
}

const AirportSearch = ({ onSelect, placeholder = "Search airports or cities" }: AirportSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Airport[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchAirports(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (airport: Airport) => {
    onSelect(airport);
    setQuery("");
    setIsFocused(false);
    setResults([]);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pl-10 pr-10 h-12"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isFocused && results.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-[60vh] overflow-auto glass-panel animate-fade-in"
        >
          <div className="p-2">
            {results.map((airport) => (
              <button
                key={airport.id}
                className="w-full text-left px-3 py-3 hover:bg-accent rounded-md transition-colors flex items-start space-x-3"
                onClick={() => handleSelect(airport)}
              >
                <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{airport.city}</span>
                    <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      {airport.code}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {airport.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {airport.country}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportSearch;
