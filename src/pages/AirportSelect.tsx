
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AirportSearch from "@/components/AirportSearch";
import { Airport, airports } from "@/lib/data";
import { fadeIn, slideUp, staggeredChildren } from "@/lib/animations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AirportSelect = () => {
  const navigate = useNavigate();
  const [unusedBooking, setUnusedBooking] = useState<any>(null);

  // Popular cities to feature
  const popularAirports = airports.slice(0, 5);

  useEffect(() => {
    // Get completed booking from session storage
    const bookingStr = sessionStorage.getItem("completedBooking");
    
    if (bookingStr) {
      const booking = JSON.parse(bookingStr);
      setUnusedBooking(booking);
      
      // Show toast to indicate there's an unused booking
      toast.info("You have an active booking", {
        description: "Your lounge booking is ready to use",
      });
    }
  }, []);

  const handleAirportSelect = (airport: Airport) => {
    // Navigate to the lounges page for the selected airport
    navigate(`/lounges/${airport.id}`);
  };

  const viewBooking = () => {
    navigate("/confirmation");
  };

  return (
    <div className="page-container bg-background">
      <Navbar title="Select Airport" showBackButton />
      
      <div className="page-content">
        <div className="mb-6">
          <h1 className="page-heading">Where are you flying from?</h1>
          <AirportSearch onSelect={handleAirportSelect} />
        </div>

        {unusedBooking && (
          <div className="w-full mb-8">
            <Card className="border shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Booking</CardTitle>
                <CardDescription>You have an unused lounge booking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{unusedBooking.loungeName}</h3>
                    <p className="text-sm text-muted-foreground">{unusedBooking.terminal}</p>
                  </div>
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Ticket className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={viewBooking}
                >
                  View Booking
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-6">
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
