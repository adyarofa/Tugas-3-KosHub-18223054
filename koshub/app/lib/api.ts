import axios from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  Accommodation,
  Booking,
  CreateBookingData,
  LaundryService,
  CreateLaundryData,
  CateringOrder,
  CreateCateringData,
  CateringMenu,
  Notification,
} from '../types';
import { UUID } from 'crypto';

const ACCOMMODATION_API = process.env.NEXT_PUBLIC_ACCOMMODATION_API || 'http://localhost:3000';
const LIVING_SUPPORT_API = process.env.NEXT_PUBLIC_LIVING_SUPPORT_API || 'http://localhost:3010';

const accommodationAxios = axios.create({
  baseURL: ACCOMMODATION_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

const livingSupportAxios = axios.create({
  baseURL: LIVING_SUPPORT_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

livingSupportAxios.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

livingSupportAxios.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    if (error.response?.status !== 401) {
      console.error('Living Support Error:', error.response?.status, error.config?.url);
    }
    return Promise.reject(error);
  }
);

accommodationAxios.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('accommodation_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

accommodationAxios.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    if (error.response?.status !== 401) {
      console.error('Accommodation Error:', error.response?.status, error.config?.url);
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await livingSupportAxios.post('/auth/login', credentials);
    return {
      access_token: data.access_token,
      expires_in: data.expires_in || 3600,
      user: data.user,
    };
  },

  register: async (registerData: RegisterData): Promise<AuthResponse> => {
    const { data } = await livingSupportAxios.post('/auth/register', registerData);
    return {
      access_token: data.session?.access_token || data.access_token,
      expires_in: data.session?.expires_in || data.expires_in || 3600,
      user: data.user,
    };
  },

  changePassword: async (newPassword: string): Promise<{ message: string }> => {
    const { data } = await livingSupportAxios.put('/auth/change-password', {
      new_password: newPassword,
    });
    return data;
  },
};

export const accommodationAuthApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await accommodationAxios.post('/auth/login', credentials);
    if (data.session && data.session.access_token) {
      return {
        access_token: data.session.access_token,
        expires_in: data.session.expires_in || 3600,
        user: data.session.user,
      };
    }
    return data;
  },

  register: async (registerData: RegisterData): Promise<AuthResponse> => {
    const { data } = await accommodationAxios.post('/auth/register', registerData);
    if (data.session && data.session.access_token) {
      return {
        access_token: data.session.access_token,
        expires_in: data.session.expires_in || 3600,
        user: data.session.user,
      };
    }
    return data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accommodation_token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('accommodation_token');
  },

  saveAuth: (token: string, user: any) => {
    localStorage.setItem('accommodation_token', token);
    localStorage.setItem('accommodation_user', JSON.stringify(user));
  },

  clearAuth: () => {
    localStorage.removeItem('accommodation_token');
    localStorage.removeItem('accommodation_user');
  },

  getUser: () => {
    const userData = localStorage.getItem('accommodation_user');
    return userData ? JSON.parse(userData) : null;
  },
};

export const userApi = {
  getById: async (userId: UUID): Promise<User> => {
    const { data } = await accommodationAxios.get(`/users/${userId}`);
    return data;
  },
};

export const accommodationApi = {
  getAll: async (): Promise<Accommodation[]> => {
    const { data } = await accommodationAxios.get('/accommodations');
    return data;
  },

  getById: async (id: number): Promise<Accommodation> => {
    const { data } = await accommodationAxios.get(`/accommodations/${id}`);
    return data;
  },

  create: async (accommodation: Omit<Accommodation, 'accommodation_id'>): Promise<Accommodation> => {
    const { data } = await accommodationAxios.post('/accommodations', accommodation);
    return data;
  },

  update: async (id: number, accommodation: Partial<Accommodation>): Promise<Accommodation> => {
    const { data } = await accommodationAxios.put(`/accommodations/${id}`, accommodation);
    return data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const { data } = await accommodationAxios.delete(`/accommodations/${id}`);
    return data;
  },
};

export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    const { data } = await accommodationAxios.get('/bookings');
    return data;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const { data } = await accommodationAxios.get('/bookings');
    return data;
  },

  getById: async (id: UUID): Promise<Booking> => {
    const { data } = await accommodationAxios.get(`/bookings/${id}`);
    return data;
  },

  create: async (bookingData: CreateBookingData): Promise<Booking> => {
    const { data } = await accommodationAxios.post('/bookings', bookingData);
    return data;
  },

  updateStatus: async (
    id: number,
    status: 'PENDING' | 'SUCCESS' | 'CANCELLED',
    accommodationId: number
  ): Promise<Booking> => {
    const { data } = await accommodationAxios.put(
      `/bookings/${id}`,
      { status, accommodation_id: accommodationId }
    );
    return data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const { data } = await accommodationAxios.delete(`/bookings/${id}`);
    return data;
  },
};

// ============= Laundry Service API =============
export const laundryApi = {
  getAll: async (): Promise<LaundryService[]> => {
    const { data } = await livingSupportAxios.get('/api/laundry');
    return data;
  },

  getById: async (id: number): Promise<LaundryService> => {
    const { data } = await livingSupportAxios.get(`/api/laundry/${id}`);
    return data;
  },

  createOrder: async (laundryData: CreateLaundryData & { booking_id: number }): Promise<LaundryService> => {
    const { data } = await livingSupportAxios.post('/api/laundry', laundryData);
    return data;
  },

  create: async (laundryData: CreateLaundryData): Promise<LaundryService> => {
    const { data } = await livingSupportAxios.post('/api/laundry', laundryData);
    return data;
  },

  update: async (id: number, updateData: Partial<CreateLaundryData>): Promise<LaundryService> => {
    const { data } = await livingSupportAxios.put(`/api/laundry/${id}`, updateData);
    return data;
  },

  updateStatus: async (
    id: number,
    status: LaundryService['status'],
    delivery_date?: string,
    delivery_time?: string
  ): Promise<LaundryService> => {
    const { data } = await livingSupportAxios.put(`/api/laundry/${id}/status`, {
      status,
      delivery_date,
      delivery_time,
    });
    return data;
  },

  cancel: async (id: number): Promise<{ message: string }> => {
    const { data } = await livingSupportAxios.delete(`/api/laundry/${id}`);
    return data;
  },
};

export const cateringApi = {
  getMenu: async (): Promise<CateringMenu> => {
    console.log('Fetching menu from:', LIVING_SUPPORT_API + '/api/catering/menu');
    const { data } = await livingSupportAxios.get('/api/catering/menu');
    console.log('Raw menu response:', data);
    const menu = data.menu || data;
    console.log('Extracted menu:', menu);
    return menu;
  },

  getAll: async (): Promise<CateringOrder[]> => {
    const { data } = await livingSupportAxios.get('/api/catering');
    return data;
  },

  getById: async (id: number): Promise<CateringOrder> => {
    const { data } = await livingSupportAxios.get(`/api/catering/${id}`);
    return data;
  },

  createOrder: async (cateringData: CreateCateringData & { booking_id: number }): Promise<CateringOrder> => {
    const { data } = await livingSupportAxios.post('/api/catering', cateringData);
    return data;
  },

  create: async (cateringData: CreateCateringData): Promise<CateringOrder> => {
    const { data } = await livingSupportAxios.post('/api/catering', cateringData);
    return data;
  },

  update: async (id: number, updateData: Partial<CreateCateringData>): Promise<CateringOrder> => {
    const { data } = await livingSupportAxios.put(`/api/catering/${id}`, updateData);
    return data;
  },

  updateStatus: async (id: number, status: CateringOrder['status']): Promise<CateringOrder> => {
    const { data } = await livingSupportAxios.put(`/api/catering/${id}/status`, { status });
    return data;
  },

  cancel: async (id: number): Promise<{ message: string }> => {
    const { data } = await livingSupportAxios.delete(`/api/catering/${id}`);
    return data;
  },
};

export const notificationApi = {
  getAll: async (isRead?: boolean, limit = 50): Promise<Notification[]> => {
    const params: any = { limit };
    if (isRead !== undefined) {
      params.is_read = isRead;
    }
    const { data } = await livingSupportAxios.get('/api/notifications', { params });
    return data;
  },

  getUnreadCount: async (): Promise<{ unread_count: number }> => {
    const { data } = await livingSupportAxios.get('/api/notifications/unread-count');
    return data;
  },

  markAsRead: async (id: number): Promise<Notification> => {
    const { data } = await livingSupportAxios.put(`/api/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const { data } = await livingSupportAxios.put('/api/notifications/read-all');
    return data;
  },
};
