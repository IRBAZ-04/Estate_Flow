import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  Calendar,
  FileText,
  CreditCard,
  Wrench,
  Search,
  Sparkles,
  Home,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const TenantDashboard = () => {
  const { user } = useAuth();

  const metrics = [
    { label: 'Saved Favorites', val: '6', icon: <Heart className="w-5 h-5 text-rose-500" />, sub: 'Properties saved' },
    { label: 'Inquiries Sent', val: '3', icon: <Search className="w-5 h-5 text-teal-600" />, sub: '1 Awaiting response' },
    { label: 'Upcoming Visits', val: '1', icon: <Calendar className="w-5 h-5 text-cyan-600" />, sub: 'Saturday 11:00 AM' },
    { label: 'Active Agreement', val: '1', icon: <FileText className="w-5 h-5 text-emerald-600" />, sub: 'Rent due in 12 days' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Home className="w-3.5 h-3.5" />
            <span>Tenant & Buyer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {user?.name || 'Tenant'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your favorite listings, scheduled visits, rental agreements, and payment records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/properties">
            <Button variant="primary" size="sm" icon={<Search className="w-4 h-4" />}>
              Find Properties
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" size="sm">
              Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <Card key={idx} padding="p-5" className="border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{m.label}</span>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">{m.icon}</div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900">{m.val}</span>
              <span className="block text-[11px] text-teal-600 font-medium mt-1">{m.sub}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Account Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Tenant Account</h3>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Active
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <p>
              <strong className="text-slate-800">Tenant Name:</strong> {user?.name}
            </p>
            <p>
              <strong className="text-slate-800">Registered Email:</strong> {user?.email}
            </p>
            <p>
              <strong className="text-slate-800">Phone Number:</strong> {user?.phone || 'Not provided'}
            </p>
            <p>
              <strong className="text-slate-800">Role:</strong>{' '}
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                {user?.role}
              </span>
            </p>
          </div>

          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            Manage inquiries, visits, agreements, payments, and maintenance requests from your account.
          </p>
        </Card>

        <Card className="space-y-3 bg-slate-900 text-white border-none">
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-sm">Tenant Capabilities</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Search listings, save favorites, book visits, track rental receipts, and file maintenance tickets.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default TenantDashboard;
