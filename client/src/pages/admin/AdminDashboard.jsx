import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Users,
  Building,
  CheckCircle,
  Clock,
  DollarSign,
  Wrench,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
  const { user } = useAuth();

  const metrics = [
    { label: 'Total Users', val: '12', icon: <Users className="w-5 h-5 text-teal-600" />, change: '+4 this week' },
    { label: 'Properties Listed', val: '28', icon: <Building className="w-5 h-5 text-cyan-600" />, change: '18 Active' },
    { label: 'Pending Approvals', val: '5', icon: <Clock className="w-5 h-5 text-amber-600" />, change: 'Requires Action' },
    { label: 'Platform Volume', val: '₹ 8.4L', icon: <DollarSign className="w-5 h-5 text-emerald-600" />, change: 'This Month' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System overview, user verification, listing approvals, and platform governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/profile">
            <Button variant="outline" size="sm">
              Manage Profile
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
              <span className="block text-[11px] text-teal-600 font-medium mt-1">{m.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Action & Upcoming Phase Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Recent User Registrations (Phase 2 Live)</h3>
            <span className="text-xs text-teal-600 font-semibold">Protected Admin View</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">{user?.name} (Current Admin)</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">{user?.email}</p>
          </div>

          <p className="text-xs text-slate-500 italic">
            Full user moderation, approval workflows, and property management tables will be integrated in Phase 8 (Admin Dashboard).
          </p>
        </Card>

        <Card className="space-y-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
          <div className="flex items-center gap-2 text-teal-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-sm">Course Roadmap</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Phase 2 Authentication is verified. Admin permissions allow system management across all properties and tenant agreements.
          </p>
          <div className="pt-2 border-t border-slate-700/80 text-[11px] text-teal-300 font-mono">
            Auth Token: Verified (Active)
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
