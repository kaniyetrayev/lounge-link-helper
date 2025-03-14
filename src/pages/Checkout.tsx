import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Navbar from "@/components/Navbar";
import { generateBookingId, formatCurrency } from "@/lib/data";

// Form schema for checkout
const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Expiry date must be MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

type CheckoutFormData = z.infer<typeof formSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get booking details from session storage
  const bookingDetailsStr = sessionStorage.getItem("bookingDetails");
  const bookingDetails = bookingDetailsStr ? JSON.parse(bookingDetailsStr) : null;
  
  if (!bookingDetails) {
    navigate("/airport-select");
    return null;
  }
  
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });
  
  const handleSubmit = (data: CheckoutFormData) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Generate a booking ID
      const bookingId = generateBookingId();
      
      // Save the complete booking details
      const completeBooking = {
        ...bookingDetails,
        ...data,
        bookingId,
        bookingDate: new Date().toISOString(),
      };
      
      // Remove sensitive payment info before storing
      delete completeBooking.cardNumber;
      delete completeBooking.expiryDate;
      delete completeBooking.cvv;
      
      // Store booking for the confirmation page
      sessionStorage.setItem("completedBooking", JSON.stringify(completeBooking));
      
      setIsProcessing(false);
      
      // Navigate to confirmation with state indicating we came from checkout
      navigate("/confirmation", { state: { fromCheckout: true } });
    }, 1500);
  };
  
  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, "").substring(0, 16);
  };
  
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };
  
  const formatCVV = (value: string) => {
    return value.replace(/\D/g, "").substring(0, 4);
  };

  return (
    <div className="page-container bg-background">
      <Navbar title="Checkout" showBackButton />
      
      <div className="page-content pb-24">
        <div className="mb-6">
          <h1 className="page-heading">Complete Your Booking</h1>
          <p className="text-muted-foreground">
            Enter your details to confirm your lounge access
          </p>
        </div>
        
        <div className="p-5 rounded-xl bg-white border shadow-sm mb-6">
          <h2 className="font-semibold mb-2">Booking Summary</h2>
          
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Lounge</span>
            <span>{bookingDetails.loungeName}</span>
          </div>
          
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Date</span>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{bookingDetails.formattedDate}</span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Time</span>
            <span>{bookingDetails.time}</span>
          </div>
          
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Guests</span>
            <span>{bookingDetails.guests}</span>
          </div>
          
          <div className="border-t mt-3 pt-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold text-primary">
                {formatCurrency(bookingDetails.totalPrice, bookingDetails.currency)}
              </span>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h2 className="font-semibold">Personal Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="your.email@example.com" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="+1 (555) 123-4567" 
                        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-4 space-y-4">
              <h2 className="font-semibold">Payment Information</h2>
              
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          placeholder="1234 5678 9012 3456" 
                          onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                        />
                        <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="MM/YY" 
                          onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="123" 
                          type="password" 
                          onChange={(e) => field.onChange(formatCVV(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t">
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Pay ${formatCurrency(bookingDetails.totalPrice, bookingDetails.currency)}`}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Checkout;
