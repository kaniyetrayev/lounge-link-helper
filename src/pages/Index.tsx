
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    
    if (onboardingCompleted) {
      // If onboarding is completed, redirect to airport selection
      navigate("/airport-select");
    }
  }, [navigate]);

  const startOnboarding = () => {
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
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
      </div>
      
      <div className="p-6 text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
};

export default Index;
