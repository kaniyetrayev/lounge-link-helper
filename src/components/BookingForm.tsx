
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Minus } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Lounge, formatCurrency } from "@/lib/data";

const formSchema = z.object({
  guests: z.number().min(1).max(10),
});

interface BookingFormProps {
  lounge: Lounge;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const BookingForm = ({ lounge, onSubmit }: BookingFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guests: 1,
    },
  });

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
        >
          Continue to Checkout
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
