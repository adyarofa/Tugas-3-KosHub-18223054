'use client';

import Link from 'next/link';
import { Shirt, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ServicesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-primary-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Living Support Services
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need for comfortable kos living
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Laundry Service Card */}
          <Link
            href="/services/laundry"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-primary-300"
          >
            <div className="w-20 h-20 bg-linear-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shirt className="text-white" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Laundry Service</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Professional laundry services with multiple options. We pick up, clean, and deliver
              your clothes right to your door.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                <span>Wash Only - Rp 5,000/kg</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                <span>Wash + Iron - Rp 7,000/kg</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                <span>Dry Clean - Rp 15,000/kg</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                <span>Iron Only - Rp 3,000/kg</span>
              </div>
            </div>
            <div className="flex items-center text-primary-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              <span>Order Laundry Service</span>
              <ArrowRight size={20} />
            </div>
          </Link>

          {/* Catering Service Card */}
          <Link
            href="/services/catering"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-primary-300"
          >
            <div className="w-20 h-20 bg-linear-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="text-white" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Catering Service</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Delicious Indonesian meals delivered fresh to your kos. Order breakfast, lunch,
              dinner, or snacks with ease.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                <span>Breakfast - from Rp 10,000</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                <span>Lunch & Dinner - from Rp 15,000</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                <span>Snacks - from Rp 8,000</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                <span>Custom delivery schedule</span>
              </div>
            </div>
            <div className="flex items-center text-primary-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              <span>Browse Menu & Order</span>
              <ArrowRight size={20} />
            </div>
          </Link>
        </div>

        {/* Information Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Place Your Order</h4>
              <p className="text-gray-600 text-sm">
                Select your service, choose your preferences, and schedule pickup or delivery
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Track Your Order</h4>
              <p className="text-gray-600 text-sm">
                Receive real-time notifications and track your order status in the dashboard
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Enjoy Your Service</h4>
              <p className="text-gray-600 text-sm">
                Receive your clean laundry or fresh meal right at your door
              </p>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-8 max-w-5xl mx-auto">
          <div className="bg-primary-50 border-l-4 border-primary-600 p-4 rounded">
            <p className="text-primary-900">
              <span className="font-semibold">Tip:</span> Order laundry and catering services to make your kos living easier!
              Track all your orders from the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
