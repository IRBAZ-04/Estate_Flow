import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  User,
  X,
  Send,
  RefreshCw,
  Building2,
  CalendarCheck,
} from 'lucide-react';
import visitService from '../../services/visitService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const OwnerVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reschedule / Action Modal State
  const [activeModal, setActiveModal] = useState(null); // 'reschedule' or 'reject'
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [actionData, setActionData] = useState({
    date: '',
    time: '11:00 AM',
    feedback: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchVisits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await visitService.getVisits({ type: 'received' });
      setVisits(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load received visit requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleConfirmVisit = async (visitId) => {
    try {
      const res = await visitService.updateVisit(visitId, { status: 'Confirmed' });
      setVisits((prev) =>
        prev.map((v) => (v._id === visitId ? res.data : v))
      );
    } catch (err) {
      alert(err.message || 'Failed to confirm visit request');
    }
  };

  const handleCompleteVisit = async (visitId) => {
    try {
      const res = await visitService.updateVisit(visitId, { status: 'Completed' });
      setVisits((prev) =>
        prev.map((v) => (v._id === visitId ? res.data : v))
      );
    } catch (err) {
      alert(err.message || 'Failed to mark visit as completed');
    }
  };

  const openRescheduleModal = (visit) => {
    setSelectedVisit(visit);
    const visitDateStr = new Date(visit.date).toISOString().split('T')[0];
    setActionData({
      date: visitDateStr,
      time: visit.time || '11:00 AM',
      feedback: visit.ownerFeedback || '',
    });
    setActiveModal('reschedule');
  };

  const openRejectModal = (visit) => {
    setSelectedVisit(visit);
    setActionData({
      date: '',
      time: '',
      feedback: 'Requested time slot is not available or property is currently undergoing maintenance.',
    });
    setActiveModal('reject');
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVisit) return;

    setSubmitting(true);
    try {
      let updatePayload = {};
      if (activeModal === 'reschedule') {
        updatePayload = {
          status: 'Rescheduled',
          date: actionData.date,
          time: actionData.time,
          ownerFeedback: actionData.feedback,
        };
      } else if (activeModal === 'reject') {
        updatePayload = {
          status: 'Rejected',
          ownerFeedback: actionData.feedback,
        };
      }

      const res = await visitService.updateVisit(selectedVisit._id, updatePayload);
      setVisits((prev) =>
        prev.map((v) => (v._id === selectedVisit._id ? res.data : v))
      );
      setActiveModal(null);
      setSelectedVisit(null);
    } catch (err) {
      alert(err.message || 'Failed to process visit update');
    } finally {
      setSubmitting(false);
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

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM',
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Owner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Property Visit Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review visit requests from prospective tenants and buyers, confirm appointments, or propose rescheduled time slots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/owner/inquiries">
            <Button variant="outline" size="sm">
              View Inquiries
            </Button>
          </Link>
          <Link to="/owner/properties">
            <Button variant="primary" size="sm">
              My Properties
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading property visit appointments..." />
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
            <h3 className="text-base font-bold text-slate-800">No Visit Requests Received</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When tenants book property viewing appointments, they will appear here for your confirmation.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <span className="text-xs text-slate-500">
            Total Appointments: <strong className="text-slate-900">{visits.length}</strong>
          </span>

          <div className="space-y-4">
            {visits.map((v) => {
              const prop = v.property;
              const requester = v.requester;

              const propImg =
                prop?.images && prop.images.length > 0
                  ? prop.images[0]
                  : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80';

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
                          <span>{prop?.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          statusColors[v.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {v.status}
                      </span>

                      {v.status === 'Pending' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleConfirmVisit(v._id)}
                            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRescheduleModal(v)}
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openRejectModal(v)}
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {v.status === 'Confirmed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompleteVisit(v._id)}
                        >
                          Mark Completed
                        </Button>
                      )}

                      {v.status === 'Rescheduled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRescheduleModal(v)}
                        >
                          Edit Schedule
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Visit Appointment Data Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Date & Time Slot */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Requested Appointment
                      </span>
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>{new Date(v.date).toLocaleDateString()}</span>
                        <Clock className="w-3.5 h-3.5 text-teal-600 ml-1" />
                        <span>{v.time}</span>
                      </div>
                    </div>

                    {/* Requester Contact */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Requester Contact
                      </span>
                      <div className="font-bold text-slate-800 truncate">{requester?.name || 'User'}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{requester?.phone || requester?.email || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Requester Notes & Feedback */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Notes & Feedback
                      </span>
                      {v.notes && <p className="text-[11px] text-slate-700"><strong>Note:</strong> {v.notes}</p>}
                      {v.ownerFeedback && (
                        <p className="text-[11px] text-teal-700"><strong>Your Note:</strong> {v.ownerFeedback}</p>
                      )}
                      {!v.notes && !v.ownerFeedback && (
                        <span className="text-[11px] text-slate-400 italic">No notes provided</span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Reschedule / Reject Action Modal */}
      {activeModal && selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {activeModal === 'reschedule' ? 'Reschedule Property Visit' : 'Reject Visit Request'}
                </h3>
                <p className="text-[11px] text-slate-500 truncate max-w-xs">
                  {selectedVisit.property?.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setSelectedVisit(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-3 text-xs">
              {activeModal === 'reschedule' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      New Proposed Date
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={actionData.date}
                      onChange={(e) => setActionData({ ...actionData, date: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      New Time Slot
                    </label>
                    <select
                      value={actionData.time}
                      onChange={(e) => setActionData({ ...actionData, time: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {activeModal === 'reschedule'
                    ? 'Note for Tenant / Buyer (Explain reschedule)'
                    : 'Reason for Rejection'}
                </label>
                <textarea
                  rows={3}
                  value={actionData.feedback}
                  onChange={(e) => setActionData({ ...actionData, feedback: e.target.value })}
                  placeholder="Provide brief context for the requester..."
                  required={activeModal === 'reject'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveModal(null);
                    setSelectedVisit(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={activeModal === 'reschedule' ? 'primary' : 'secondary'}
                  size="sm"
                  loading={submitting}
                >
                  {activeModal === 'reschedule' ? 'Confirm Rescheduled Visit' : 'Reject Visit Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerVisits;
