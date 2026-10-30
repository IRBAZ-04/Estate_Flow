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
} from 'lucide-react';
import maintenanceService from '../../services/maintenanceService';
import agreementService from '../../services/agreementService';
import propertyService from '../../services/propertyService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import FieldError from '../../components/common/FieldError';
import useForm from '../../hooks/useForm';
import { validateRequired, validateDescription } from '../../utils/validators';

const SubmitMaintenance = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

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

  const validators = {
    propertyId: (val) => validateRequired(val, 'Rental Property'),
    title: (val) => {
      const req = validateRequired(val, 'Issue Summary / Title');
      if (req) return req;
      if (val.trim().length < 5) return 'Title must be at least 5 characters long';
      if (val.trim().length > 100) return 'Title cannot exceed 100 characters';
      return null;
    },
    description: (val) =>
      validateDescription(val, 'Problem Description', { min: 15, max: 2000 }),
  };

  const {
    values,
    setValues,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
  } = useForm(
    {
      propertyId: '',
      title: '',
      category: 'Plumbing',
      priority: 'Medium',
      description: '',
      images: '',
    },
    validators
  );

  useEffect(() => {
    const fetchLeasedProperties = async () => {
      setLoadingProps(true);
      try {
        const agrRes = await agreementService.getAgreements();
        if (agrRes.data && agrRes.data.length > 0) {
          const props = agrRes.data.map((a) => a.property).filter(Boolean);
          setProperties(props);
          if (props.length > 0) {
            setValues((prev) => ({ ...prev, propertyId: props[0]._id }));
          }
        } else {
          const pubRes = await propertyService.getProperties({ limit: 10 });
          setProperties(pubRes.data || []);
          if (pubRes.data && pubRes.data.length > 0) {
            setValues((prev) => ({ ...prev, propertyId: pubRes.data[0]._id }));
          }
        }
      } catch (err) {
        setServerError(err.message || 'Failed to load properties for maintenance');
      } finally {
        setLoadingProps(false);
      }
    };

    fetchLeasedProperties();
  }, [setValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const isValid = validateAll();
    if (!isValid) return;

    setSubmitting(true);
    try {
      await maintenanceService.createMaintenance({
        propertyId: values.propertyId,
        title: values.title.trim(),
        category: values.category,
        priority: values.priority,
        description: values.description.trim(),
        images: values.images
          ? values.images.split(',').map((img) => img.trim()).filter(Boolean)
          : [],
      });

      navigate('/tenant/maintenance');
    } catch (err) {
      setServerError(err.message || 'Failed to submit maintenance request');
    } finally {
      setSubmitting(false);
    }
  };

  const getInputStyle = (fieldName) => {
    const hasError = touched[fieldName] && Boolean(errors[fieldName]);
    const isValid = touched[fieldName] && !errors[fieldName] && values[fieldName];
    if (hasError) return 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500';
    if (isValid) return 'border-emerald-400 bg-emerald-50/20 text-slate-800 focus:border-emerald-500';
    return 'border-slate-200 bg-slate-50 text-slate-800 focus:border-teal-500 focus:bg-white';
  };

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
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {serverError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <Card className="space-y-4">
            <div className="space-y-4 text-xs">
              {/* Leased Property */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Select Leased Property <span className="text-rose-500">*</span>
                </label>
                <select
                  name="propertyId"
                  value={values.propertyId}
                  onChange={(e) => handleChange('propertyId', e.target.value)}
                  onBlur={() => handleBlur('propertyId')}
                  className={`w-full px-3 py-2 border rounded-xl text-xs outline-none bg-white transition ${getInputStyle(
                    'propertyId'
                  )}`}
                >
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} ({p.location})
                    </option>
                  ))}
                </select>
                <FieldError error={errors.propertyId} touched={touched.propertyId} />
              </div>

              {/* Issue Title */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Issue Summary / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  onBlur={() => handleBlur('title')}
                  placeholder="e.g. Master Bathroom Tap Leaking Constantly"
                  className={`w-full px-3 py-2 border rounded-xl text-xs outline-none transition ${getInputStyle(
                    'title'
                  )}`}
                />
                <FieldError
                  error={errors.title}
                  touched={touched.title}
                  showSuccess
                  successMessage="Summary provided"
                  currentLength={values.title.length}
                  maxLength={100}
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Maintenance Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={values.category}
                    onChange={(e) => handleChange('category', e.target.value)}
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
                    Urgency & Priority Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="priority"
                    value={values.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
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
                  Detailed Problem Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={values.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  onBlur={() => handleBlur('description')}
                  placeholder="Describe where the issue is located, when it started, and any symptoms (e.g. water drip, electrical spark, broken hinge)..."
                  className={`w-full px-3 py-2 border rounded-xl text-xs outline-none resize-none transition ${getInputStyle(
                    'description'
                  )}`}
                ></textarea>
                <FieldError
                  error={errors.description}
                  touched={touched.description}
                  showSuccess
                  successMessage="Detailed description entered"
                  currentLength={values.description.length}
                  maxLength={2000}
                />
              </div>

              {/* Photos URL */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Attach Photo URLs (Optional, comma-separated)
                </label>
                <input
                  type="text"
                  name="images"
                  value={values.images}
                  onChange={(e) => handleChange('images', e.target.value)}
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
