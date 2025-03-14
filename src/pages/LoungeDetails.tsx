
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Star, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { getAirportById, getLoungesByAirportId, formatCurrency } from "@/lib/data";

const LoungeDetails = () => {
  const { airportId } = useParams();
  const navigate = useNavigate();
  
  // Get airport data
  const airport = airportId ? getAirportById(airportId) : null;
  
  // Get lounges for the selected airport
  const lounges = airportId ? getLoungesByAirportId(airportId) : [];
  
  useEffect(() => {
    if (!airport) {
      navigate("/airport-select");
    }
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
          
          <div className="space-y-4">
            {lounges.map((lounge) => (
              <div 
                key={lounge.id}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                <div className="h-32 bg-muted relative">
                  <img 
                    src={lounge.images[0]} 
                    alt={lounge.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{lounge.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-1" /> 
                        <span>{lounge.terminal}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 text-amber-500 mr-1" /> 
                        <span>{lounge.rating}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium text-primary">
                        {formatCurrency(lounge.price, lounge.currency)}
                      </div>
                      <div className="text-xs text-muted-foreground">per person</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      className="w-full"
                      onClick={() => handleLoungeSelect(lounge.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoungeDetails;
