
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Minus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Lounge, formatCurrency } from "@/lib/data";

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  guests: z.number().min(1).max(10),
});

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", 
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
  "18:00", "19:00", "20:00", "21:00"
];

interface BookingFormProps {
  lounge: Lounge;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const BookingForm = ({ lounge, onSubmit }: BookingFormProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guests: 1,
    },
  });

  const selectedDate = form.watch("date");
  const selectedTime = form.watch("time");
  const guests = form.watch("guests") || 1;
  
  const totalPrice = lounge.price * guests;

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  const incrementGuests = () => {
    const currentGuests = form.getValues("guests") || 1;
    if (currentGuests < 10) {
      form.setValue("guests", currentGuests + 1);
    }
  };

  const decrementGuests = () => {
    const currentGuests = form.getValues("guests") || 1;
    if (currentGuests > 1) {
      form.setValue("guests", currentGuests - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Date</FormLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal h-12",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Time</FormLabel>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  // Check if time is within opening hours
                  const isAvailable = time >= lounge.openingHours.open && 
                                      time <= lounge.openingHours.close;
                  
                  return (
                    <Button
                      key={time}
                      type="button"
                      variant={field.value === time ? "default" : "outline"}
                      className={cn(
                        "h-10",
                        !isAvailable && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => isAvailable && field.onChange(time)}
                      disabled={!isAvailable}
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guests"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Number of Guests</FormLabel>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={decrementGuests}
                  disabled={guests <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || "1"}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    className="h-12 text-center mx-3 w-20"
                    readOnly
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={incrementGuests}
                  disabled={guests >= 10}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-4 mt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm">Price per guest</span>
            <span>{formatCurrency(lounge.price, lounge.currency)}</span>
          </div>
          <div className="flex justify-between items-center font-medium text-lg">
            <span>Total</span>
            <span className="text-primary">
              {formatCurrency(totalPrice, lounge.currency)}
            </span>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 mt-4"
          disabled={!selectedDate || !selectedTime}
        >
          Continue to Checkout
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
