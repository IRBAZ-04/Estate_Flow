import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Building2,
  Phone,
  Mail,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Send,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import inquiryService from '../../services/inquiryService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const OwnerInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Response Modal State
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyStatus, setReplyStatus] = useState('Contacted');
  const [replyMessage, setReplyMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await inquiryService.getInquiries({ type: 'received' });
      setInquiries(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load inquiries received');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const openReplyModal = (inq) => {
    setSelectedInquiry(inq);
    setReplyStatus(inq.status === 'Pending' ? 'Contacted' : inq.status);
    setReplyMessage(inq.responseMessage || '');
  };

  const handleUpdateInquiry = async (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    setUpdating(true);
    try {
      const res = await inquiryService.updateInquiry(selectedInquiry._id, {
        status: replyStatus,
        responseMessage: replyMessage,
      });

      setInquiries((prev) =>
        prev.map((item) => (item._id === selectedInquiry._id ? res.data : item))
      );
      setSelectedInquiry(null);
    } catch (err) {
      alert(err.message || 'Failed to update inquiry');
    } finally {
      setUpdating(false);
    }
  };

  const statusColors = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Contacted: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Rejected: 'bg-rose-100 text-rose-800 border-rose-200',
    Closed: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Owner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tenant & Buyer Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review customer inquiries for your properties, manage contact statuses, and send responses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/owner/visits">
            <Button variant="outline" size="sm">
              View Visit Requests
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
          <Loader size="lg" message="Loading inquiries received..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchInquiries} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry Loading
          </Button>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Inquiries Received Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When tenants or buyers view your listings and submit inquiries, they will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <span className="text-xs text-slate-500">
            Total Received: <strong className="text-slate-900">{inquiries.length}</strong> inquiries
          </span>

          <div className="space-y-4">
            {inquiries.map((inq) => {
              const prop = inq.property;
              const sender = inq.user;

              const propImg =
                prop?.images && prop.images.length > 0
                  ? prop.images[0]
                  : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80';

              return (
                <Card key={inq._id} className="space-y-4 shadow-2xs hover:border-cyan-200 transition">
                  {/* Card Header: Property & Sender */}
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
                        <span className="text-[11px] text-slate-400">
                          Received on {new Date(inq.createdAt).toLocaleDateString()} at{' '}
                          {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          statusColors[inq.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {inq.status}
                      </span>

                      <Button variant="outline" size="sm" onClick={() => openReplyModal(inq)}>
                        Reply & Update
                      </Button>
                    </div>
                  </div>

                  {/* Sender Details & Message Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Sender Info */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <span className="font-bold text-[11px] text-slate-700 block">Sender Info:</span>
                      <div className="font-semibold text-slate-900">{inq.name || sender?.name}</div>
                      <div className="text-slate-600 flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{inq.email || sender?.email}</span>
                      </div>
                      {(inq.phone || sender?.phone) && (
                        <div className="text-slate-600 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{inq.phone || sender?.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Inquiry Message */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <span className="font-bold text-[11px] text-slate-700 block">Inquiry Message:</span>
                      <p className="text-slate-600 whitespace-pre-line leading-relaxed">{inq.message}</p>
                    </div>

                    {/* Current Response */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <span className="font-bold text-[11px] text-slate-700 block">Your Current Response:</span>
                      <p
                        className={`leading-relaxed ${
                          inq.responseMessage ? 'text-slate-800' : 'text-slate-400 italic text-[11px]'
                        }`}
                      >
                        {inq.responseMessage || 'No reply sent yet. Click Reply to respond.'}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Reply & Status Update Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Respond to Inquiry</h3>
                <p className="text-[11px] text-slate-500 truncate max-w-xs">
                  Inquiry from {selectedInquiry.name} on {selectedInquiry.property?.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateInquiry} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Update Inquiry Status
                </label>
                <select
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted (In Discussion)</option>
                  <option value="Accepted">Accepted (Application Approved)</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Response Message to Tenant / Buyer
                </label>
                <textarea
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="e.g. Thanks for your interest! The property is available and we can arrange an on-site visit or discuss the agreement..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInquiry(null)}
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
                  Save & Send Response
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerInquiries;
