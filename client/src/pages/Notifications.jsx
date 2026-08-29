import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  Building2,
  MessageSquare,
  Calendar,
  FileText,
  CreditCard,
  Wrench,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import notificationService from '../services/notificationService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(res.unreadCount !== undefined ? res.unreadCount : Math.max(0, unreadCount - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      alert(err.message || 'Failed to mark all notifications as read');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      // Re-count unread
      const remainingUnread = notifications.filter((n) => n._id !== id && !n.read).length;
      setUnreadCount(remainingUnread);
    } catch (err) {
      alert(err.message || 'Failed to delete notification');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'property_approval':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'inquiry_received':
      case 'inquiry_updated':
        return <MessageSquare className="w-5 h-5 text-teal-600" />;
      case 'visit_scheduled':
      case 'visit_updated':
        return <Calendar className="w-5 h-5 text-amber-600" />;
      case 'agreement_created':
        return <FileText className="w-5 h-5 text-cyan-600" />;
      case 'payment_recorded':
      case 'payment_updated':
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case 'maintenance_created':
      case 'maintenance_updated':
        return <Wrench className="w-5 h-5 text-rose-600" />;
      default:
        return <Bell className="w-5 h-5 text-teal-600" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Activity Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-teal-600 text-white text-xs font-bold">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time updates regarding your inquiries, site visits, leases, payments, and maintenance requests.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            icon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            activeFilter === 'all'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            activeFilter === 'unread'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading notifications..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchNotifications} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry
          </Button>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">
            {activeFilter === 'unread' ? 'No Unread Notifications' : 'No Notifications Yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You are all caught up! Activity updates regarding your properties and lease operations will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n._id}
              onClick={() => {
                if (!n.read) handleMarkAsRead(n._id);
              }}
              className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 cursor-pointer ${
                n.read
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  : 'bg-teal-50/40 border-teal-200 hover:border-teal-300 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs shrink-0 mt-0.5">
                  {getTypeIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        n.read ? 'text-slate-800' : 'text-slate-900'
                      }`}
                    >
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-teal-600 inline-block"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </span>

                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!n.read) handleMarkAsRead(n._id);
                        }}
                        className="text-teal-600 hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => handleDelete(n._id, e)}
                  title="Delete notification"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
