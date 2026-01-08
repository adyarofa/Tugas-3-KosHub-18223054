'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { accommodationApi, bookingApi, accommodationAuthApi } from '../lib/api';
import type { Accommodation, Booking } from '../types';
import { Building2, MapPin, DollarSign, Users, Calendar, LogIn, UserPlus, ExternalLink, X, AlertCircle, ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AccommodationsPage() {
  const router = useRouter();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [bookingDates, setBookingDates] = useState({
    start_date: '',
    end_date: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [showMyBookings, setShowMyBookings] = useState(false);

  const [isAccommodationAuth, setIsAccommodationAuth] = useState(false);
  const [accommodationUser, setAccommodationUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
  });

  useEffect(() => {
    const isAuth = accommodationAuthApi.isAuthenticated();
    setIsAccommodationAuth(isAuth);
    if (isAuth) {
      setAccommodationUser(accommodationAuthApi.getUser());
      fetchUserBookings();
      fetchAccommodations(); // Only fetch accommodations when authenticated
    } else {
      setLoading(false); // Stop loading if not authenticated
    }

    // Auto-logout when leaving this page
    return () => {
      // Cleanup function runs when component unmounts (user navigates away)
      if (accommodationAuthApi.isAuthenticated()) {
        accommodationAuthApi.clearAuth();
      }
    };
  }, []);

  const fetchAccommodations = async (showLoading = true) => {
    console.log('🏠 fetchAccommodations called, showLoading:', showLoading);
    console.log('🔑 Token exists:', !!accommodationAuthApi.getToken());
    console.log('👤 User:', accommodationAuthApi.getUser());

    if (showLoading) setLoading(true);
    setError('');
    try {
      console.log('📡 Calling accommodationApi.getAll()...');
      const data = await accommodationApi.getAll();
      console.log('✅ Accommodations received:', data);
      console.log('📊 Is array:', Array.isArray(data));
      console.log('📏 Length:', Array.isArray(data) ? data.length : 'not an array');

      setAccommodations(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('❌ Failed to load accommodations:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);

      if (accommodations.length === 0) {
        setError('Unable to load accommodations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const data = await bookingApi.getMyBookings();
      setUserBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const handleBooking = async (accommodation: Accommodation) => {
    if (!isAccommodationAuth) {
      setSelectedAccommodation(accommodation);
      setShowAuthModal(true);
      return;
    }

    setSelectedAccommodation(accommodation);
  };

  const handleAccommodationAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'login') {
        console.log('🔐 Attempting login...');
        const response = await accommodationAuthApi.login({
          email: authForm.email,
          password: authForm.password,
        });
        console.log('✅ Login response:', response);
        console.log('🎫 Token:', response.access_token);

        accommodationAuthApi.saveAuth(response.access_token, response.user);
        console.log('💾 Token saved to localStorage');

        setIsAccommodationAuth(true);
        setAccommodationUser(response.user);
        fetchUserBookings();
        fetchAccommodations(); // Fetch accommodations after login
      } else {
        console.log('📝 Attempting register...');
        const response = await accommodationAuthApi.register({
          email: authForm.email,
          password: authForm.password,
          name: authForm.name,
        });
        console.log('✅ Register response:', response);
        console.log('🎫 Token:', response.access_token);

        accommodationAuthApi.saveAuth(response.access_token, response.user);
        console.log('💾 Token saved to localStorage');

        setIsAccommodationAuth(true);
        setAccommodationUser(response.user);
        fetchUserBookings();
        fetchAccommodations(); // Fetch accommodations after register
      }
      setShowAuthModal(false);
      setAuthForm({ email: '', password: '', name: '' });
      // Keep selectedAccommodation so user can continue booking
    } catch (err: any) {
      setAuthError(err.response?.data?.message || err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogoutAccommodation = () => {
    accommodationAuthApi.clearAuth();
    setIsAccommodationAuth(false);
    setAccommodationUser(null);
  };

  const submitBooking = async () => {
    if (!selectedAccommodation) return;

    if (!bookingDates.start_date || !bookingDates.end_date) {
      alert('Please select both start and end dates');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingApi.create({
        accommodation_id: selectedAccommodation.accommodation_id,
        start_date: bookingDates.start_date,
        end_date: bookingDates.end_date,
      });
      setShowSuccessModal(true);
      setSelectedAccommodation(null);
      setBookingDates({ start_date: '', end_date: '' });
      fetchUserBookings(); // Refresh bookings
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateDiscount = (price: number) => {
    const discountRate = accommodationUser?.discount_rate || 0;
    const discount = price * discountRate;
    return { discount, finalPrice: price - discount };
  };

  const handleLogoutAndExit = () => {
    accommodationAuthApi.clearAuth();
    setIsAccommodationAuth(false);
    setAccommodationUser(null);
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePayBooking = async (bookingId: number, accommodationId: number) => {
    try {
      await bookingApi.updateStatus(bookingId, 'SUCCESS', accommodationId);
      fetchUserBookings();
    } catch (error) {
      console.error('Failed to pay booking:', error);
      alert('Failed to process payment');
    }
  };

  const handleCancelBooking = async (bookingId: number, accommodationId: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingApi.updateStatus(bookingId, 'CANCELLED', accommodationId);
        fetchUserBookings();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading accommodations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleLogoutAndExit}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Main Services
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <ExternalLink size={16} />
            External Partner Service
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Accommodations</h1>
          <p className="text-xl text-gray-600 mb-4">Find your perfect kos from our partner service</p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            This service connects to our partner's accommodation booking system.
            You'll need to login/register separately to make bookings.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          {isAccommodationAuth ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {accommodationUser?.name?.[0]?.toUpperCase() || accommodationUser?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Logged in to Accommodation Service</p>
                    <p className="text-sm text-green-600">{accommodationUser?.email}</p>
                    {accommodationUser?.membership_level && accommodationUser.membership_level !== 'BASIC' && (
                      <span className="inline-block mt-1 bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {accommodationUser.membership_level} - {(accommodationUser.discount_rate || 0) * 100}% discount
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogoutAccommodation}
                  className="text-green-700 hover:text-green-900 text-sm font-medium"
                >
                  Logout
                </button>
              </div>

              {/* My Bookings Button */}
              <button
                onClick={() => setShowMyBookings(!showMyBookings)}
                className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Building2 size={18} />
                {showMyBookings ? 'Browse Accommodations' : 'My Bookings'}
              </button>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="font-semibold text-amber-800">Login Required for Booking</p>
                  <p className="text-sm text-amber-700 mt-1">
                    To book accommodations, you need to login or register with our partner's accommodation service.
                    This is separate from your KosHub Living Support account.
                  </p>
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setAuthMode('login');
                    }}
                    className="mt-3 inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
                  >
                    <LogIn size={16} />
                    Login to Accommodation Service
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchAccommodations()}
              className="ml-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* My Bookings Section */}
        {showMyBookings && isAccommodationAuth && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
            {userBookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Building2 className="mx-auto text-gray-400 mb-4" size={64} />
                <p className="text-xl text-gray-600 mb-2">No bookings yet</p>
                <p className="text-sm text-gray-500">
                  Browse accommodations and make your first booking!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userBookings.map((booking) => (
                  <div
                    key={booking.booking_id}
                    className={`border rounded-lg p-6 ${booking.status === 'PENDING'
                      ? 'border-yellow-300 bg-yellow-50'
                      : booking.status === 'SUCCESS'
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            Booking #{booking.booking_id}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status === 'SUCCESS' && <CheckCircle size={14} />}
                            {booking.status === 'PENDING' && <Clock size={14} />}
                            {booking.status === 'CANCELLED' && <XCircle size={14} />}
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Accommodation ID: {booking.accommodation_id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">
                          Rp {booking.final_price?.toLocaleString() || '0'}
                        </p>
                        {booking.discount_applied > 0 && (
                          <p className="text-xs text-green-600">
                            Saved Rp {booking.discount_applied.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span>
                        Check-in: {format(new Date(booking.start_date), 'MMM dd, yyyy')}
                      </span>
                      <span>→</span>
                      <span>
                        Check-out: {format(new Date(booking.end_date), 'MMM dd, yyyy')}
                      </span>
                    </div>

                    {booking.status === 'PENDING' && (
                      <div className="flex gap-3 pt-4 border-t border-yellow-200">
                        <button
                          onClick={() => handlePayBooking(booking.booking_id, booking.accommodation_id)}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} />
                          Pay Now
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.booking_id, booking.accommodation_id)}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <XCircle size={18} />
                          Cancel
                        </button>
                      </div>
                    )}

                    {booking.status === 'SUCCESS' && (
                      <div className="pt-4 border-t border-green-200">
                        <p className="text-sm text-green-700 flex items-center gap-2">
                          <CheckCircle size={16} />
                          Payment completed - Your booking is confirmed!
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Accommodations List - Hidden when showing My Bookings */}
        {!showMyBookings && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accommodations.map((accommodation) => {
                const { discount, finalPrice } = calculateDiscount(accommodation.price);
                return (
                  <div
                    key={accommodation.accommodation_id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <Building2 className="text-white" size={64} />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {accommodation.name}
                      </h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin size={16} className="mr-2" />
                          <span className="text-sm">{accommodation.address}, {accommodation.city}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users size={16} className="mr-2" />
                          <span className="text-sm">
                            {accommodation.available_units} / {accommodation.total_units} units available
                          </span>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex items-baseline gap-2 mb-2">
                          <DollarSign size={20} className="text-primary-600" />
                          {discount > 0 ? (
                            <>
                              <span className="text-gray-400 line-through text-lg">
                                Rp {accommodation.price.toLocaleString()}
                              </span>
                              <span className="text-2xl font-bold text-primary-600">
                                Rp {finalPrice.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-primary-600">
                              Rp {accommodation.price.toLocaleString()}
                            </span>
                          )}
                          <span className="text-gray-500 text-sm">/ month</span>
                        </div>
                        {discount > 0 && (
                          <p className="text-sm text-green-600 font-semibold mb-4">
                            You save Rp {discount.toLocaleString()}!
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleBooking(accommodation)}
                        disabled={accommodation.available_units === 0}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {accommodation.available_units === 0 ? (
                          'Fully Booked'
                        ) : !isAccommodationAuth ? (
                          <>
                            <LogIn size={18} />
                            Login to Book
                          </>
                        ) : (
                          'Book Now'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {accommodations.length === 0 && !loading && (
              <div className="text-center py-12">
                <Building2 className="mx-auto text-gray-400 mb-4" size={64} />
                {!isAccommodationAuth ? (
                  <>
                    <p className="text-xl text-gray-600 mb-2">Login Required</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Please login to browse available accommodations
                    </p>
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setAuthMode('login');
                      }}
                      className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                      <LogIn size={18} />
                      Login to Browse
                    </button>
                  </>
                ) : (
                  <p className="text-xl text-gray-600">No accommodations available at the moment</p>
                )}
              </div>
            )}
          </>
        )}

        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-8 relative">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError('');
                  setAuthForm({ email: '', password: '', name: '' });
                  if (!isAccommodationAuth) {
                    setSelectedAccommodation(null);
                  }
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Building2 className="text-primary-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {authMode === 'login' ? 'Login to Accommodation Service' : 'Register for Accommodation Service'}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  This is our partner's booking system with separate authentication
                </p>
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAccommodationAuth} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : authMode === 'login' ? (
                    <>
                      <LogIn size={18} />
                      Login
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Register
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {authMode === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        onClick={() => {
                          setAuthMode('register');
                          setAuthError('');
                        }}
                        className="text-primary-600 font-semibold hover:underline"
                      >
                        Register here
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => {
                          setAuthMode('login');
                          setAuthError('');
                        }}
                        className="text-primary-600 font-semibold hover:underline"
                      >
                        Login here
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedAccommodation && isAccommodationAuth && !showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Book {selectedAccommodation.name}</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={bookingDates.start_date}
                    onChange={(e) => setBookingDates({ ...bookingDates, start_date: e.target.value })}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={bookingDates.end_date}
                    onChange={(e) => setBookingDates({ ...bookingDates, end_date: e.target.value })}
                    min={bookingDates.start_date || format(new Date(), 'yyyy-MM-dd')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold">Rp {selectedAccommodation.price.toLocaleString()}</span>
                  </div>
                  {calculateDiscount(selectedAccommodation.price).discount > 0 && (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Discount:</span>
                        <span className="text-green-600 font-semibold">
                          - Rp {calculateDiscount(selectedAccommodation.price).discount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-bold">Final Price:</span>
                        <span className="font-bold text-primary-600">
                          Rp {calculateDiscount(selectedAccommodation.price).finalPrice.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedAccommodation(null);
                    setBookingDates({ start_date: '', end_date: '' });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBooking}
                  disabled={bookingLoading}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400"
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <span className="inline-block bg-green-100 text-green-600 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-green-700">Booking Successful!</h3>
              <p className="text-gray-700 mb-4">Your accommodation has been booked successfully.</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
