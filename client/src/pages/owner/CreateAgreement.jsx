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
import FieldError from '../../components/common/FieldError';
import useForm from '../../hooks/useForm';
import {
  validateEmail,
  validateRupeeAmount,
  validateDate,
  validateDateRange,
  validateRequired,
} from '../../utils/validators';

const CreateAgreement = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validators = {
    propertyId: (val) => validateRequired(val, 'Leased Property'),
    tenantEmail: (val) => validateEmail(val, 'Tenant Account Email'),
    monthlyRent: (val) => validateRupeeAmount(val, 'Monthly Rent', { min: 100, max: 50000000 }),
    securityDeposit: (val) =>
      validateRupeeAmount(val, 'Security Deposit', { min: 0, max: 100000000 }),
    startDate: (val) => validateDate(val, 'Lease Commencement Date', { allowPast: true }),
    endDate: (val, all) => {
      const dateErr = validateDate(val, 'Lease Expiration Date', { allowPast: true });
      if (dateErr) return dateErr;
      return validateDateRange(all.startDate, val, 'Commencement Date', 'Expiration Date');
    },
    terms: (val) => validateRequired(val, 'Agreement Terms & Conditions'),
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
      tenantEmail: '',
      monthlyRent: '',
      securityDeposit: '',
      startDate: '',
      endDate: '',
      status: 'Active',
      terms:
        '1. The tenant agrees to pay the designated monthly rent on or before the 1st of each calendar month.\n2. A refundable security deposit is held by the landlord and returned upon satisfactory end-of-tenancy inspection.\n3. The property shall be used exclusively for peaceful residential purposes.\n4. A minimum of 30 days prior written notice is mandatory for lease termination by either party.',
    },
    validators
  );

  useEffect(() => {
    const fetchOwnerProps = async () => {
      setLoadingProps(true);
      try {
        const res = await propertyService.getMyProperties();
        const propList = res.data || [];
        setProperties(propList);
        if (propList.length > 0) {
          const firstProp = propList[0];
          setValues((prev) => ({
            ...prev,
            propertyId: firstProp._id,
            monthlyRent: String(firstProp.price || ''),
            securityDeposit: String((firstProp.price || 0) * 2),
          }));
        }
      } catch (err) {
        setServerError(err.message || 'Failed to load your properties');
      } finally {
        setLoadingProps(false);
      }
    };

    fetchOwnerProps();
  }, [setValues]);

  const handlePropertySelect = (e) => {
    const selectedId = e.target.value;
    const selectedProp = properties.find((p) => p._id === selectedId);
    handleChange('propertyId', selectedId);
    if (selectedProp) {
      handleChange('monthlyRent', String(selectedProp.price || ''));
      handleChange('securityDeposit', String((selectedProp.price || 0) * 2));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const isValid = validateAll();
    if (!isValid) return;

    setSubmitting(true);
    try {
      const res = await agreementService.createAgreement({
        propertyId: values.propertyId,
        tenantEmail: values.tenantEmail.trim().toLowerCase(),
        monthlyRent: Number(values.monthlyRent),
        securityDeposit: Number(values.securityDeposit || 0),
        startDate: values.startDate,
        endDate: values.endDate,
        terms: values.terms,
        status: values.status,
      });

      navigate(`/agreements/${res.data._id}`);
    } catch (err) {
      setServerError(err.message || 'Failed to generate rental agreement');
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
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {serverError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
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
                  Select Leased Property <span className="text-rose-500">*</span>
                </label>
                <select
                  name="propertyId"
                  value={values.propertyId}
                  onChange={handlePropertySelect}
                  onBlur={() => handleBlur('propertyId')}
                  className={`w-full px-3 py-2 border rounded-xl text-xs outline-none bg-white transition ${getInputStyle(
                    'propertyId'
                  )}`}
                >
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} ({p.location} • ₹ {p.price}/mo)
                    </option>
                  ))}
                </select>
                <FieldError error={errors.propertyId} touched={touched.propertyId} />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tenant Account Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="tenantEmail"
                  value={values.tenantEmail}
                  onChange={(e) => handleChange('tenantEmail', e.target.value)}
                  onBlur={() => handleBlur('tenantEmail')}
                  placeholder="tenant@estateflow.com"
                  className={`w-full px-3 py-2 border rounded-xl text-xs outline-none transition ${getInputStyle(
                    'tenantEmail'
                  )}`}
                />
                <FieldError
                  error={errors.tenantEmail}
                  touched={touched.tenantEmail}
                  showSuccess
                  successMessage="Valid tenant email"
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
                  Monthly Rent (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="monthlyRent"
                  min="1"
                  value={values.monthlyRent}
                  onChange={(e) => handleChange('monthlyRent', e.target.value)}
                  onBlur={() => handleBlur('monthlyRent')}
                  className={`w-full px-3 py-2 border rounded-xl text-xs outline-none transition ${getInputStyle(
                    'monthlyRent'
                  )}`}
                />
                <FieldError
                  error={errors.monthlyRent}
                  touched={touched.monthlyRent}
                  showSuccess
                  successMessage="Valid monthly rent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Security Deposit (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="securityDeposit"
                  min="0"
                  value={values.securityDeposit}
                  onChange={(e) => handleChange('securityDeposit', e.target.value)}
                  onBlur={() => handleBlur('securityDeposit')}
                  className={`w-full px-3 py-2 border rounded-xl text-xs outline-none transition ${getInputStyle(
                    'securityDeposit'
                  )}`}
                />
                <FieldError
                  error={errors.securityDeposit}
                  touched={touched.securityDeposit}
                  showSuccess
                  successMessage="Deposit amount valid"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Lease Commencement Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={values.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  onBlur={() => handleBlur('startDate')}
                  className={`w-full px-3 py-2 border rounded-xl text-xs outline-none transition ${getInputStyle(
                    'startDate'
                  )}`}
                />
                <FieldError error={errors.startDate} touched={touched.startDate} />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Lease Expiration Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={values.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  onBlur={() => handleBlur('endDate')}
                  className={`w-full px-3 py-2 border rounded-xl text-xs outline-none transition ${getInputStyle(
                    'endDate'
                  )}`}
                />
                <FieldError
                  error={errors.endDate}
                  touched={touched.endDate}
                  showSuccess
                  successMessage="Valid lease duration"
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
                  Agreement Terms & Conditions <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="terms"
                  rows={5}
                  value={values.terms}
                  onChange={(e) => handleChange('terms', e.target.value)}
                  onBlur={() => handleBlur('terms')}
                  className={`w-full px-3 py-2 border rounded-xl text-xs outline-none resize-none font-mono transition ${getInputStyle(
                    'terms'
                  )}`}
                ></textarea>
                <FieldError
                  error={errors.terms}
                  touched={touched.terms}
                  showSuccess
                  successMessage="Terms entered"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Initial Status
                </label>
                <select
                  name="status"
                  value={values.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
                >
                  <option value="Active">Active (Immediately mark property as Rented)</option>
                  <option value="Draft">Draft (Review before activating)</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/agreements')}
            >
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
