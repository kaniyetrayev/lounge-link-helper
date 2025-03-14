
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Star, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { getAirportById, formatCurrency } from "@/lib/data";
import { api } from "@/lib/api";
import { adaptLounges } from "@/lib/apiAdapter";
import { Lounge, Airport } from "@/lib/data";
import { toast } from "sonner";
import LoungeCard from "@/components/LoungeCard";

const LoungeDetails = () => {
  const { airportId } = useParams();
  const navigate = useNavigate();
  
  // Try to get airport from both URL param and session storage
  const airportFromData = airportId ? getAirportById(airportId) : null;
  const [airport, setAirport] = useState<Airport | null>(airportFromData);
  
  const [lounges, setLounges] = useState<Lounge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Try to get airport from session storage if not found by ID
  useEffect(() => {
    if (!airport) {
      console.log("Airport not found by ID, checking session storage");
      const storedAirport = sessionStorage.getItem("selectedAirport");
      
      if (storedAirport) {
        try {
          const parsedAirport = JSON.parse(storedAirport);
          console.log("Found airport in session storage:", parsedAirport);
          setAirport(parsedAirport);
        } catch (err) {
          console.error("Error parsing stored airport:", err);
          navigate("/airport-select");
        }
      } else {
        console.log("No airport found in session storage, redirecting");
        navigate("/airport-select");
      }
    }
  }, [airport, navigate]);
  
  // Fetch lounges when airport is available
  useEffect(() => {
    if (!airport) return;
    
    const fetchLounges = async () => {
      try {
        setLoading(true);
        console.log("FETCH LOUNGES - Starting search for airport:", airport);
        
        // First try to search by city (most reliable)
        console.log("FETCH LOUNGES - Searching by city:", airport.city);
        const cityParams = { city: airport.city };
        console.log("FETCH LOUNGES - API request params:", cityParams);
        
        const cityLounges = await api.searchLounges(cityParams);
        console.log("FETCH LOUNGES - API response for city search:", cityLounges);
        
        // If city search has results, use them
        if (cityLounges && cityLounges.length > 0) {
          console.log("FETCH LOUNGES - Found lounges by city search:", cityLounges.length);
          setLounges(adaptLounges(cityLounges));
          setLoading(false);
          return;
        }
        
        // If no results, try by airport name
        console.log("FETCH LOUNGES - No results from city search, trying airport name:", airport.name);
        const airportLounges = await api.searchLounges({
          airport_name: airport.name
        });
        console.log("FETCH LOUNGES - Airport name search results:", airportLounges);
        
        if (airportLounges && airportLounges.length > 0) {
          console.log("FETCH LOUNGES - Found lounges by airport name:", airportLounges.length);
          setLounges(adaptLounges(airportLounges));
          setLoading(false);
          return;
        }
        
        // If still no results, try by country as a fallback
        console.log("FETCH LOUNGES - No results from airport name search, trying country:", airport.country);
        const countryLounges = await api.searchLounges({
          country: airport.country
        });
        console.log("FETCH LOUNGES - Country search results:", countryLounges);
        
        if (countryLounges && countryLounges.length > 0) {
          console.log("FETCH LOUNGES - Found lounges by country:", countryLounges.length);
          setLounges(adaptLounges(countryLounges));
        } else {
          // Last resort - get all lounges and limit results
          console.log("FETCH LOUNGES - No specific lounges found, getting all lounges as fallback");
          const allLounges = await api.getAllLounges();
          console.log("FETCH LOUNGES - Got all lounges:", allLounges?.length);
          setLounges(adaptLounges(allLounges?.slice(0, 5) || []));
        }
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch lounges:", err);
        setError("Failed to load lounges. Please try again later.");
        toast.error("Failed to load lounges", {
          description: "Please check your connection and try again."
        });
      } finally {
        setLoading(false);
      }
    };
    
    console.log("Calling fetchLounges function");
    fetchLounges();
  }, [airport]);
  
  if (!airport) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading airport information...</p>
        </div>
      </div>
    );
  }

  const handleLoungeSelect = (loungeId: string) => {
    navigate(`/booking/${loungeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        title={airport.name}
        showBackButton
      />
      
      <div className="page-container">
        <div className="page-content">
          <div className="mb-6">
            <h1 className="page-heading">Available Lounges</h1>
            <p className="text-muted-foreground">
              Select a lounge at {airport.city} Airport ({airport.code})
            </p>
          </div>
          
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div 
                  key={i}
                  className="w-full h-64 bg-accent/50 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : error ? (
            <div className="p-4 border rounded-lg bg-destructive/10 text-destructive">
              {error}
            </div>
          ) : lounges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No lounges found for this airport.</p>
              <Button 
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/airport-select')}
              >
                Search Another Airport
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {lounges.map((lounge) => (
                <LoungeCard 
                  key={lounge.id}
                  lounge={lounge}
                  onClick={() => handleLoungeSelect(lounge.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoungeDetails;
