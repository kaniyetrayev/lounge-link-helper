
import { Airport as APIAirport, Lounge as APILounge } from './api-types';
import { Airport, Lounge } from './data';

// Generate a unique ID for new objects
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Adapter to convert API airport data to our internal format
export const adaptAirports = (apiAirports: APIAirport[]): Airport[] => {
  return apiAirports.map(airport => ({
    id: generateId(),
    name: airport.name,
    code: airport.iata_code || airport.code,
    city: airport.name.split(' ')[0], // Extract city from airport name (simplified)
    country: airport.country
  }));
};

// Adapter to convert API lounge data to our internal format
export const adaptLounges = (apiLounges: APILounge[]): Lounge[] => {
  return apiLounges.map(lounge => {
    // Generate a mock ID for this lounge
    const id = generateId();
    
    // Generate a mock airport ID (in a real app, we'd have a mapping)
    const airportId = generateId();
    
    return {
      id,
      airportId,
      name: lounge.lounge_name,
      description: lounge.additional || "A comfortable lounge offering a range of amenities for travelers.",
      terminal: lounge.terminal || "Main Terminal",
      images: [
        "https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
        "https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
      ],
      amenities: lounge.additional 
        ? lounge.additional.split('.').map(item => item.trim()).filter(Boolean)
        : ["Wi-Fi", "Refreshments", "Comfortable Seating"],
      openingHours: {
        open: lounge.opening_hours.split('-')[0]?.trim() || "06:00",
        close: lounge.opening_hours.split('-')[1]?.trim() || "22:00"
      },
      price: 65, // Default price since API doesn't provide this
      currency: "USD", // Default currency
      rating: 4.5 // Default rating
    };
  });
};
