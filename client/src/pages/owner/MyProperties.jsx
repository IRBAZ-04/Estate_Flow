import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Tag,
  MapPin,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import propertyService from '../../services/propertyService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMyProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await propertyService.getMyProperties();
      setProperties(res.data || []);
      setMetrics(res.metrics || null);
    } catch (err) {
      setError(err.message || 'Failed to load your properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await propertyService.updateStatus(id, newStatus);
      fetchMyProperties();
    } catch (err) {
      alert(err.message || 'Failed to update property status');
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await propertyService.deleteProperty(id);
      setDeleteModalId(null);
      fetchMyProperties();
    } catch (err) {
      alert(err.message || 'Failed to delete property');
    } finally {
      setActionLoading(false);
    }
  };

  const statusBadge = (status) => {
    const config = {
      Approved: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" /> },
      Available: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" /> },
      Pending: { bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="w-3 h-3" /> },
      Rejected: { bg: 'bg-rose-100 text-rose-800 border-rose-200', icon: <XCircle className="w-3 h-3" /> },
      Rented: { bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Tag className="w-3 h-3" /> },
      Sold: { bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: <Tag className="w-3 h-3" /> },
    };
    const c = config[status] || { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: null };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${c.bg}`}>
        {c.icon}
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Property Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track approvals, update listing availability, and manage property specifications.
          </p>
        </div>

        <Link to="/owner/properties/add">
          <Button variant="primary" size="md" icon={<PlusCircle className="w-4 h-4" />}>
            Add New Property
          </Button>
        </Link>
      </div>

      {/* Metrics Banner */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card padding="p-4" className="border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Properties</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{metrics.total}</span>
          </Card>

          <Card padding="p-4" className="border-slate-200">
            <span className="text-[11px] font-semibold text-amber-700 uppercase">Pending Approval</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">{metrics.pending}</span>
          </Card>

          <Card padding="p-4" className="border-slate-200">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase">Approved / Active</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">{metrics.approved}</span>
          </Card>

          <Card padding="p-4" className="border-slate-200">
            <span className="text-[11px] font-semibold text-blue-700 uppercase">Rented / Sold</span>
            <span className="text-2xl font-black text-blue-600 block mt-1">{metrics.rentedOrSold}</span>
          </Card>
        </div>
      )}

      {/* Main Table / List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" message="Loading your property portfolio..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchMyProperties} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry Loading
          </Button>
        </div>
      ) : properties.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">You haven't listed any properties yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create your first property listing to submit it for Admin approval and connect with tenants.
          </p>
          <Link to="/owner/properties/add">
            <Button variant="primary" size="md" icon={<PlusCircle className="w-4 h-4" />}>
              Create First Property
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Property</th>
                  <th className="px-4 py-3.5">Type & Purpose</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Availability</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((prop) => {
                  const thumbnail =
                    prop.images && prop.images.length > 0
                      ? prop.images[0]
                      : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80';

                  return (
                    <tr key={prop._id} className="hover:bg-slate-50/70 transition">
                      {/* Property Title & Image */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={thumbnail}
                            alt={prop.title}
                            className="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="max-w-xs">
                            <Link
                              to={`/properties/${prop._id}`}
                              className="font-bold text-slate-900 hover:text-teal-600 transition block truncate"
                            >
                              {prop.title}
                            </Link>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              {prop.location}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type & Purpose */}
                      <td className="px-4 py-4">
                        <span className="font-medium text-slate-800 block">{prop.propertyType}</span>
                        <span className="text-[11px] text-teal-600 font-semibold uppercase">
                          For {prop.purpose}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4 font-mono font-semibold text-slate-900">
                        ₹ {new Intl.NumberFormat('en-IN').format(prop.price)}
                        {prop.purpose === 'Rent' && <span className="text-[10px] text-slate-400 font-normal"> /mo</span>}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">{statusBadge(prop.status)}</td>

                      {/* Availability Quick Toggle */}
                      <td className="px-4 py-4">
                        {prop.status !== 'Pending' && prop.status !== 'Rejected' ? (
                          <select
                            value={prop.status}
                            onChange={(e) => handleStatusChange(prop._id, e.target.value)}
                            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 outline-none"
                          >
                            <option value="Available">Available</option>
                            <option value="Rented">Rented</option>
                            <option value="Sold">Sold</option>
                          </select>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            {prop.status === 'Pending' ? 'Awaiting Review' : 'Listing Rejected'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/properties/${prop._id}`}
                            className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition"
                            title="View public listing"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/owner/properties/edit/${prop._id}`}
                            className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit listing"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteModalId(prop._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Property Listing?</h3>
              <p className="text-xs text-slate-500">
                This action cannot be undone. All listing details and media will be permanently deleted from the system.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setDeleteModalId(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                loading={actionLoading}
                onClick={() => handleDelete(deleteModalId)}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
