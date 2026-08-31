import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  User,
  Mail,
  Phone,
  DollarSign,
  MapPin,
  Sparkles,
  X,
  Send,
} from 'lucide-react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const AdminApprovals = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reject Modal State
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getPendingProperties();
      setProperties(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load pending property approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const handleApprove = async (property) => {
    if (!window.confirm(`Approve and publish listing: "${property.title}"?`)) {
      return;
    }

    setActionLoading(true);
    try {
      await adminService.updatePropertyApproval(property._id, { status: 'Approved' });
      setProperties((prev) => prev.filter((p) => p._id !== property._id));
      alert(`Property listing "${property.title}" has been approved and is now public.`);
    } catch (err) {
      alert(err.message || 'Failed to approve property listing');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProperty) return;

    setActionLoading(true);
    try {
      await adminService.updatePropertyApproval(selectedProperty._id, {
        status: 'Rejected',
        rejectionReason,
      });
      setProperties((prev) => prev.filter((p) => p._id !== selectedProperty._id));
      setSelectedProperty(null);
      setRejectionReason('');
      alert(`Listing rejected and feedback sent to the owner.`);
    } catch (err) {
      alert(err.message || 'Failed to reject property listing');
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price, purpose) => {
    const formatted = `₹ ${new Intl.NumberFormat('en-IN').format(price)}`;
    return purpose === 'Rent' ? `${formatted} / mo` : formatted;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-teal-600" />
            <span>Property Approvals Queue</span>
            {properties.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                {properties.length} Pending
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review newly submitted properties, inspect details, verify ownership credentials, and approve public listings.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchPendingProperties}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Queue
        </Button>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading pending approval queue..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchPendingProperties}>
            Retry
          </Button>
        </div>
      ) : properties.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">All Clear! No Pending Approvals</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Every submitted property listing has been reviewed and moderated.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((prop) => {
            const owner = prop.owner;
            const propImg =
              prop.images && prop.images.length > 0
                ? prop.images[0]
                : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

            return (
              <Card
                key={prop._id}
                className="space-y-4 shadow-xs hover:shadow-md hover:border-amber-300 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Property Image & Badge Header */}
                  <div className="relative rounded-xl overflow-hidden h-48 bg-slate-100">
                    <img
                      src={propImg}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-white shadow-xs">
                        Pending Moderation
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-900/80 text-white">
                        {prop.purpose}
                      </span>
                    </div>
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 line-clamp-1">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{prop.address}, {prop.location}</span>
                    </p>
                    <span className="text-base font-black text-teal-700 block mt-1">
                      {formatPrice(prop.price, prop.purpose)}
                    </span>
                  </div>

                  {/* Specs Pill Box */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Type</span>
                      <span className="font-semibold text-slate-800">{prop.propertyType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Bedrooms</span>
                      <span className="font-semibold text-slate-800">{prop.bedrooms} BHK</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Area</span>
                      <span className="font-semibold text-slate-800">{prop.area} sq.ft</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prop.description}
                  </p>

                  {/* Owner Credentials */}
                  <div className="p-3 bg-teal-50/40 rounded-xl border border-teal-100 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase text-teal-800 block">
                      Submitted by Owner
                    </span>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-semibold">{owner?.name || 'Owner'}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{owner?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProperty(prop);
                      setRejectionReason('');
                    }}
                    disabled={actionLoading}
                    icon={<XCircle className="w-3.5 h-3.5 text-rose-500" />}
                  >
                    Reject with Feedback
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(prop)}
                    disabled={actionLoading}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Approve & Publish
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reject with Reason Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Reject Listing Submission</h3>
                  <p className="text-[11px] text-slate-500 font-mono truncate max-w-[280px]">
                    {selectedProperty.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <p className="text-slate-600">
                Provide constructive feedback explaining why this listing does not meet publishing standards (e.g. insufficient photo resolution, invalid pricing, missing address details).
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Rejection Reason / Owner Feedback (Optional)
                </label>
                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Please provide high-resolution photos and verify the square footage."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProperty(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  loading={actionLoading}
                  className="bg-rose-600 text-white hover:bg-rose-700 border-none"
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Confirm Rejection & Notify Owner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;
