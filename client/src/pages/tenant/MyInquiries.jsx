import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Search,
  User,
  Phone,
  Mail,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import inquiryService from '../../services/inquiryService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const MyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await inquiryService.getInquiries({ type: 'sent' });
      setInquiries(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleCloseInquiry = async (inquiryId) => {
    try {
      await inquiryService.updateInquiry(inquiryId, { status: 'Closed' });
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === inquiryId ? { ...inq, status: 'Closed' } : inq))
      );
    } catch (err) {
      alert(err.message || 'Failed to close inquiry');
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Tenant Communications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Sent Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track inquiries you have sent to property owners, review their responses, and manage communication threads.
          </p>
        </div>

        <Link to="/properties">
          <Button variant="primary" size="sm" icon={<Search className="w-3.5 h-3.5" />}>
            Explore Properties
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading your inquiry history..." />
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
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Inquiries Sent Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When you find a property you love, send a direct inquiry to the owner from the property details page.
            </p>
          </div>
          <Link to="/properties">
            <Button variant="primary" size="md">
              Browse Available Properties
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{inquiries.length}</strong> inquiries
          </span>

          <div className="space-y-4">
            {inquiries.map((inq) => {
              const prop = inq.property;
              const owner = inq.owner;

              const propImg =
                prop?.images && prop.images.length > 0
                  ? prop.images[0]
                  : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80';

              return (
                <Card key={inq._id} className="space-y-4 shadow-2xs hover:border-teal-200 transition">
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
                          Sent on {new Date(inq.createdAt).toLocaleDateString()} at{' '}
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

                      {inq.status !== 'Closed' && (
                        <button
                          type="button"
                          onClick={() => handleCloseInquiry(inq._id)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                        >
                          Close Inquiry
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Message & Owner Response Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Sent Message */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <span className="font-bold text-[11px] text-slate-700 block">Your Message:</span>
                      <p className="text-slate-600 whitespace-pre-line leading-relaxed">{inq.message}</p>
                    </div>

                    {/* Owner Response */}
                    <div
                      className={`p-3 rounded-xl border space-y-1.5 ${
                        inq.responseMessage
                          ? 'bg-teal-50/50 border-teal-200'
                          : 'bg-slate-50/50 border-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-slate-700">
                          Owner Response ({owner?.name || 'Property Owner'}):
                        </span>
                        {owner?.phone && (
                          <span className="text-[10px] text-teal-700 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {owner.phone}
                          </span>
                        )}
                      </div>
                      <p
                        className={`leading-relaxed ${
                          inq.responseMessage ? 'text-slate-800' : 'text-slate-400 italic text-[11px]'
                        }`}
                      >
                        {inq.responseMessage || 'Awaiting response from property owner...'}
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

export default MyInquiries;
