
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OnboardingSlide from "@/components/OnboardingSlide";
import { motion, AnimatePresence } from "framer-motion";

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Exclusive Airport Lounges",
      description: "Discover premium airport lounges worldwide and escape the terminal crowds.",
      image: "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Easy Booking Process",
      description: "Book your lounge access in seconds with our streamlined process.",
      image: "https://images.unsplash.com/photo-1568888067323-407f56c302ef?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Instant Access",
      description: "Skip the lines with your digital QR code for a seamless entry.",
      image: "https://images.unsplash.com/photo-1616442830389-b117b0e588fd?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      startApp();
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const startApp = () => {
    // Mark onboarding as completed in local storage
    localStorage.setItem("onboardingCompleted", "true");
    navigate("/airport-select");
  };

  // Progress indicator dots
  const renderDots = () => {
    return (
      <div className="flex space-x-2 justify-center mt-8">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              index === currentSlide ? "bg-primary" : "bg-muted"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Show only the active slide without AnimatePresence to fix transition issues */}
      {slides.map((slide, index) => (
        <OnboardingSlide
          key={index}
          title={slide.title}
          description={slide.description}
          image={slide.image}
          isActive={currentSlide === index}
        >
          {index === slides.length - 1 && (
            <Button onClick={startApp} className="w-full">
              Get Started
            </Button>
          )}
        </OnboardingSlide>
      ))}

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-20">
        {renderDots()}
        
        <div className="flex space-x-4 mt-6">
          {currentSlide < slides.length - 1 ? (
            <>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={startApp}
              >
                Skip
              </Button>
              <Button 
                className="flex-1"
                onClick={goToNextSlide}
              >
                Next
              </Button>
            </>
          ) : (
            <Button 
              className="w-full"
              onClick={startApp}
            >
              Get Started
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
