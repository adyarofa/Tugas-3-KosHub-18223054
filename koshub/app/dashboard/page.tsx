'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import { laundryApi, cateringApi, bookingApi, accommodationAuthApi } from '../lib/api';
import type { LaundryService, CateringOrder, Booking } from '../types';
import { Shirt, UtensilsCrossed, Building2, Clock, CheckCircle, XCircle, Package, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [laundryOrders, setLaundryOrders] = useState<LaundryService[]>([]);
  const [cateringOrders, setCateringOrders] = useState<CateringOrder[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'laundry' | 'catering'>('laundry');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchAllData();
  }, [isAuthenticated, router]);

  const fetchAllData = async () => {
    try {
      const [laundryData, cateringData] = await Promise.all([
        laundryApi.getAll(),
        cateringApi.getAll(),
      ]);
      setLaundryOrders(Array.isArray(laundryData) ? laundryData : []);
      setCateringOrders(Array.isArray(cateringData) ? cateringData : []);

      // Fetch bookings by user ID from accommodation service
      try {
        const accommodationUser = accommodationAuthApi.getUser();
        if (accommodationUser?.id) {
          const bookingData = await bookingApi.getById(accommodationUser.id);
          setBookings(Array.isArray(bookingData) ? bookingData : bookingData ? [bookingData] : []);
        }
      } catch (error) {
        console.log('Bookings not available (external service)');
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
      case 'success':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'pending':
      case 'processing':
      case 'preparing':
        return <Clock className="text-yellow-500" size={18} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={18} />;
      default:
        return <Package className="text-blue-500" size={18} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const totalLaundry = laundryOrders.length;
  const totalCatering = cateringOrders.length;
  const pendingOrders = [...laundryOrders, ...cateringOrders].filter(
    o => o.status?.toLowerCase() === 'pending' || o.status?.toLowerCase() === 'processing'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-primary-100">Manage your laundry, catering orders, and more</p>
        </div>

        {/* Quick Stats - Living Support Focused */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Laundry Orders</p>
                <p className="text-3xl font-bold text-gray-900">{totalLaundry}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Shirt className="text-primary-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Catering Orders</p>
                <p className="text-3xl font-bold text-gray-900">{totalCatering}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <UtensilsCrossed className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Service Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Service Orders</h2>
            <Link
              href="/services"
              className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              Order New Service →
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('laundry')}
              className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'laundry'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Shirt size={18} className="inline mr-2" />
              Laundry ({totalLaundry})
            </button>
            <button
              onClick={() => setActiveTab('catering')}
              className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'catering'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <UtensilsCrossed size={18} className="inline mr-2" />
              Catering ({totalCatering})
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : activeTab === 'laundry' ? (
            // Laundry Orders
            laundryOrders.length === 0 ? (
              <div className="text-center py-12">
                <Shirt className="mx-auto text-gray-400 mb-4" size={64} />
                <p className="text-xl text-gray-600 mb-4">No laundry orders yet</p>
                <Link
                  href="/services/laundry"
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Order Laundry Service
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {laundryOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            Laundry #{order.id}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {order.service_type} • {order.weight || 0} kg
                        </p>
                      </div>
                      <p className="text-lg font-bold text-primary-600">
                        Rp {(order.total_price || 0).toLocaleString()}
                      </p>
                    </div>
                    {order.pickup_date && (
                      <p className="text-sm text-gray-500">
                        Pickup: {format(new Date(order.pickup_date), 'MMM dd, yyyy')}
                        {order.pickup_time && ` at ${order.pickup_time}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            // Catering Orders
            cateringOrders.length === 0 ? (
              <div className="text-center py-12">
                <UtensilsCrossed className="mx-auto text-gray-400 mb-4" size={64} />
                <p className="text-xl text-gray-600 mb-4">No catering orders yet</p>
                <Link
                  href="/services/catering"
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Order Catering Service
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cateringOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            Catering #{order.id}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {order.meal_type} • Qty: {order.quantity || 1}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-primary-600">
                        Rp {(order.total_price || 0).toLocaleString()}
                      </p>
                    </div>
                    {order.delivery_date && (
                      <p className="text-sm text-gray-500">
                        Delivery: {format(new Date(order.delivery_date), 'MMM dd, yyyy')}
                        {order.delivery_time && ` at ${order.delivery_time}`}
                      </p>
                    )}
                    {order.special_requests && (
                      <p className="text-sm text-gray-500 mt-1">
                        Note: {order.special_requests}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Secondary Section - Accommodation Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">Accommodation Bookings</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <ExternalLink size={14} />
                External Service
              </span>
            </div>
            <Link
              href="/accommodations"
              className="text-gray-600 font-semibold hover:text-gray-800 transition-colors"
            >
              Browse Kos →
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Building2 className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-600 mb-2">No accommodation bookings</p>
              <p className="text-sm text-gray-500">
                Browse and book kos through our partner service
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.booking_id}
                  className={`border rounded-lg p-5 ${booking.status === 'PENDING'
                    ? 'border-yellow-300 bg-yellow-50'
                    : booking.status === 'SUCCESS'
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200'
                    }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          Booking #{booking.booking_id}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(booking.status)}`}
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

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>
                      Check-in: {format(new Date(booking.start_date), 'MMM dd, yyyy')}
                    </span>
                    <span>→</span>
                    <span>
                      Check-out: {format(new Date(booking.end_date), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  {booking.status === 'PENDING' && (
                    <div className="flex gap-3 pt-3 border-t border-yellow-200">
                      <button
                        onClick={async () => {
                          try {
                            await bookingApi.updateStatus(booking.booking_id, 'SUCCESS', booking.accommodation_id);
                            fetchAllData();
                          } catch (error) {
                            console.error('Failed to pay booking:', error);
                            alert('Failed to process payment');
                          }
                        }}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Pay Now
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to cancel this booking?')) {
                            try {
                              await bookingApi.updateStatus(booking.booking_id, 'CANCELLED', booking.accommodation_id);
                              fetchAllData();
                            } catch (error) {
                              console.error('Failed to cancel booking:', error);
                              alert('Failed to cancel booking');
                            }
                          }
                        }}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <XCircle size={18} />
                        Cancel
                      </button>
                    </div>
                  )}

                  {booking.status === 'SUCCESS' && (
                    <div className="pt-3 border-t border-green-200">
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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/services/laundry"
            className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-white"
          >
            <Shirt size={32} className="mb-3" />
            <h3 className="text-xl font-bold mb-2">Order Laundry</h3>
            <p className="text-primary-100 mb-4">
              Professional laundry service with pickup & delivery
            </p>
            <span className="font-semibold">Order Now →</span>
          </Link>
          <Link
            href="/services/catering"
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-white"
          >
            <UtensilsCrossed size={32} className="mb-3" />
            <h3 className="text-xl font-bold mb-2">Order Catering</h3>
            <p className="text-orange-100 mb-4">
              Delicious meals delivered fresh to your door
            </p>
            <span className="font-semibold">Browse Menu →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}