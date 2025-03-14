
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import QRCode from "@/components/QRCode";
import { formatCurrency } from "@/lib/data";
import { toast } from "sonner";

const Confirmation = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  
  useEffect(() => {
    // Get completed booking details from session storage
    const bookingStr = sessionStorage.getItem("completedBooking");
    
    if (bookingStr) {
      setBooking(JSON.parse(bookingStr));
      // Show success toast
      toast.success("Booking confirmed!", {
        description: "Your lounge access has been successfully booked!"
      });
    } else {
      navigate("/airport-select");
    }
  }, [navigate]);
  
  if (!booking) {
    return null;
  }

  const handleFindMoreLounges = () => {
    // Clear session storage
    sessionStorage.removeItem("bookingDetails");
    sessionStorage.removeItem("completedBooking");
    
    // Redirect to airport selection
    navigate("/airport-select");
  };
  
  return (
    <div className="page-container bg-background">
      <Navbar title="Booking Confirmed" />
      
      <div className="max-w-md mx-auto w-full px-4 pt-4 pb-32">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-semibold">Thank You!</h1>
          <p className="text-muted-foreground mt-1">
            Your lounge access has been confirmed
          </p>
        </div>
        
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-8">
          <div className="p-6 text-center border-b">
            <h2 className="font-semibold text-lg mb-2">{booking.loungeName}</h2>
            
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-accent mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {booking.formattedDate}
                </span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-accent mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {booking.time}
                </span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-accent mb-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-accent/30 flex flex-col items-center">
            <QRCode bookingId={booking.bookingId} />
          </div>
          
          <div className="p-5 border-t">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm">
                {booking.firstName} {booking.lastName}
              </span>
            </div>
            
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm">{booking.email}</span>
            </div>
            
            <div className="flex justify-between mb-4">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="text-sm">{booking.phone}</span>
            </div>
            
            <div className="pt-3 border-t">
              <div className="flex justify-between font-medium">
                <span>Total Paid</span>
                <span className="text-primary">
                  {formatCurrency(booking.totalPrice, booking.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full h-12 mb-4"
          onClick={() => window.print()}
        >
          Download Pass
        </Button>
        
        <Button
          variant="default"
          className="w-full h-12"
          onClick={handleFindMoreLounges}
        >
          Find More Lounges
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
