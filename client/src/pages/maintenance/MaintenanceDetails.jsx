import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Building2,
  Calendar,
  AlertTriangle,
  User,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Camera,
  Send,
} from 'lucide-react';
import maintenanceService from '../../services/maintenanceService';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const MaintenanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status Update state for Owner
  const [status, setStatus] = useState('');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await maintenanceService.getMaintenanceById(id);
      setTicket(res.data);
      if (res.data) {
        setStatus(res.data.status);
        setTechnicianNotes(res.data.technicianNotes || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load maintenance ticket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await maintenanceService.updateMaintenance(id, {
        status,
        technicianNotes,
      });
      setTicket(res.data);
      alert('Maintenance ticket updated successfully');
    } catch (err) {
      alert(err.message || 'Failed to update maintenance ticket');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader size="lg" message="Loading maintenance ticket details..." />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-2xl border border-rose-200 text-center space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-rose-800">Ticket Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This maintenance request does not exist or access is denied.'}</p>
        <Link to="/tenant/maintenance">
          <Button variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Tickets
          </Button>
        </Link>
      </div>
    );
  }

  const prop = ticket.property;
  const tenant = ticket.tenant;
  const owner = ticket.owner;
  const isOwner = user?._id === owner?._id || user?.role === 'admin';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <Link
          to={isOwner ? '/owner/maintenance' : '/tenant/maintenance'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isOwner ? 'Back to Owner Hub' : 'Back to My Tickets'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              priorityColors[ticket.priority] || 'bg-slate-100 text-slate-700'
            }`}
          >
            {ticket.priority} Priority
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              statusColors[ticket.status] || 'bg-slate-100 text-slate-700'
            }`}
          >
            {ticket.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="space-y-4">
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {ticket.category}
              </span>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                {ticket.title}
              </h1>
              <span className="text-[11px] text-slate-400 font-mono block">
                TICKET-{ticket._id.slice(-6).toUpperCase()} • Reported {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {ticket.description}
            </div>

            {ticket.images && ticket.images.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-teal-600" />
                  <span>Attached Photographs ({ticket.images.length})</span>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {ticket.images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group overflow-hidden rounded-xl border border-slate-200"
                    >
                      <img
                        src={img}
                        alt={`Attachment ${idx + 1}`}
                        className="w-full h-36 object-cover group-hover:scale-105 transition duration-200 bg-slate-100"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Technician Resolution Notes */}
          <Card className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-teal-600" />
              <span>Technician Resolution & Action Log</span>
            </h3>

            {isOwner ? (
              <form onSubmit={handleUpdate} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Update Ticket Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
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
                    Technician / Repair Comments
                  </label>
                  <textarea
                    rows={3}
                    value={technicianNotes}
                    onChange={(e) => setTechnicianNotes(e.target.value)}
                    placeholder="Enter technician report, spare parts replaced, and resolution date..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 resize-none"
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={updating}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Save & Notify Tenant
                </Button>
              </form>
            ) : ticket.technicianNotes ? (
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-bold text-[10px] uppercase text-emerald-800 block">
                  Status: {ticket.status} {ticket.resolvedAt && `(Resolved on ${new Date(ticket.resolvedAt).toLocaleDateString()})`}
                </span>
                <p>{ticket.technicianNotes}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">
                No technician notes recorded yet. The property owner has been notified and will update progress shortly.
              </p>
            )}
          </Card>
        </div>

        {/* Sidebar: Property & Contact Info (1 col) */}
        <div className="space-y-6">
          {/* Property Card */}
          <Card className="space-y-3">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
              Property Under Repair
            </span>
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900">{prop?.title || 'Property Unit'}</h4>
              <p className="text-xs text-slate-500">{prop?.address}, {prop?.location}</p>
              <Link
                to={`/properties/${prop?._id}`}
                className="text-xs font-semibold text-teal-600 hover:underline block pt-1"
              >
                View Property Listing →
              </Link>
            </div>
          </Card>

          {/* Contact Details */}
          <Card className="space-y-3">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
              {isOwner ? 'Tenant Requester' : 'Landlord / Owner'}
            </span>
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">
                {isOwner ? tenant?.name : owner?.name}
              </h4>
              <p className="flex items-center gap-1.5 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{isOwner ? tenant?.email : owner?.email}</span>
              </p>
              {(isOwner ? tenant?.phone : owner?.phone) && (
                <p className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isOwner ? tenant?.phone : owner?.phone}</span>
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetails;
