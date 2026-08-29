import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import paymentService from '../../services/paymentService';
import agreementService from '../../services/agreementService';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [financials, setFinancials] = useState({
    totalPaid: 0,
    totalPending: 0,
    rentPaid: 0,
    depositPaid: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await paymentService.getPayments();
      setPayments(res.data || []);
      if (res.financials) setFinancials(res.financials);
    } catch (err) {
      setError(err.message || 'Failed to load payment transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatPrice = (price) => {
    return `₹ ${new Intl.NumberFormat('en-IN').format(price || 0)}`;
  };

  const statusColors = {
    Paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Failed: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  const isOwner = user?.role === 'owner' || user?.role === 'admin';

  const filteredPayments = payments.filter((p) => {
    const matchesType = filterType === 'All' || p.paymentType === filterType;
    const matchesSearch =
      searchQuery === '' ||
      p.transactionReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.month?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Financial Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Payment Records & History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isOwner
              ? 'Track collected rent payments, security deposits received, and pending tenant balances.'
              : 'View all your paid rent receipts, security deposit records, and payment confirmations.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/agreements">
            <Button variant="outline" size="sm" icon={<FileText className="w-3.5 h-3.5" />}>
              View Agreements
            </Button>
          </Link>
          {isOwner && (
            <Link to="/owner/finances">
              <Button variant="primary" size="sm" icon={<TrendingUp className="w-3.5 h-3.5" />}>
                Financial Overview
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Summary Financial Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="p-5" className="border-emerald-200 bg-emerald-50/30">
          <span className="text-[11px] font-bold uppercase text-emerald-700 block">
            {isOwner ? 'Total Collected' : 'Total Paid'}
          </span>
          <span className="text-2xl font-black text-emerald-800 mt-1 block">
            {loading ? '-' : formatPrice(financials.totalPaid)}
          </span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">Verified Transactions</span>
        </Card>

        <Card padding="p-5" className="border-amber-200 bg-amber-50/30">
          <span className="text-[11px] font-bold uppercase text-amber-700 block">
            Pending / In-Review
          </span>
          <span className="text-2xl font-black text-amber-800 mt-1 block">
            {loading ? '-' : formatPrice(financials.totalPending)}
          </span>
          <span className="text-[10px] text-amber-600 block mt-0.5">Awaiting Confirmation</span>
        </Card>

        <Card padding="p-5" className="border-slate-200">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">Rent Received</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {loading ? '-' : formatPrice(financials.rentPaid)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Monthly Lease Cycles</span>
        </Card>

        <Card padding="p-5" className="border-slate-200">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">Security Deposits</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {loading ? '-' : formatPrice(financials.depositPaid)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Refundable Escrow</span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Transaction Ref (TXN-...), Property, or Month..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <label className="text-slate-500 font-medium">Filter Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
          >
            <option value="All">All Types</option>
            <option value="Rent">Rent Only</option>
            <option value="Security Deposit">Security Deposit Only</option>
            <option value="Other">Other Fees</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading transaction ledger..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchPayments} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry
          </Button>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <CreditCard className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Payment Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Payments recorded for your rental agreements will appear in this ledger.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">{isOwner ? 'Tenant' : 'Owner'}</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Billing Month</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPayments.map((p) => {
                  const counterpart = isOwner ? p.tenant : p.owner;
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(p.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-teal-700">
                        {p.transactionReference}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 truncate max-w-[180px]">
                        {p.property?.title || 'Property Unit'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[140px]">
                        {counterpart?.name || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {p.paymentType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{p.month}</td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {formatPrice(p.amount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            statusColors[p.status] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
