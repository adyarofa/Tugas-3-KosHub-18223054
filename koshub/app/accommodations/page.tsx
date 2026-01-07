'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { accommodationApi, bookingApi, accommodationAuthApi } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import type { Accommodation } from '../types';
import { Building2, MapPin, DollarSign, Users, Calendar, LogIn, UserPlus, ExternalLink, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AccommodationsPage() {
  const router = useRouter();
  const { isAuthenticated: isLivingSupportAuth } = useAuth();
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
    fetchAccommodations();
    const isAuth = accommodationAuthApi.isAuthenticated();
    setIsAccommodationAuth(isAuth);
    if (isAuth) {
      setAccommodationUser(accommodationAuthApi.getUser());
    }
  }, []);

  const fetchAccommodations = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError('');
    try {
      const data = await accommodationApi.getAll();
      setAccommodations(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load accommodations:', err);
      if (accommodations.length === 0) {
        setError('Unable to load accommodations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (accommodation: Accommodation) => {
    if (!isLivingSupportAuth) {
      router.push('/auth/login?redirect=/accommodations');
      return;
    }

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
        const response = await accommodationAuthApi.login({
          email: authForm.email,
          password: authForm.password,
        });
        accommodationAuthApi.saveAuth(response.access_token, response.user);
        setIsAccommodationAuth(true);
        setAccommodationUser(response.user);
      } else {
        const response = await accommodationAuthApi.register({
          email: authForm.email,
          password: authForm.password,
          name: authForm.name,
        });
        accommodationAuthApi.saveAuth(response.access_token, response.user);
        setIsAccommodationAuth(true);
        setAccommodationUser(response.user);
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
            <p className="text-xl text-gray-600">No accommodations available at the moment</p>
          </div>
        )}
      </div>

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
  );
}
