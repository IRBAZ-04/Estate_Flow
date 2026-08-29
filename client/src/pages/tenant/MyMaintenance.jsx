import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Building2,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  XCircle,
  Sparkles,
} from 'lucide-react';
import maintenanceService from '../../services/maintenanceService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const MyMaintenance = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await maintenanceService.getMaintenance();
      setTickets(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCloseTicket = async (id) => {
    if (!window.confirm('Are you sure you want to mark this maintenance ticket as Closed?')) {
      return;
    }
    try {
      await maintenanceService.updateMaintenance(id, { status: 'Closed' });
      fetchTickets();
    } catch (err) {
      alert(err.message || 'Failed to close maintenance ticket');
    }
  };

  const statusColors = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Assigned: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'In Progress': 'bg-teal-100 text-teal-800 border-teal-200',
    Resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Closed: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const priorityColors = {
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
    Medium: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    High: 'bg-amber-100 text-amber-800 border-amber-200',
    Urgent: 'bg-rose-100 text-rose-800 border-rose-200 font-black',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>Service & Repairs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Maintenance Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track repair tickets submitted for your rented apartment, inspect owner comments, and review technician resolution notes.
          </p>
        </div>

        <Link to="/maintenance/submit">
          <Button variant="primary" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
            Report New Issue
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading maintenance tickets..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchTickets} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry Loading
          </Button>
        </div>
      ) : tickets.length === 0 ? (
        <Card className="text-center py-16 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Wrench className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Maintenance Tickets Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Everything in your rented property is running smoothly! If an issue arises with plumbing, electrical, or appliances, submit a ticket here.
            </p>
          </div>
          <Link to="/maintenance/submit">
            <Button variant="primary" size="md" icon={<PlusCircle className="w-4 h-4" />}>
              Report First Issue
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((t) => {
            const prop = t.property;
            const propImg =
              prop?.images && prop.images.length > 0
                ? prop.images[0]
                : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80';

            return (
              <Card
                key={t._id}
                className="space-y-4 shadow-xs hover:shadow-md hover:border-rose-200 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header: Title & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${
                            priorityColors[t.priority] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.priority} Priority
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {t.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{t.title}</h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                        statusColors[t.status] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {t.description}
                  </p>

                  {/* Technician Notes if available */}
                  {t.technicianNotes && (
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 space-y-0.5">
                      <span className="font-bold text-[10px] uppercase text-emerald-800 block">
                        Technician / Owner Note:
                      </span>
                      <p>{t.technicianNotes}</p>
                    </div>
                  )}

                  {/* Property Info */}
                  <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
                    <img
                      src={propImg}
                      alt={prop?.title || 'Property'}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="truncate">
                      <span className="font-semibold text-slate-900 truncate block">
                        {prop?.title || 'Property Unit'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Reported on {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/maintenance/${t._id}`}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <span>View Ticket Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {t.status !== 'Closed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCloseTicket(t._id)}
                    >
                      Mark as Closed
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyMaintenance;
