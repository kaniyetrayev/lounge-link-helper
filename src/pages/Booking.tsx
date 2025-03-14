
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import BookingForm from "@/components/BookingForm";
import { getLoungeById } from "@/lib/data";

const formSchema = z.object({
  guests: z.number(),
});

type BookingFormData = z.infer<typeof formSchema>;

const Booking = () => {
  const { loungeId } = useParams();
  const navigate = useNavigate();
  
  const lounge = getLoungeById(loungeId!);
  
  if (!lounge) {
    navigate("/airport-select");
    return null;
  }
  
  const handleSubmit = (data: BookingFormData) => {
    // In a real app, this would send data to an API
    // For demo purposes, we'll just store the booking details in session storage
    const bookingDetails = {
      loungeId: lounge.id,
      loungeName: lounge.name,
      guests: data.guests,
      pricePerGuest: lounge.price,
      totalPrice: lounge.price * data.guests,
      currency: lounge.currency,
    };
    
    sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
    navigate("/checkout");
  };

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
            </div>
          </div>
        </div>
        
        <BookingForm lounge={lounge} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Booking;
