
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Plus, Minus, Calendar, Clock } from "lucide-react";
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
import { Lounge, formatCurrency } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  guests: z.number().min(1).max(10),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
});

interface BookingFormProps {
  lounge: Lounge;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const BookingForm = ({ lounge, onSubmit }: BookingFormProps) => {
  const today = new Date();
  
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      slots.push(`${hour}:00`);
      if (hour < 22) {
        slots.push(`${hour}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guests: 1,
      date: today,
      time: "12:00",
    },
  });

  const guests = form.watch("guests") || 1;
  const totalPrice = lounge.price * guests;

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with values:", values);
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

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
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
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < today}
                    initialFocus
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
            <FormItem>
              <FormLabel>Time</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a time" />
                    <Clock className="h-4 w-4 opacity-50" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        >
          Continue to Checkout
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
