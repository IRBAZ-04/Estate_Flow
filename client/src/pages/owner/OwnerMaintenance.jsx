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
  X,
  Send,
  User,
  Phone,
  Mail,
  Filter,
} from 'lucide-react';
import maintenanceService from '../../services/maintenanceService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const OwnerMaintenance = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Status Update Modal State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('In Progress');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [updating, setUpdating] = useState(false);

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

  const handleOpenUpdateModal = (ticket) => {
    setSelectedTicket(ticket);
    setUpdateStatus(ticket.status === 'Pending' ? 'In Progress' : ticket.status);
    setTechnicianNotes(ticket.technicianNotes || '');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setUpdating(true);
    try {
      await maintenanceService.updateMaintenance(selectedTicket._id, {
        status: updateStatus,
        technicianNotes,
      });
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      alert(err.message || 'Failed to update maintenance ticket');
    } finally {
      setUpdating(false);
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

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const pendingCount = tickets.filter((t) => t.status === 'Pending').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress' || t.status === 'Assigned').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>Owner Service Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Property Maintenance Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dispatch technicians, resolve repair tickets, and communicate status updates directly to your tenants.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchTickets} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="p-4" className="border-amber-200 bg-amber-50/30">
          <span className="text-[11px] font-bold uppercase text-amber-700 block">Pending Action</span>
          <span className="text-2xl font-black text-amber-800 mt-1 block">{pendingCount}</span>
          <span className="text-[10px] text-amber-600 block mt-0.5">Needs assignment</span>
        </Card>

        <Card padding="p-4" className="border-teal-200 bg-teal-50/30">
          <span className="text-[11px] font-bold uppercase text-teal-700 block">Under Repair</span>
          <span className="text-2xl font-black text-teal-800 mt-1 block">{inProgressCount}</span>
          <span className="text-[10px] text-teal-600 block mt-0.5">Assigned / In Progress</span>
        </Card>

        <Card padding="p-4" className="border-emerald-200 bg-emerald-50/30">
          <span className="text-[11px] font-bold uppercase text-emerald-700 block">Resolved / Closed</span>
          <span className="text-2xl font-black text-emerald-800 mt-1 block">{resolvedCount}</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">Completed maintenance</span>
        </Card>
      </div>

      {/* Filter Row */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <label className="text-slate-500 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-slate-500 font-semibold">Priority:</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading maintenance dashboard..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No Tickets Match Filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No maintenance tickets found for the selected status and priority filters.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTickets.map((t) => {
            const prop = t.property;
            const tenant = t.tenant;

            return (
              <Card
                key={t._id}
                className="space-y-4 shadow-xs hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between"
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

                  {/* Problem Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {t.description}
                  </p>

                  {/* Technician Notes if any */}
                  {t.technicianNotes && (
                    <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-teal-900 space-y-0.5">
                      <span className="font-bold text-[10px] uppercase text-teal-800 block">
                        Technician Notes:
                      </span>
                      <p>{t.technicianNotes}</p>
                    </div>
                  )}

                  {/* Property & Tenant Meta */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Property
                      </span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {prop?.title || 'Property Unit'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Tenant Requester
                      </span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {tenant?.name || 'Tenant Name'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/maintenance/${t._id}`}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenUpdateModal(t)}
                    icon={<Wrench className="w-3.5 h-3.5" />}
                  >
                    Update Status
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Status Update Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Update Maintenance Ticket</h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {selectedTicket.category} • {selectedTicket.priority} Priority
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900 block">{selectedTicket.title}</span>
                <p className="text-slate-600 text-[11px] mt-1">{selectedTicket.description}</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Ticket Status
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
                >
                  <option value="Pending">Pending (Awaiting Technician)</option>
                  <option value="Assigned">Assigned (Technician Dispatched)</option>
                  <option value="In Progress">In Progress (Work Underway)</option>
                  <option value="Resolved">Resolved (Repairs Finished)</option>
                  <option value="Closed">Closed (Archived)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Technician / Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  placeholder="e.g. Plumber replaced the seal cartridge on the mixer tap. Leak resolved."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTicket(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={updating}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Save & Notify Tenant
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerMaintenance;
