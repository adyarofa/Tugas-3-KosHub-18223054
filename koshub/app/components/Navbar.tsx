'use client';

import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import { Home, Building2, ShoppingBag, User, LogOut, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { notificationApi } from '../lib/api';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const { unread_count } = await notificationApi.getUnreadCount();
      setUnreadCount(unread_count);
    } catch (error) {
      setUnreadCount(0);
    }
  };

  return (
    <nav className="sticky top-0 z-50 shadow-lg bg-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/image.png"
              alt="KosHub Logo"
              className="h-20 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors font-medium"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/services"
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors font-medium"
                >
                  <ShoppingBag size={18} />
                  <span>Services</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors font-medium"
                >
                  <User size={18} />
                  <span>Dashboard</span>
                </Link>
              </>
            )}
            <Link
              href="/accommodations"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors font-medium"
            >
              <Building2 size={18} />
              <span>Accommodations</span>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/notifications"
                  className="relative p-2 text-white/90 hover:text-white transition-colors"
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2" style={{ backgroundColor: '#ff2056', color: 'white', borderColor: '#8b0836' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-rose-200">{user?.membership_level || 'BASIC'}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-5 py-2.5 text-white font-medium hover:bg-white/10 rounded-lg transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2.5 bg-white text-primary-900 font-semibold rounded-lg hover:bg-rose-50 transition-all shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
