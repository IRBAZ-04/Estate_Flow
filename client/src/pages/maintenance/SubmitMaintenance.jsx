import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wrench,
  Building2,
  AlertTriangle,
  FileText,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Camera,
} from 'lucide-react';
import maintenanceService from '../../services/maintenanceService';
import agreementService from '../../services/agreementService';
import propertyService from '../../services/propertyService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';

const SubmitMaintenance = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  const [formData, setFormData] = useState({
    propertyId: '',
    title: '',
    category: 'Plumbing',
    priority: 'Medium',
    description: '',
    images: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeasedProperties = async () => {
      setLoadingProps(true);
      try {
        // Fetch active agreements for tenant
        const agrRes = await agreementService.getAgreements();
        if (agrRes.data && agrRes.data.length > 0) {
          const props = agrRes.data
            .map((a) => a.property)
            .filter((p) => Boolean(p));
          setProperties(props);
          if (props.length > 0) {
            setFormData((prev) => ({ ...prev, propertyId: props[0]._id }));
          }
        } else {
          // Fallback: public properties list if no active agreement
          const pubRes = await propertyService.getProperties({ limit: 10 });
          setProperties(pubRes.data || []);
          if (pubRes.data && pubRes.data.length > 0) {
            setFormData((prev) => ({ ...prev, propertyId: pubRes.data[0]._id }));
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load properties for maintenance');
      } finally {
        setLoadingProps(false);
      }
    };

    fetchLeasedProperties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.propertyId || !formData.title.trim() || !formData.description.trim()) {
      setError('Please provide property, issue title, and detailed description');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await maintenanceService.createMaintenance({
        propertyId: formData.propertyId,
        title: formData.title.trim(),
        category: formData.category,
        priority: formData.priority,
        description: formData.description.trim(),
        images: formData.images
          ? formData.images.split(',').map((img) => img.trim()).filter(Boolean)
          : [],
      });

      navigate('/tenant/maintenance');
    } catch (err) {
      setError(err.message || 'Failed to submit maintenance request');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Structural',
    'Appliance',
    'Other',
  ];

  const priorities = [
    { label: 'Low — General repair, non-urgent', value: 'Low' },
    { label: 'Medium — Normal attention required', value: 'Medium' },
    { label: 'High — Significant issue affecting living comfort', value: 'High' },
    { label: 'Urgent — Immediate hazard / water leakage / power fault', value: 'Urgent' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            to="/tenant/maintenance"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Tickets</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-rose-600" />
            <span>Submit Maintenance Ticket</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Report a maintenance, plumbing, electrical, or structural issue to the property owner for prompt resolution.
          </p>
        </div>
      </div>

      {loadingProps ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading property details..." />
        </div>
      ) : properties.length === 0 ? (
        <Card className="text-center py-12 space-y-3">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No Rental Property Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You do not have an active lease agreement to submit maintenance requests against.
          </p>
          <Link to="/properties">
            <Button variant="primary" size="sm">
              Browse Properties
            </Button>
          </Link>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Card className="space-y-4">
            <div className="space-y-4 text-xs">
              {/* Leased Property */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Select Leased Property *
                </label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
                >
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} ({p.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue Title */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Issue Summary / Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Master Bathroom Tap Leaking Constantly"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Maintenance Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Urgency & Priority Level *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
                  >
                    {priorities.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Detailed Problem Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe where the issue is located, when it started, and any symptoms (e.g. water drip, electrical spark, broken hinge)..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 resize-none"
                ></textarea>
              </div>

              {/* Photos URL */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Attach Photo URLs (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://example.com/leak1.jpg, https://example.com/leak2.jpg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/tenant/maintenance')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
              icon={<Wrench className="w-4 h-4" />}
            >
              Submit Ticket to Owner
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SubmitMaintenance;
