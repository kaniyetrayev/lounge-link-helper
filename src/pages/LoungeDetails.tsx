
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { getAirportById, getLoungeById, formatCurrency } from "@/lib/data";

const LoungeDetails = () => {
  const { airportId, loungeId } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

  // Get lounge data from the mock API
  const lounge = getLoungeById(loungeId!);
  const airport = airportId ? getAirportById(airportId) : null;
  
  useEffect(() => {
    if (!lounge) {
      navigate("/airport-select");
    } else {
      // Initialize image loading state
      setImagesLoaded(new Array(lounge.images.length).fill(false));
    }
  }, [lounge, navigate]);
  
  if (!lounge || !airport) {
    return null;
  }

  const handleImageLoad = (index: number) => {
    const newImagesLoaded = [...imagesLoaded];
    newImagesLoaded[index] = true;
    setImagesLoaded(newImagesLoaded);
  };
  
  const handleBookNow = () => {
    navigate(`/booking/${loungeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        showBackButton
        transparent
      />
      
      {/* Image carousel */}
      <div className="relative h-[40vh] bg-muted">
        {lounge.images.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className={`absolute inset-0 bg-muted animate-pulse ${
              imagesLoaded[index] ? "opacity-0" : "opacity-100"
            }`} />
            <img
              src={image}
              alt={`${lounge.name} - image ${index + 1}`}
              className="h-full w-full object-cover"
              onLoad={() => handleImageLoad(index)}
            />
          </div>
        ))}
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
          {currentImageIndex + 1} / {lounge.images.length}
        </div>
        
        {/* Navigation dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1">
          {lounge.images.map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="px-5 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">{lounge.name}</h1>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-amber-500 mr-1" /> 
              <span className="font-medium mr-1">{lounge.rating}</span>
              <span className="mr-3">• </span>
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {lounge.openingHours.open} - {lounge.openingHours.close}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-semibold text-primary">
              {formatCurrency(lounge.price, lounge.currency)}
            </div>
            <div className="text-xs text-muted-foreground">per person</div>
          </div>
        </div>
        
        <div className="mt-5">
          <h2 className="font-medium text-md mb-2">Description</h2>
          <p className="text-muted-foreground text-sm">
            {lounge.description}
          </p>
        </div>
        
        <div className="mt-5">
          <h2 className="font-medium text-md mb-2">Amenities</h2>
          <div className="grid grid-cols-2 gap-y-2 gap-x-2">
            {lounge.amenities.map((amenity, index) => (
              <div 
                key={index}
                className="flex items-center text-sm"
              >
                <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                {amenity}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-5">
          <h2 className="font-medium text-md mb-2">Location</h2>
          <div className="text-sm flex items-center">
            <span>
              {airport.name}, Terminal B
            </span>
            <ChevronRight className="h-4 w-4 ml-1 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      {/* Booking button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t">
        <Button
          className="w-full h-12"
          onClick={handleBookNow}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default LoungeDetails;
