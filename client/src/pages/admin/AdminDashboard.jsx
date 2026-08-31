import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  FileCheck,
  CreditCard,
  Wrench,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const COLORS = [
  '#0d9488', // teal-600
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#8b5cf6', // violet-500
  '#10b981', // emerald-500
  '#ef4444', // red-500
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getStats();
      setStats(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load administrative analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatPrice = (price) => {
    return `₹ ${new Intl.NumberFormat('en-IN').format(price || 0)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Overview & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time platform metrics, database aggregations, listing moderation, and financial ledgers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/approvals">
            <Button variant="primary" size="sm" icon={<FileCheck className="w-4 h-4" />}>
              Property Approvals
              {stats?.summary?.properties?.pending > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-teal-700 font-bold text-[10px]">
                  {stats.summary.properties.pending}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="outline" size="sm" icon={<Users className="w-4 h-4" />}>
              User Directory
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Aggregating platform database analytics..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchStats} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Users */}
            <Card padding="p-5" className="border-teal-200 bg-teal-50/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-teal-700">Total Users</span>
                <Users className="w-4 h-4 text-teal-600" />
              </div>
              <span className="text-3xl font-black text-slate-900 mt-2 block">
                {stats?.summary?.users?.total || 0}
              </span>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                <span>{stats?.summary?.users?.owners || 0} Owners</span>
                <span>•</span>
                <span>{stats?.summary?.users?.tenants || 0} Tenants</span>
                {stats?.summary?.users?.blocked > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-rose-600 font-semibold">
                      {stats.summary.users.blocked} Blocked
                    </span>
                  </>
                )}
              </div>
            </Card>

            {/* Properties Summary */}
            <Card padding="p-5" className="border-cyan-200 bg-cyan-50/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-cyan-700">Properties Listed</span>
                <Building2 className="w-4 h-4 text-cyan-600" />
              </div>
              <span className="text-3xl font-black text-slate-900 mt-2 block">
                {stats?.summary?.properties?.total || 0}
              </span>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                <span className="text-emerald-700 font-semibold">
                  {stats?.summary?.properties?.approved || 0} Active
                </span>
                <span>•</span>
                <span className="text-amber-700 font-semibold">
                  {stats?.summary?.properties?.pending || 0} Pending
                </span>
              </div>
            </Card>

            {/* Total Revenue Collected */}
            <Card padding="p-5" className="border-emerald-200 bg-emerald-50/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-emerald-700">Platform Revenue</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-3xl font-black text-emerald-800 mt-2 block">
                {formatPrice(stats?.summary?.financials?.totalRevenueCollected)}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-1">
                {formatPrice(stats?.summary?.financials?.totalDepositsHeld)} Security Deposits
              </span>
            </Card>

            {/* Maintenance & Operations */}
            <Card padding="p-5" className="border-rose-200 bg-rose-50/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-rose-700">Maintenance Issues</span>
                <Wrench className="w-4 h-4 text-rose-600" />
              </div>
              <span className="text-3xl font-black text-slate-900 mt-2 block">
                {stats?.summary?.operations?.totalMaintenance || 0}
              </span>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                <span className="text-amber-700 font-semibold">
                  {stats?.summary?.operations?.pendingMaintenance || 0} Open
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">
                  {stats?.summary?.operations?.resolvedMaintenance || 0} Resolved
                </span>
              </div>
            </Card>
          </div>

          {/* Recharts Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Properties by Type */}
            <Card className="space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-teal-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    Property Distribution by Type
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Total: {stats?.summary?.properties?.total}</span>
              </div>

              <div className="h-64 w-full">
                {stats?.charts?.propertiesByType?.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No property data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.charts.propertiesByType}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={45}
                        paddingAngle={3}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {stats.charts.propertiesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val, name) => [`${val} Properties`, name]}
                        contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* Chart 2: Property Purpose (Rent vs Sale) */}
            <Card className="space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-cyan-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    Listings by Purpose (Rent vs Sale)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Commercial & Residential</span>
              </div>

              <div className="h-64 w-full">
                {stats?.charts?.propertiesByPurpose?.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No listings available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.charts.propertiesByPurpose}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, count }) => `${name}: ${count}`}
                      >
                        {stats.charts.propertiesByPurpose.map((entry, index) => (
                          <Cell
                            key={`purpose-${index}`}
                            fill={entry.name === 'Rent' ? '#0d9488' : '#06b6d4'}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val, name) => [`${val} Listings`, name]}
                        contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                      />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* Chart 3: User Demographics by Role */}
            <Card className="space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    User Accounts by Role
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Registered Accounts</span>
              </div>

              <div className="h-64 w-full">
                {stats?.charts?.usersByRole?.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No user data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.charts.usersByRole}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(val) => [`${val} Users`, 'Total Count']}
                        contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                      />
                      <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* Chart 4: Maintenance Tickets by Category */}
            <Card className="space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-rose-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    Maintenance Tickets by Category
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Service Requests</span>
              </div>

              <div className="h-64 w-full">
                {stats?.charts?.maintenanceByCategory?.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No maintenance tickets reported
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.charts.maintenanceByCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(val) => [`${val} Tickets`, 'Category Count']}
                        contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                      />
                      <Bar dataKey="count" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Admin Navigation Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/admin/approvals"
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-teal-400 transition group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 block group-hover:text-teal-600 transition">
                  Property Approvals Portal
                </span>
                <p className="text-[11px] text-slate-500">
                  Inspect pending owner listings and approve or reject submissions.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition shrink-0 ml-3" />
            </Link>

            <Link
              to="/admin/users"
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-teal-400 transition group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 block group-hover:text-teal-600 transition">
                  User Account Directory
                </span>
                <p className="text-[11px] text-slate-500">
                  Search registered users, view roles, and manage active/blocked statuses.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition shrink-0 ml-3" />
            </Link>

            <Link
              to="/admin/operations"
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-teal-400 transition group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 block group-hover:text-teal-600 transition">
                  Platform Operations Log
                </span>
                <p className="text-[11px] text-slate-500">
                  Inspect all inquiries, scheduled visits, leases, payments, and tickets.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition shrink-0 ml-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
