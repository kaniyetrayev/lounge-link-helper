
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const [unusedBooking, setUnusedBooking] = useState<any>(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    
    // Get completed booking from session storage
    const bookingStr = sessionStorage.getItem("completedBooking");
    
    if (bookingStr) {
      setUnusedBooking(JSON.parse(bookingStr));
    }
    
    if (onboardingCompleted) {
      // If onboarding is completed, redirect to airport selection
      // Only if there's no unused booking to display
      if (!bookingStr) {
        navigate("/airport-select");
      }
    }
  }, [navigate]);

  const startOnboarding = () => {
    navigate("/onboarding");
  };

  const viewBooking = () => {
    navigate("/confirmation");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        {unusedBooking ? (
          <div className="w-full max-w-md mb-8">
            <Card className="border shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Unused Booking</CardTitle>
                <CardDescription>You have an active lounge booking</CardDescription>
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

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/airport-select")}
            >
              Book Another Lounge
            </Button>
          </div>
        ) : (
          <>
            <div className="w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight mb-3">Lounge Link</h1>
            <p className="text-muted-foreground mb-8 max-w-xs">
              Your gateway to premium airport lounges worldwide
            </p>
            
            <Button
              size="lg"
              className="w-full max-w-xs h-12"
              onClick={startOnboarding}
            >
              Get Started
            </Button>
          </>
        )}
      </div>
      
      <div className="p-6 text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
};

export default Index;
