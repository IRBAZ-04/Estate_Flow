import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Search,
  Building2,
  RefreshCw,
  Phone,
  Mail,
  X,
} from 'lucide-react';
import visitService from '../../services/visitService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const MyVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVisits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await visitService.getVisits({ type: 'sent' });
      setVisits(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load scheduled visits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleCancelVisit = async (visitId) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled visit appointment?')) {
      return;
    }

    try {
      await visitService.cancelVisit(visitId);
      setVisits((prev) =>
        prev.map((v) => (v._id === visitId ? { ...v, status: 'Cancelled' } : v))
      );
    } catch (err) {
      alert(err.message || 'Failed to cancel visit appointment');
    }
  };

  const statusColors = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Rescheduled: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Rejected: 'bg-rose-100 text-rose-800 border-rose-200',
    Completed: 'bg-blue-100 text-blue-800 border-blue-200',
    Cancelled: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Property Visit Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Scheduled Visits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your in-person property tours, check owner confirmations, and review rescheduled timings.
          </p>
        </div>

        <Link to="/properties">
          <Button variant="primary" size="sm" icon={<Search className="w-3.5 h-3.5" />}>
            Browse Properties
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading your visit appointments..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchVisits} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry Loading
          </Button>
        </div>
      ) : visits.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Visits Scheduled Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Schedule in-person site visits directly from any property listing to inspect amenities and meet owners.
            </p>
          </div>
          <Link to="/properties">
            <Button variant="primary" size="md">
              Find a Property to Visit
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{visits.length}</strong> visit appointments
          </span>

          <div className="space-y-4">
            {visits.map((v) => {
              const prop = v.property;
              const owner = v.owner;

              const propImg =
                prop?.images && prop.images.length > 0
                  ? prop.images[0]
                  : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80';

              const isCancellable = ['Pending', 'Confirmed', 'Rescheduled'].includes(v.status);

              return (
                <Card key={v._id} className="space-y-4 shadow-2xs hover:border-cyan-200 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      {prop && (
                        <img
                          src={propImg}
                          alt={prop.title}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                      )}
                      <div>
                        {prop ? (
                          <Link
                            to={`/properties/${prop._id}`}
                            className="font-bold text-sm text-slate-900 hover:text-teal-600 transition truncate block max-w-md"
                          >
                            {prop.title}
                          </Link>
                        ) : (
                          <span className="font-bold text-sm text-slate-500">Property Listing Archived</span>
                        )}
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{prop?.location || 'Location specified on listing'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          statusColors[v.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {v.status}
                      </span>

                      {isCancellable && (
                        <button
                          type="button"
                          onClick={() => handleCancelVisit(v._id)}
                          className="px-2.5 py-1 rounded-lg border border-rose-200 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          Cancel Visit
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Visit Appointment Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Scheduled Date & Time
                      </span>
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>{new Date(v.date).toLocaleDateString()}</span>
                        <Clock className="w-3.5 h-3.5 text-teal-600 ml-1" />
                        <span>{v.time}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Property Owner Contact
                      </span>
                      <div className="font-bold text-slate-800 truncate">{owner?.name || 'Owner'}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{owner?.phone || owner?.email || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Owner Notes / Feedback
                      </span>
                      <p
                        className={`leading-relaxed text-[11px] ${
                          v.ownerFeedback ? 'text-slate-800 font-medium' : 'text-slate-400 italic'
                        }`}
                      >
                        {v.ownerFeedback || 'No special notes from owner'}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVisits;
