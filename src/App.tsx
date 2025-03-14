import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import AirportSelect from "./pages/AirportSelect";
import LoungeDetails from "./pages/LoungeDetails";
import Booking from "./pages/Booking";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component to manage checkout visibility
const AppRoutes = () => {
  const location = useLocation();
  const [showCheckout, setShowCheckout] = useState(false);
  const [prevLocation, setPrevLocation] = useState(location);

  // Keep track of the previous location before /checkout
  useEffect(() => {
    if (!location.pathname.includes('/checkout')) {
      setPrevLocation(location);
    }
  }, [location]);

  // Show checkout when on checkout route
  useEffect(() => {
    setShowCheckout(location.pathname.includes('/checkout'));
  }, [location]);

  // This is the location we'll render in the main Routes
  // When in checkout, we still want to render the previous location underneath
  const backgroundLocation = showCheckout ? prevLocation : location;

  return (
    <>
      <Routes location={backgroundLocation}>
        <Route path="/" element={<Index />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/airport-select" element={<AirportSelect />} />
        <Route path="/lounges/:airportId" element={<LoungeDetails />} />
        <Route path="/booking/:loungeId" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Show checkout as an overlay when on the /checkout route */}
      {showCheckout && <Checkout onClose={() => {
        // Use window.history to go back without triggering a full reload
        window.history.back();
      }} />}
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
