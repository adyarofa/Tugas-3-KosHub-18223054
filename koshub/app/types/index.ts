import { UUID } from "crypto";

export interface User {
  id: UUID;
  email: string;
  name: string;
  membership_level: 'BASIC' | 'SILVER' | 'GOLD';
  discount_rate: number;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  membership_level?: 'BASIC' | 'SILVER' | 'GOLD';
}

export interface Accommodation {
  accommodation_id: number;
  name: string;
  address: string;
  city: string;
  price: number;
  total_units: number;
  available_units: number;
  created_at?: string;
}

export interface Booking {
  booking_id: number;
  accommodation_id: number;
  user_id: string;
  base_price: number;
  discount_applied: number;
  final_price: number;
  start_date: string;
  end_date: string;
  status: 'PENDING' | 'SUCCESS' | 'CANCELLED';
  created_at?: string;
}

export interface CreateBookingData {
  accommodation_id: number;
  start_date: string;
  end_date: string;
}

export interface LaundryService {
  id: number;
  user_id: string;
  booking_id: number;
  service_type: 'wash' | 'wash_iron' | 'dry_clean' | 'iron_only';
  weight: number;
  pickup_date: string;
  pickup_time: string;
  delivery_date?: string;
  delivery_time?: string;
  total_price: number;
  notes?: string;
  status: 'pending' | 'picked_up' | 'in_progress' | 'ready' | 'delivered' | 'cancelled';
  created_at?: string;
}

export interface CreateLaundryData {
  service_type: 'wash' | 'wash_iron' | 'dry_clean' | 'iron_only';
  weight: number;
  pickup_date: string;
  pickup_time: string;
  notes?: string;
}

export const LAUNDRY_PRICES = {
  wash: 5000,
  wash_iron: 7000,
  dry_clean: 15000,
  iron_only: 3000,
};

export const LAUNDRY_SERVICE_NAMES = {
  wash: 'Cuci Saja',
  wash_iron: 'Cuci + Setrika',
  dry_clean: 'Dry Clean',
  iron_only: 'Setrika Saja',
};

export interface MenuItem {
  name: string;
  price: number;
}

export interface CateringMenu {
  breakfast: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
  snack: MenuItem[];
}

export interface CateringOrder {
  id: number;
  user_id: string;
  booking_id: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  menu_name: string;
  quantity: number;
  delivery_date: string;
  delivery_time: string;
  total_price: number;
  delivery_address?: string;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'on_delivery' | 'delivered' | 'cancelled';
  created_at?: string;
}

export interface CreateCateringData {
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  menu_name: string;
  quantity: number;
  delivery_date: string;
  delivery_time: string;
  delivery_address?: string;
  special_requests?: string;
}

// Notification Types
export interface Notification {
  id: number;
  user_id: string;
  type: 'catering' | 'laundry' | 'booking' | 'system';
  reference_id?: number;
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}
