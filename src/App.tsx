import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import AirportSelect from "./pages/AirportSelect";
import LoungeDetails from "./pages/LoungeDetails";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component to manage overlay visibility
const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const [prevLocation, setPrevLocation] = useState(location);

  // Keep track of the previous location before overlay routes
  useEffect(() => {
    if (!location.pathname.includes('/booking/')) {
      setPrevLocation(location);
    }
  }, [location]);

  // Show booking overlay when on booking route
  useEffect(() => {
    setShowBooking(location.pathname.includes('/booking/'));
  }, [location]);

  const handleCloseBooking = () => {
    setShowBooking(false);
    // Navigate back to previous page
    navigate(-1);
  };

  // This is the location we'll render in the main Routes
  // When in overlay, we still want to render the previous location underneath
  const backgroundLocation = showBooking ? prevLocation : location;

  return (
    <>
      <Routes location={backgroundLocation}>
        <Route path="/" element={<Index />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/airport-select" element={<AirportSelect />} />
        <Route path="/lounges/:airportId" element={<LoungeDetails />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Show booking as an overlay */}
      {showBooking && (
        <Routes>
          <Route path="/booking/:loungeId" element={<Booking onClose={handleCloseBooking} />} />
        </Routes>
      )}
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionConfig reducedMotion="user">
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </MotionConfig>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
