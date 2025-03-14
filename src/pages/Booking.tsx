
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import BookingForm from "@/components/BookingForm";
import { getLoungeById } from "@/lib/data";
import { api } from "@/lib/api";
import { adaptLounges } from "@/lib/apiAdapter";
import { toast } from "sonner";
import { Lounge } from "@/lib/data";

const formSchema = z.object({
  guests: z.number(),
});

type BookingFormData = z.infer<typeof formSchema>;

const Booking = () => {
  const { loungeId } = useParams();
  const navigate = useNavigate();
  const [lounge, setLounge] = useState<Lounge | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLoungeDetails = async () => {
      console.log("Booking - Fetching lounge details for ID:", loungeId);
      
      if (!loungeId) {
        console.error("Booking - No loungeId provided");
        toast.error("Lounge information not found");
        navigate("/airport-select");
        return;
      }

      // First try to get from local data
      const localLounge = getLoungeById(loungeId);
      
      if (localLounge) {
        console.log("Booking - Found lounge in local data:", localLounge.name);
        setLounge(localLounge);
        setLoading(false);
        return;
      }
      
      // If not in local data, check session storage
      const storedLoungeData = sessionStorage.getItem("selectedLounge");
      if (storedLoungeData) {
        try {
          const parsedLounge = JSON.parse(storedLoungeData);
          console.log("Booking - Found lounge in session storage:", parsedLounge.name);
          setLounge(parsedLounge);
          setLoading(false);
          return;
        } catch (err) {
          console.error("Booking - Error parsing stored lounge data:", err);
        }
      }
      
      // As a fallback, try to fetch from API using the ID
      try {
        console.log("Booking - Fetching lounge from API");
        const allLounges = await api.getAllLounges();
        
        // Use loungeId to find matching lounge in API response
        const foundLounge = allLounges?.find(l => l.lounge_code === loungeId);
        
        if (foundLounge) {
          console.log("Booking - Found lounge in API response");
          const adaptedLounges = adaptLounges([foundLounge]);
          if (adaptedLounges.length > 0) {
            setLounge(adaptedLounges[0]);
            setLoading(false);
            return;
          }
        }
        
        // If we reach here, no lounge was found
        console.error("Booking - Lounge not found with ID:", loungeId);
        toast.error("Lounge information not found");
        navigate("/airport-select");
      } catch (err) {
        console.error("Booking - Failed to fetch lounge:", err);
        toast.error("Failed to load lounge information");
        navigate("/airport-select");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoungeDetails();
  }, [loungeId, navigate]);
  
  const handleSubmit = (data: BookingFormData) => {
    if (!lounge) {
      toast.error("Lounge information not available");
      return;
    }
    
    // Store the booking details in session storage
    const bookingDetails = {
      loungeId: lounge.id,
      loungeName: lounge.name,
      terminal: lounge.terminal,
      guests: data.guests,
      pricePerGuest: lounge.price,
      totalPrice: lounge.price * data.guests,
      currency: lounge.currency,
    };
    
    console.log("Booking - Saving booking details:", bookingDetails);
    sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar title="Loading..." showBackButton />
        <div className="page-container">
          <div className="page-content flex items-center justify-center h-[80vh]">
            <div className="text-center">
              <p className="text-muted-foreground">Loading lounge information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lounge) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar title="Error" showBackButton />
        <div className="page-container">
          <div className="page-content flex items-center justify-center h-[80vh]">
            <div className="text-center">
              <p className="text-destructive">Lounge information not found</p>
              <button 
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                onClick={() => navigate("/airport-select")}
              >
                Return to Airport Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bg-background">
      <Navbar title="Book Lounge Access" showBackButton />
      
      <div className="page-content">
        <div className="mb-6">
          <h1 className="page-heading">Booking Details</h1>
          <p className="text-muted-foreground">
            Select number of guests
          </p>
        </div>
        
        <div className="p-5 rounded-xl bg-white border shadow-sm mb-6">
          <div className="flex items-start">
            <div className="flex-1">
              <h2 className="font-semibold">{lounge.name}</h2>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mr-1" /> 
                <span>{lounge.terminal}</span>
              </div>
            </div>
          </div>
        </div>
        
        {lounge && <BookingForm lounge={lounge} onSubmit={handleSubmit} />}
      </div>
    </div>
  );
};

export default Booking;
