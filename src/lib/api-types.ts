
// API response types based on Swagger specification

export interface Airport {
  iata_code: string;
  code: string;
  name: string;
  country: string;
  terminals?: {
    code: string;
    name: string;
  }[];
}

export interface AirportsResponse {
  airports: Airport[];
}

export interface Airline {
  airline_code: string;
  airline_name: string;
}

export interface AirlinesResponse {
  airlines: Airline[];
}

export interface Lounge {
  lounge_name: string;
  lounge_code: string;
  airport_name: string;
  terminal: string | null;
  city: string;
  country: string;
  location: string | null;
  opening_hours: string;
  additional: string | null;
  conditions: string | null;
}

export interface Benefit {
  type: string;
  available: boolean;
  reason: string | null;
}

export interface FlightData {
  flight_code: string;
  departure_airport_code: string;
  arrival_airport_code: string;
  departure_date: string;
}

export interface MainPassenger {
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
}

export interface Passenger {
  title: string;
  first_name: string;
  last_name: string;
}

export interface FlightRegistrationInput {
  flight: FlightData;
  main_passenger: MainPassenger;
  additional_passengers?: Passenger[];
  culture_code?: string;
  primary_benefit?: string;
  alternative_benefit?: string;
}

export interface CustomerCreate {
  customer_reference: string;
  proposition?: string;
}

export interface FlightRegistrationResponse {
  id: string;
  remaining_entitlement?: number;
}

export interface FlightSearchParams {
  departure_airport_code: string;
  arrival_airport_code: string;
  departure_date: string;
  airline_code?: string;
}

export interface Flight {
  airline_code: string;
  flight_number: string;
  departure_terminal: string;
  departure_datetime_utc: string;
  departure_time_utc_offset: string;
  arrival_terminal: string;
  arrival_datetime_utc: string;
  arrival_time_utc_offset: string;
}

export interface FlightSearchResponse {
  departure_airport_code: string;
  departure_airport_name: string;
  arrival_airport_code: string;
  arrival_airport_name: string;
  flights: Flight[];
}
