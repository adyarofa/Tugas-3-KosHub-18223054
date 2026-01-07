'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { notificationApi } from '../lib/api';
import type { Notification } from '../types';
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Shirt,
    UtensilsCrossed,
    Building2,
    Info,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function NotificationsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }
        fetchNotifications();
    }, [isAuthenticated, router, filter]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            let data: Notification[];

            if (filter === 'all') {
                data = await notificationApi.getAll();
            } else {
                data = await notificationApi.getAll(filter === 'unread' ? false : true);
            }

            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            setActionLoading(id);
            await notificationApi.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark as read:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            setActionLoading(-1);
            await notificationApi.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const getTypeIcon = (type: Notification['type']) => {
        switch (type) {
            case 'laundry':
                return <Shirt size={20} className="text-primary-600" />;
            case 'catering':
                return <UtensilsCrossed size={20} className="text-orange-600" />;
            case 'booking':
                return <Building2 size={20} className="text-blue-600" />;
            default:
                return <Info size={20} className="text-gray-600" />;
        }
    };

    const getSeverityIcon = (severity: Notification['severity']) => {
        switch (severity) {
            case 'success':
                return <CheckCircle size={16} className="text-green-500" />;
            case 'warning':
                return <AlertCircle size={16} className="text-yellow-500" />;
            case 'error':
                return <XCircle size={16} className="text-red-500" />;
            default:
                return <Info size={16} className="text-blue-500" />;
        }
    };

    const getSeverityBg = (severity: Notification['severity'], isRead: boolean) => {
        if (isRead) return 'bg-gray-50';
        switch (severity) {
            case 'success':
                return 'bg-green-50 border-l-4 border-green-500';
            case 'warning':
                return 'bg-yellow-50 border-l-4 border-yellow-500';
            case 'error':
                return 'bg-red-50 border-l-4 border-red-500';
            default:
                return 'bg-blue-50 border-l-4 border-blue-500';
        }
    };

    const getNotificationLink = (notification: Notification): string | null => {
        if (!notification.reference_id) return null;

        switch (notification.type) {
            case 'laundry':
                return '/dashboard';
            case 'catering':
                return '/dashboard';
            case 'booking':
                return '/dashboard';
            default:
                return null;
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                                <Bell className="text-primary-600" size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                                <p className="text-gray-600">
                                    {unreadCount > 0
                                        ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                                        : 'All caught up!'
                                    }
                                </p>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={actionLoading === -1}
                                className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <CheckCheck size={18} />
                                <span className="hidden sm:inline">Mark all as read</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl shadow p-2 mb-6 flex gap-2">
                    {(['all', 'unread', 'read'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${filter === tab
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {tab === 'unread' && unreadCount > 0 && (
                                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <Bell className="mx-auto text-gray-300 mb-4" size={64} />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
                            </h3>
                            <p className="text-gray-600">
                                {filter === 'all'
                                    ? "You'll see notifications about your orders and services here"
                                    : filter === 'unread'
                                        ? "You've read all your notifications"
                                        : "No read notifications to show"
                                }
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const link = getNotificationLink(notification);
                            const NotificationWrapper = link ? Link : 'div';

                            return (
                                <div
                                    key={notification.id}
                                    className={`bg-white rounded-xl shadow hover:shadow-md transition-all overflow-hidden ${!notification.is_read ? 'ring-2 ring-primary-200' : ''
                                        }`}
                                >
                                    <div className={`p-4 ${getSeverityBg(notification.severity, notification.is_read)}`}>
                                        <div className="flex items-start gap-4">
                                            {/* Type Icon */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.is_read ? 'bg-gray-100' : 'bg-white shadow'
                                                }`}>
                                                {getTypeIcon(notification.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {getSeverityIcon(notification.severity)}
                                                            <h3 className={`font-semibold ${notification.is_read ? 'text-gray-700' : 'text-gray-900'
                                                                }`}>
                                                                {notification.title}
                                                            </h3>
                                                        </div>
                                                        <p className={`text-sm ${notification.is_read ? 'text-gray-500' : 'text-gray-700'
                                                            }`}>
                                                            {notification.message}
                                                        </p>
                                                    </div>

                                                    {/* Unread indicator */}
                                                    {!notification.is_read && (
                                                        <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0 mt-1"></div>
                                                    )}
                                                </div>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Clock size={12} />
                                                        <span>
                                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                        </span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="capitalize px-2 py-0.5 bg-gray-100 rounded">
                                                            {notification.type}
                                                        </span>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        {!notification.is_read && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleMarkAsRead(notification.id);
                                                                }}
                                                                disabled={actionLoading === notification.id}
                                                                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 disabled:opacity-50"
                                                            >
                                                                <Check size={14} />
                                                                Mark as read
                                                            </button>
                                                        )}
                                                        {link && (
                                                            <Link
                                                                href={link}
                                                                className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                                                            >
                                                                View Details →
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Back to Dashboard */}
                <div className="mt-8 text-center">
                    <Link
                        href="/dashboard"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
