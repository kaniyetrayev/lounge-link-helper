
import { 
  AirportsResponse, 
  AirlinesResponse, 
  Lounge,
  Benefit,
  FlightRegistrationInput,
  FlightRegistrationResponse,
  CustomerCreate,
  FlightSearchParams,
  FlightSearchResponse
} from './api-types';

const API_BASE_URL = 'https://appboxo.ngrok.io/api';

// Helper for common fetch options
const createFetchOptions = (method: string, body?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  // Add authentication if available
  const token = sessionStorage.getItem('apiToken');
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  return options;
};

// Generic fetch function with error handling
const fetchAPI = async <T>(endpoint: string, options: RequestInit): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `API request failed with status ${response.status}`
      );
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API endpoints
export const api = {
  // Airports
  getAirports: async (includeTerminals = false): Promise<AirportsResponse> => {
    const endpoint = `/airports/?terminals=${includeTerminals}`;
    return fetchAPI<AirportsResponse>(endpoint, createFetchOptions('GET'));
  },
  
  // Airlines
  getAirlines: async (): Promise<AirlinesResponse> => {
    return fetchAPI<AirlinesResponse>('/airlines/', createFetchOptions('GET'));
  },
  
  // Lounges
  getAllLounges: async (): Promise<Lounge[]> => {
    return fetchAPI<Lounge[]>('/lounges/all/', createFetchOptions('GET'));
  },
  
  searchLounges: async (params: {
    country?: string;
    city?: string;
    airport_name?: string;
    terminal?: string;
  }): Promise<Lounge[]> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return fetchAPI<Lounge[]>(
      `/lounges/search/?${queryParams.toString()}`,
      createFetchOptions('GET')
    );
  },
  
  // Flights
  searchFlights: async (params: FlightSearchParams): Promise<FlightSearchResponse> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return fetchAPI<FlightSearchResponse>(
      `/flights/search/?${queryParams.toString()}`,
      createFetchOptions('GET')
    );
  },
  
  validateFlight: async (flightCode: string, departureDate: string): Promise<any> => {
    const queryParams = new URLSearchParams({
      flight_code: flightCode,
      departure_date: departureDate,
    });
    
    return fetchAPI<any>(
      `/flights/validate/?${queryParams.toString()}`,
      createFetchOptions('GET')
    );
  },
  
  // Benefits
  getBenefits: async (
    flightCode: string,
    departureAirportCode: string,
    departureDate: string,
    proposition?: string
  ): Promise<Benefit[]> => {
    const queryParams = new URLSearchParams({
      flight_code: flightCode,
      departure_airport_code: departureAirportCode,
      departure_date: departureDate,
    });
    
    if (proposition) {
      queryParams.append('proposition', proposition);
    }
    
    return fetchAPI<Benefit[]>(
      `/benefits/?${queryParams.toString()}`,
      createFetchOptions('GET')
    );
  },
  
  // Customers
  createCustomer: async (data: CustomerCreate): Promise<{id: string; entitlement: string}> => {
    return fetchAPI<{id: string; entitlement: string}>(
      '/customers/',
      createFetchOptions('POST', data)
    );
  },
  
  getCustomerByReference: async (reference: string): Promise<any> => {
    return fetchAPI<any>(
      `/customers/by_reference/?reference=${reference}`,
      createFetchOptions('GET')
    );
  },
  
  // Flight registrations
  createFlightRegistration: async (data: FlightRegistrationInput): Promise<FlightRegistrationResponse> => {
    return fetchAPI<FlightRegistrationResponse>(
      '/flight-registrations/',
      createFetchOptions('POST', data)
    );
  },
  
  getFlightRegistration: async (id: string): Promise<any> => {
    return fetchAPI<any>(
      `/flight-registrations/${id}/`,
      createFetchOptions('GET')
    );
  },
  
  updateFlightRegistration: async (id: string, data: any): Promise<any> => {
    return fetchAPI<any>(
      `/flight-registrations/${id}/`,
      createFetchOptions('PUT', data)
    );
  },
  
  deleteFlightRegistration: async (id: string): Promise<void> => {
    await fetchAPI<void>(
      `/flight-registrations/${id}/`,
      createFetchOptions('DELETE')
    );
  },
};
