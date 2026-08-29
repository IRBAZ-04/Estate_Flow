import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  PlusCircle,
  Clock,
  CheckCircle2,
  Tag,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import propertyService from '../../services/propertyService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rentedOrSold: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await propertyService.getMyProperties();
        setProperties(res.data || []);
        if (res.metrics) setMetrics(res.metrics);
      } catch (err) {
        console.error('[OwnerDashboard Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metricCards = [
    {
      label: 'Total Listed',
      val: metrics.total,
      icon: <Building2 className="w-5 h-5 text-teal-600" />,
      sub: 'All properties',
      color: 'text-teal-600',
    },
    {
      label: 'Pending Approval',
      val: metrics.pending,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      sub: 'Requires Admin Review',
      color: 'text-amber-600',
    },
    {
      label: 'Approved / Active',
      val: metrics.approved,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      sub: 'Live on Public Catalog',
      color: 'text-emerald-600',
    },
    {
      label: 'Rented / Sold',
      val: metrics.rentedOrSold,
      icon: <Tag className="w-5 h-5 text-blue-600" />,
      sub: 'Occupied Units',
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Owner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {user?.name || 'Property Owner'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your real estate portfolio, check approval statuses, and add new properties.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/owner/properties/add">
            <Button variant="primary" size="md" icon={<PlusCircle className="w-4 h-4" />}>
              Add Property
            </Button>
          </Link>
          <Link to="/owner/properties">
            <Button variant="outline" size="md">
              Manage Listings
            </Button>
          </Link>
        </div>
      </div>

      {/* Dynamic Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m, idx) => (
          <Card key={idx} padding="p-5" className="border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{m.label}</span>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">{m.icon}</div>
            </div>
            <div className="mt-3">
              <span className={`text-2xl font-black ${m.color}`}>
                {loading ? '-' : m.val}
              </span>
              <span className="block text-[11px] text-slate-400 font-medium mt-1">{m.sub}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Properties & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Listings (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Your Recent Property Listings</h3>
            <Link
              to="/owner/properties"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center bg-white rounded-2xl border border-slate-200">
              <Loader size="md" message="Loading listings..." />
            </div>
          ) : properties.length === 0 ? (
            <Card className="text-center py-10 space-y-3">
              <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-medium text-slate-600">No properties in your portfolio yet.</p>
              <Link to="/owner/properties/add">
                <Button variant="primary" size="sm" icon={<PlusCircle className="w-3.5 h-3.5" />}>
                  Create Your First Property
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {properties.slice(0, 3).map((prop) => (
                <div
                  key={prop._id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-4 hover:border-teal-300 transition shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        prop.images && prop.images.length > 0
                          ? prop.images[0]
                          : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={prop.title}
                      className="w-14 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/properties/${prop._id}`}
                        className="font-bold text-xs text-slate-900 hover:text-teal-600 truncate block"
                      >
                        {prop.title}
                      </Link>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {prop.location} • ₹ {new Intl.NumberFormat('en-IN').format(prop.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        prop.status === 'Approved' || prop.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : prop.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {prop.status}
                    </span>

                    <Link to={`/owner/properties/edit/${prop._id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phase Roadmap & Tips Sidebar */}
        <div className="space-y-4">
          <Card className="space-y-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-md">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Owner Actions</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You can post listings with multi-image uploads, manage details, and toggle unit availability when tenants move in.
            </p>
            <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-[11px] text-teal-300 font-mono">
              <span>Phase 3: Property CRUD Live</span>
            </div>
          </Card>

          <Card className="space-y-2.5">
            <h4 className="font-bold text-xs text-slate-900">Upcoming Workflow</h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                <span>Phase 4: Advanced Search & Filter</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                <span>Phase 5: Inquiries & Visit Requests</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Phase 6: Rental Agreements & Rent Tracking</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
