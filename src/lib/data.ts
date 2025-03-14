
export interface Airport {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
}

export interface Lounge {
  id: string;
  airportId: string;
  name: string;
  description: string;
  terminal: string;
  images: string[];
  amenities: string[];
  openingHours: {
    open: string;
    close: string;
  };
  price: number;
  currency: string;
  rating: number;
}

export interface Booking {
  id: string;
  loungeId: string;
  date: string;
  time: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalPrice: number;
}

// Mock data for airports
export const airports: Airport[] = [
  {
    id: "1",
    name: "Heathrow Airport",
    code: "LHR",
    city: "London",
    country: "United Kingdom"
  },
  {
    id: "2",
    name: "John F. Kennedy International Airport",
    code: "JFK",
    city: "New York",
    country: "United States"
  },
  {
    id: "3",
    name: "Charles de Gaulle Airport",
    code: "CDG",
    city: "Paris",
    country: "France"
  },
  {
    id: "4",
    name: "Dubai International Airport",
    code: "DXB",
    city: "Dubai",
    country: "United Arab Emirates"
  },
  {
    id: "5",
    name: "Singapore Changi Airport",
    code: "SIN",
    city: "Singapore",
    country: "Singapore"
  },
  {
    id: "6",
    name: "Los Angeles International Airport",
    code: "LAX",
    city: "Los Angeles",
    country: "United States"
  },
  {
    id: "7",
    name: "Hong Kong International Airport",
    code: "HKG",
    city: "Hong Kong",
    country: "China"
  },
  {
    id: "8",
    name: "Hartsfield-Jackson Atlanta International Airport",
    code: "ATL",
    city: "Atlanta",
    country: "United States"
  }
];

// Mock data for lounges
export const lounges: Lounge[] = [
  {
    id: "1",
    airportId: "1",
    name: "Skyline Lounge",
    description: "Experience the height of luxury with panoramic views of the runway, premium dining options, and relaxing spa amenities.",
    terminal: "Terminal 5",
    images: [
      "https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    amenities: ["Premium Food", "Bar Service", "Shower Facilities", "Fast Wi-Fi", "Device Charging", "Relaxation Areas"],
    openingHours: {
      open: "06:00",
      close: "22:00"
    },
    price: 65,
    currency: "USD",
    rating: 4.8
  },
  {
    id: "2",
    airportId: "1",
    name: "Elite Terminal Lounge",
    description: "A quiet sanctuary away from the crowds, offering a sophisticated setting with high-end amenities and personalized service.",
    terminal: "Terminal 2",
    images: [
      "https://images.unsplash.com/photo-1516705486326-924d0ad615ac?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1631049035182-249067d7618e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1503022932493-d8d244f74d37?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    amenities: ["À la Carte Dining", "Premium Cocktails", "Spa Services", "Business Center", "Private Suites", "Concierge Service"],
    openingHours: {
      open: "05:30",
      close: "23:30"
    },
    price: 85,
    currency: "USD",
    rating: 4.9
  },
  {
    id: "3",
    airportId: "2",
    name: "Liberty Lounge",
    description: "New York's premier airport lounge featuring local cuisine, craft cocktails, and amenities designed for the discerning traveler.",
    terminal: "Terminal 4",
    images: [
      "https://images.unsplash.com/photo-1585468274952-66591eb14165?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1470053053191-49690aa5590e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1530229540764-5f6ab595fdbe?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    amenities: ["Artisanal Food", "Craft Beer Selection", "Showers", "Press Reader Access", "Meeting Rooms", "Sleep Pods"],
    openingHours: {
      open: "04:00",
      close: "00:00"
    },
    price: 75,
    currency: "USD",
    rating: 4.7
  },
  {
    id: "4",
    airportId: "3",
    name: "Le Salon Parisien",
    description: "Embrace Parisian elegance in this sophisticated lounge offering French cuisine, fine wines, and a refined atmosphere.",
    terminal: "Terminal 2E",
    images: [
      "https://images.unsplash.com/photo-1634704784915-aacf363b021f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1561501878-aabd62634533?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    amenities: ["French Cuisine", "Wine Selection", "Luxury Showers", "Magazines & Newspapers", "Business Facilities", "Quiet Zones"],
    openingHours: {
      open: "05:00",
      close: "22:00"
    },
    price: 70,
    currency: "EUR",
    rating: 4.6
  },
  {
    id: "5",
    airportId: "5",
    name: "Garden Terrace Lounge",
    description: "An oasis of tranquility featuring indoor gardens, water features, and a blend of Eastern and Western hospitality.",
    terminal: "Terminal 3",
    images: [
      "https://images.unsplash.com/photo-1604933834372-3679a3f70f06?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    amenities: ["Plant-Based Menu Options", "Tea Ceremony", "Wellness Area", "Entertainment Systems", "Nap Rooms", "Family Zone"],
    openingHours: {
      open: "00:00",
      close: "23:59"
    },
    price: 90,
    currency: "SGD",
    rating: 4.9
  }
];

// Helper functions
export const getAirportById = (id: string): Airport | undefined => {
  return airports.find(airport => airport.id === id);
};

export const getLoungeById = (id: string): Lounge | undefined => {
  return lounges.find(lounge => lounge.id === id);
};

export const getLoungesByAirportId = (airportId: string): Lounge[] => {
  return lounges.filter(lounge => lounge.airportId === airportId);
};

export const searchAirports = (query: string): Airport[] => {
  const lowercaseQuery = query.toLowerCase();
  return airports.filter(airport => 
    airport.name.toLowerCase().includes(lowercaseQuery) || 
    airport.code.toLowerCase().includes(lowercaseQuery) || 
    airport.city.toLowerCase().includes(lowercaseQuery) || 
    airport.country.toLowerCase().includes(lowercaseQuery)
  );
};

export const formatCurrency = (price: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(price);
};

export const generateBookingId = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};
