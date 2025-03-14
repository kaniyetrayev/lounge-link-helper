
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Star, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { getAirportById, formatCurrency } from "@/lib/data";
import { api } from "@/lib/api";
import { adaptLounges } from "@/lib/apiAdapter";
import { Lounge } from "@/lib/data";
import { toast } from "sonner";
import LoungeCard from "@/components/LoungeCard";

const LoungeDetails = () => {
  const { airportId } = useParams();
  const navigate = useNavigate();
  
  // Get airport data
  const airport = airportId ? getAirportById(airportId) : null;
  
  const [lounges, setLounges] = useState<Lounge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!airport) {
      navigate("/airport-select");
      return;
    }
    
    const fetchLounges = async () => {
      try {
        setLoading(true);
        
        // Try to search by airport name first
        const apiLounges = await api.searchLounges({
          airport_name: airport.name
        });
        
        // If no results, try search by city
        if (apiLounges.length === 0) {
          const cityLounges = await api.searchLounges({
            city: airport.city
          });
          
          if (cityLounges.length === 0) {
            // If still no results, get all lounges as fallback
            const allLounges = await api.getAllLounges();
            const adaptedLounges = adaptLounges(allLounges.slice(0, 5)); // Limit results
            setLounges(adaptedLounges);
          } else {
            setLounges(adaptLounges(cityLounges));
          }
        } else {
          setLounges(adaptLounges(apiLounges));
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
    
    fetchLounges();
  }, [airport, navigate]);
  
  if (!airport) {
    return null;
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
