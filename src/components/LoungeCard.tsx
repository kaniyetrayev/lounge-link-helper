
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Lounge, formatCurrency } from "@/lib/data";
import { cn } from "@/lib/utils";

interface LoungeCardProps {
  lounge: Lounge;
  onClick: () => void;
}

const LoungeCard = ({ lounge, onClick }: LoungeCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleClick = () => {
    // Log the complete lounge object for debugging
    console.log("LoungeCard - Lounge selected:", lounge);
    onClick();
  };

  return (
    <div 
      className="w-full bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-200 active:scale-98 animate-slide-up cursor-pointer"
      onClick={handleClick}
    >
      <div className="aspect-[16/9] relative overflow-hidden bg-muted">
        <div className={cn(
          "absolute inset-0 bg-muted animate-pulse",
          imageLoaded ? "opacity-0" : "opacity-100"
        )} />
        <img
          src={lounge.images[0]}
          alt={lounge.name}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium text-lg leading-tight">{lounge.name}</h3>
            <div className="flex items-center space-x-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={cn(
                    "text-sm",
                    i < Math.floor(lounge.rating) ? "text-amber-500" : "text-gray-300"
                  )}
                >
                  ★
                </span>
              ))}
              <span className="text-xs text-muted-foreground ml-1">{lounge.rating}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-semibold text-primary">
              {formatCurrency(lounge.price, lounge.currency)}
            </div>
            <div className="text-xs text-muted-foreground">per person</div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {lounge.amenities.slice(0, 3).map((amenity, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-accent rounded-full text-accent-foreground"
              >
                {amenity}
              </span>
            ))}
            {lounge.amenities.length > 3 && (
              <span className="text-xs px-2 py-1 bg-accent rounded-full text-accent-foreground">
                +{lounge.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center border-t pt-3">
          <div className="text-xs text-muted-foreground">
            Open {lounge.openingHours.open} - {lounge.openingHours.close}
          </div>
          <div className="flex items-center text-sm text-primary font-medium">
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoungeCard;
