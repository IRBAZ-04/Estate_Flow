import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Building2,
  Calendar,
  CreditCard,
  User,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Shield,
} from 'lucide-react';
import agreementService from '../../services/agreementService';
import propertyService from '../../services/propertyService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';

const CreateAgreement = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  const [formData, setFormData] = useState({
    propertyId: '',
    tenantEmail: '',
    monthlyRent: '',
    securityDeposit: '',
    startDate: '',
    endDate: '',
    status: 'Active',
    terms:
      '1. The tenant agrees to pay the designated monthly rent on or before the 1st of each calendar month.\n2. A refundable security deposit is held by the landlord and returned upon satisfactory end-of-tenancy inspection.\n3. The property shall be used exclusively for peaceful residential purposes.\n4. A minimum of 30 days prior written notice is mandatory for lease termination by either party.',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOwnerProps = async () => {
      setLoadingProps(true);
      try {
        const res = await propertyService.getMyProperties();
        setProperties(res.data || []);
        if (res.data && res.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            propertyId: res.data[0]._id,
            monthlyRent: res.data[0].price || '',
            securityDeposit: (res.data[0].price || 0) * 2,
          }));
        }
      } catch (err) {
        setError(err.message || 'Failed to load your properties');
      } finally {
        setLoadingProps(false);
      }
    };

    fetchOwnerProps();
  }, []);

  const handlePropertyChange = (e) => {
    const selectedId = e.target.value;
    const selectedProp = properties.find((p) => p._id === selectedId);
    setFormData((prev) => ({
      ...prev,
      propertyId: selectedId,
      monthlyRent: selectedProp ? selectedProp.price : prev.monthlyRent,
      securityDeposit: selectedProp ? selectedProp.price * 2 : prev.securityDeposit,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.propertyId || !formData.tenantEmail || !formData.monthlyRent || !formData.startDate || !formData.endDate) {
      setError('Please fill in all mandatory fields');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('Agreement end date must be after the start date');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await agreementService.createAgreement({
        propertyId: formData.propertyId,
        tenantEmail: formData.tenantEmail.trim().toLowerCase(),
        monthlyRent: Number(formData.monthlyRent),
        securityDeposit: Number(formData.securityDeposit || 0),
        startDate: formData.startDate,
        endDate: formData.endDate,
        terms: formData.terms,
        status: formData.status,
      });

      navigate(`/agreements/${res.data._id}`);
    } catch (err) {
      setError(err.message || 'Failed to generate rental agreement');
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            to="/agreements"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Agreements</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            <span>Create Rental Agreement</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate an official digital tenancy lease contract for your verified property and tenant.
          </p>
        </div>
      </div>

      {loadingProps ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading property portfolio..." />
        </div>
      ) : properties.length === 0 ? (
        <Card className="text-center py-12 space-y-3">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No Properties Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You must create and list a property before you can generate a rental agreement for a tenant.
          </p>
          <Link to="/owner/properties/add">
            <Button variant="primary" size="sm" icon={<PlusCircle className="w-3.5 h-3.5" />}>
              Add Property Listing
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

          {/* Section 1: Property & Tenant Selection */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                1. Property & Tenant Identification
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Select Leased Property *
                </label>
                <select
                  value={formData.propertyId}
                  onChange={handlePropertyChange}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
                >
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} ({p.location} • ₹ {p.price}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tenant Account Email *
                </label>
                <input
                  type="email"
                  value={formData.tenantEmail}
                  onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
                  placeholder="tenant@estateflow.com"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </Card>

          {/* Section 2: Financial Terms & Rent Schedule */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                2. Financial Terms & Lease Period
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Security Deposit (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Lease Commencement Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Lease Expiration Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </Card>

          {/* Section 3: Legal Terms & Clauses */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Shield className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                3. Tenancy Conditions & Clauses
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Agreement Terms & Conditions
                </label>
                <textarea
                  rows={5}
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 resize-none font-mono"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Initial Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
                >
                  <option value="Active">Active (Immediately mark property as Rented)</option>
                  <option value="Draft">Draft (Review before activating)</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="md" onClick={() => navigate('/agreements')}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
              icon={<FileText className="w-4 h-4" />}
            >
              Generate Agreement Contract
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateAgreement;
