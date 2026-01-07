'use client';

import Link from 'next/link';
import { Building2, Shirt, UtensilsCrossed, Bell, Shield, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from './lib/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">KosHub</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Your complete living support platform for comfortable kos living
          </p>
          <p className="text-lg text-primary-600 font-medium mb-8">
            Catering • Laundry • Accommodation Booking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth/register"
                  className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold text-lg"
                >
                  Explore Services
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/services"
                  className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg"
                >
                  Order Services
                </Link>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold text-lg"
                >
                  Go to Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Services Section - Laundry & Catering First */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Our Main Services
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Premium living support services to make your daily life easier and more comfortable
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Laundry - MAIN SERVICE */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
              Main Service
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <Shirt className="text-white" size={40} />
            </div>
            <h3 className="text-3xl font-bold mb-4">Laundry Service</h3>
            <p className="text-white/90 mb-6 text-lg">
              Professional laundry services delivered to your door. Choose from wash, iron,
              or dry clean options. Schedule pickup and delivery at your convenience.
            </p>
            <ul className="space-y-2 mb-6 text-white/80">
              <li>✓ Wash Only - Rp 5,000/kg</li>
              <li>✓ Wash + Iron - Rp 7,000/kg</li>
              <li>✓ Dry Clean - Rp 15,000/kg</li>
              <li>✓ Iron Only - Rp 3,000/kg</li>
            </ul>
            {isAuthenticated ? (
              <Link
                href="/services/laundry"
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Order Laundry Service →
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Login to Order →
              </Link>
            )}
          </div>

          {/* Catering - MAIN SERVICE */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
              Main Service
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <UtensilsCrossed className="text-white" size={40} />
            </div>
            <h3 className="text-3xl font-bold mb-4">Catering Service</h3>
            <p className="text-white/90 mb-6 text-lg">
              Delicious meals delivered fresh to your kos. Choose from breakfast, lunch, dinner,
              and snack options. Customize your orders with special requests.
            </p>
            <ul className="space-y-2 mb-6 text-white/80">
              <li>✓ Breakfast - from Rp 10,000</li>
              <li>✓ Lunch & Dinner - from Rp 15,000</li>
              <li>✓ Snacks - from Rp 8,000</li>
              <li>✓ Custom delivery schedule</li>
            </ul>
            {isAuthenticated ? (
              <Link
                href="/services/catering"
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Order Food →
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Login to Order →
              </Link>
            )}
          </div>
        </div>

        {/* Accommodation Booking - Secondary Service */}
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 max-w-3xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Building2 className="text-primary-600" size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">Accommodation Booking</h3>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <ExternalLink size={14} />
                  External Service
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Find and book your perfect kos with our partner accommodation service.
                Browse listings, compare prices, and get exclusive member discounts!
              </p>
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
                Note: Accommodation booking requires separate authentication as it connects to our partner service.
              </p>
              <Link
                href="/accommodations"
                className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                Browse Accommodations →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose KosHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Member Benefits</h3>
              <p className="text-gray-600">
                Enjoy exclusive discounts with SILVER (5%) and GOLD (10%) membership levels
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Clock className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Service</h3>
              <p className="text-gray-600">
                Access our platform anytime, anywhere. Track your orders in real-time
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Bell className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Notifications</h3>
              <p className="text-gray-600">
                Stay updated with real-time notifications for all your bookings and services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Built with Modern Architecture
          </h2>
          <p className="text-lg text-gray-600 mb-6 text-center max-w-3xl mx-auto">
            KosHub is designed using <span className="font-semibold text-primary-600">Domain-Driven Design (DDD)</span> principles
            with microservices architecture for scalability and maintainability.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Main Context - Living Support */}
            <div className="border-2 border-primary-500 rounded-lg p-6 bg-primary-50 relative">
              <span className="absolute -top-3 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Main System
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-3 mt-2">Living Support Services Context</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• User authentication & authorization</li>
                <li>• Laundry service management</li>
                <li>• Catering & food ordering</li>
                <li>• Real-time notifications</li>
                <li>• Order tracking & status updates</li>
              </ul>
            </div>
            {/* External Context - Accommodation */}
            <div className="border-2 border-gray-300 rounded-lg p-6 relative">
              <span className="absolute -top-3 left-4 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                External Partner
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-3 mt-2">Accommodation Booking Context</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Separate authentication system</li>
                <li>• Accommodation management</li>
                <li>• Booking system with discounts</li>
                <li>• Membership management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join KosHub today and experience seamless kos living
            </p>
            <Link
              href="/auth/register"
              className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              Create Your Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
