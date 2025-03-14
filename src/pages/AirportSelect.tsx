
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AirportSearch from "@/components/AirportSearch";
import { Airport, airports } from "@/lib/data";
import { fadeIn, slideUp, staggeredChildren } from "@/lib/animations";

const AirportSelect = () => {
  const navigate = useNavigate();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Popular cities to feature
  const popularAirports = airports.slice(0, 5);

  const handleAirportSelect = (airport: Airport) => {
    // Navigate to the lounges page for the selected airport
    navigate(`/lounges/${airport.id}`);
  };

  return (
    <div className="page-container bg-background">
      <Navbar title="Select Airport" showBackButton />
      
      <div className="page-content">
        <div className="mb-6">
          <h1 className="page-heading">Where are you flying from?</h1>
          <AirportSearch onSelect={handleAirportSelect} />
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-medium mb-4">Popular Airports</h2>
          
          <motion.div 
            className="space-y-3"
            variants={staggeredChildren}
            initial="initial"
            animate="animate"
          >
            {popularAirports.map((airport, index) => (
              <motion.button
                key={airport.id}
                className="w-full flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm border transition hover:shadow-md active:bg-accent/50"
                onClick={() => handleAirportSelect(airport)}
                variants={slideUp(index * 0.05)}
              >
                <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                <div className="text-left">
                  <div className="flex items-center">
                    <span className="font-medium">{airport.city}</span>
                    <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
                      {airport.code}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {airport.name}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AirportSelect;
