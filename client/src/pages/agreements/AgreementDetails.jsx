import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Building2,
  Calendar,
  CreditCard,
  User,
  Phone,
  Mail,
  ArrowLeft,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  PlusCircle,
  X,
  Send,
  Printer,
} from 'lucide-react';
import agreementService from '../../services/agreementService';
import paymentService from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FieldError from '../../components/common/FieldError';
import { validateRupeeAmount, validateRequired } from '../../utils/validators';

const AgreementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Record Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentType: 'Rent',
    month: 'Current Month',
    paymentMethod: 'Simulated Digital Payment',
    notes: '',
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [paymentTouched, setPaymentTouched] = useState({});
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const validatePaymentField = (field, val) => {
    if (field === 'amount') return validateRupeeAmount(val, 'Payment Amount', { min: 1, max: 50000000 });
    if (field === 'month') return validateRequired(val, 'Billing Month / Period');
    return null;
  };

  const handlePaymentChange = (field, val) => {
    setPaymentData((prev) => ({ ...prev, [field]: val }));
    const err = validatePaymentField(field, val);
    setPaymentErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handlePaymentBlur = (field) => {
    setPaymentTouched((prev) => ({ ...prev, [field]: true }));
    const err = validatePaymentField(field, paymentData[field]);
    setPaymentErrors((prev) => ({ ...prev, [field]: err }));
  };

  const fetchAgreement = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await agreementService.getAgreementById(id);
      setAgreement(res.data);
      if (res.data) {
        setPaymentData((prev) => ({
          ...prev,
          amount: res.data.monthlyRent,
          month: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load rental agreement details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreement();
  }, [id]);

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');

    const newErrors = {
      amount: validatePaymentField('amount', paymentData.amount),
      month: validatePaymentField('month', paymentData.month),
    };
    setPaymentTouched({ amount: true, month: true });
    setPaymentErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    setPaymentSubmitting(true);
    try {
      await paymentService.createPayment({
        agreementId: id,
        amount: Number(paymentData.amount),
        paymentType: paymentData.paymentType,
        month: paymentData.month.trim(),
        paymentMethod: paymentData.paymentMethod,
        notes: paymentData.notes ? paymentData.notes.trim() : '',
        status: 'Paid',
      });
      setPaymentSuccess(true);
    } catch (err) {
      setPaymentError(err.message || 'Failed to record payment transaction');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to change the agreement status to "${newStatus}"?`)) {
      return;
    }
    try {
      const res = await agreementService.updateAgreement(id, { status: newStatus });
      setAgreement(res.data);
    } catch (err) {
      alert(err.message || 'Failed to update agreement status');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader size="lg" message="Loading legal rental contract..." />
      </div>
    );
  }

  if (error || !agreement) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-2xl border border-rose-200 text-center space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-rose-800">Unable to load agreement</h2>
        <p className="text-xs text-slate-500">{error || 'This rental contract does not exist or access is restricted.'}</p>
        <Link to="/agreements">
          <Button variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Agreements
          </Button>
        </Link>
      </div>
    );
  }

  const prop = agreement.property;
  const owner = agreement.owner;
  const tenant = agreement.tenant;
  const isOwner = user?._id === owner?._id || user?.role === 'admin';

  const formatPrice = (price) => {
    return `₹ ${new Intl.NumberFormat('en-IN').format(price)}`;
  };

  const statusColors = {
    Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Draft: 'bg-amber-100 text-amber-800 border-amber-200',
    Expired: 'bg-slate-100 text-slate-700 border-slate-200',
    Terminated: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <Link
          to="/agreements"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all agreements</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setPaymentSuccess(false);
              setPaymentError('');
              setPaymentModalOpen(true);
            }}
            icon={<CreditCard className="w-3.5 h-3.5" />}
          >
            Record Payment
          </Button>

          {isOwner && agreement.status === 'Active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateStatus('Terminated')}
            >
              Terminate Lease
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-3.5 h-3.5" />}
          >
            Print Contract
          </Button>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              statusColors[agreement.status] || 'bg-slate-100 text-slate-700'
            }`}
          >
            {agreement.status}
          </span>
        </div>
      </div>

      {/* Contract Document Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 space-y-8 print:border-none print:shadow-none">
        {/* Document Title Header */}
        <div className="text-center space-y-2 pb-6 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Official Residential Lease Contract</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            TENANCY & RENTAL AGREEMENT
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Contract Document ID: AGR-{agreement._id.toUpperCase()}
          </p>
        </div>

        {/* Parties Involved (Owner & Tenant) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Landlord / Owner */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase text-teal-600 tracking-wider block">
              LESSOR / PROPERTY OWNER
            </span>
            <h3 className="font-bold text-sm text-slate-900">{owner?.name || 'Owner Name'}</h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{owner?.email || 'owner@email.com'}</span>
              </p>
              {owner?.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{owner.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* Tenant */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase text-cyan-600 tracking-wider block">
              LESSEE / TENANT
            </span>
            <h3 className="font-bold text-sm text-slate-900">{tenant?.name || 'Tenant Name'}</h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{tenant?.email || 'tenant@email.com'}</span>
              </p>
              {tenant?.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tenant.phone}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Property Leased */}
        <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3">
          <span className="text-[10px] font-bold uppercase text-teal-400 tracking-wider block">
            DEMISED PREMISES (PROPERTY SPECIFICATIONS)
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-white">{prop?.title || 'Property Unit'}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{prop?.address}, {prop?.location}</p>
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-4">
              <span>{prop?.propertyType}</span>
              <span>•</span>
              <span>{prop?.bedrooms || 0} BHK</span>
              <span>•</span>
              <span>{prop?.area || 0} sq.ft</span>
            </div>
          </div>
        </div>

        {/* Financial Terms & Schedule */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
            Commercial & Financial Terms
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Rent</span>
              <span className="text-base font-extrabold text-teal-700">{formatPrice(agreement.monthlyRent)}</span>
              <span className="text-[10px] text-slate-500 block">Due on 1st of month</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Security Deposit</span>
              <span className="text-base font-extrabold text-slate-900">{formatPrice(agreement.securityDeposit)}</span>
              <span className="text-[10px] text-slate-500 block">Refundable upon exit</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Commencement Date</span>
              <span className="text-xs font-extrabold text-slate-900">
                {new Date(agreement.startDate).toLocaleDateString()}
              </span>
              <span className="text-[10px] text-slate-500 block">Lease Start</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Expiration Date</span>
              <span className="text-xs font-extrabold text-slate-900">
                {new Date(agreement.endDate).toLocaleDateString()}
              </span>
              <span className="text-[10px] text-slate-500 block">Lease End</span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions Clauses */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
            Terms & Contractual Conditions
          </h3>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {agreement.terms ||
              '1. The tenant shall pay the agreed monthly rent on or before the due date.\n2. The security deposit is refundable upon termination subject to inspection.\n3. Either party may terminate this agreement with a 30-day prior written notice.\n4. Commercial or unlawful use of the residential premises is strictly prohibited.'}
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Record Payment Transaction</h3>
                  <p className="text-[11px] text-slate-500 font-mono">AGR-{agreement._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Payment Recorded Successfully!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Transaction receipt has been recorded in the digital financial ledger.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <Link to="/payments">
                    <Button variant="primary" size="sm">
                      View Payment Ledger
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => setPaymentModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRecordPaymentSubmit} noValidate className="space-y-3 text-xs">
                {paymentError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Payment Type
                    </label>
                    <select
                      value={paymentData.paymentType}
                      onChange={(e) => setPaymentData({ ...paymentData, paymentType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
                    >
                      <option value="Rent">Monthly Rent</option>
                      <option value="Security Deposit">Security Deposit</option>
                      <option value="Other">Other / Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Amount (₹) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={paymentData.amount}
                      onChange={(e) => handlePaymentChange('amount', e.target.value)}
                      onBlur={() => handlePaymentBlur('amount')}
                      className={`w-full px-3 py-2 border rounded-xl text-xs outline-none transition ${
                        paymentTouched.amount && paymentErrors.amount
                          ? 'border-rose-400 bg-rose-50/30'
                          : paymentTouched.amount && !paymentErrors.amount && paymentData.amount
                          ? 'border-emerald-400'
                          : 'border-slate-200 bg-slate-50 focus:border-teal-500'
                      }`}
                    />
                    <FieldError
                      error={paymentErrors.amount}
                      touched={paymentTouched.amount}
                      showSuccess
                      successMessage="Valid amount"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Billing Month / Period <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={paymentData.month}
                      onChange={(e) => handlePaymentChange('month', e.target.value)}
                      onBlur={() => handlePaymentBlur('month')}
                      placeholder="e.g. October 2026"
                      className={`w-full px-3 py-2 border rounded-xl text-xs outline-none transition ${
                        paymentTouched.month && paymentErrors.month
                          ? 'border-rose-400 bg-rose-50/30'
                          : paymentTouched.month && !paymentErrors.month && paymentData.month
                          ? 'border-emerald-400'
                          : 'border-slate-200 bg-slate-50 focus:border-teal-500'
                      }`}
                    />
                    <FieldError
                      error={paymentErrors.month}
                      touched={paymentTouched.month}
                      showSuccess
                      successMessage="Period specified"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentData.paymentMethod}
                      onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
                    >
                      <option value="Simulated Digital Payment">Simulated Digital Payment</option>
                      <option value="UPI / Net Banking">UPI / Net Banking</option>
                      <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                      <option value="Credit / Debit Card">Credit / Debit Card</option>
                      <option value="Cash / Cheque Record">Cash / Cheque Record</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Notes / Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                    placeholder="e.g. Paid online for October month rent"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                  <strong>Notice:</strong> This records the payment details for your rental account. No financial debit is processed here.
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPaymentModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={paymentSubmitting}
                    icon={<CreditCard className="w-3.5 h-3.5" />}
                  >
                    Confirm & Record Payment
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgreementDetails;
