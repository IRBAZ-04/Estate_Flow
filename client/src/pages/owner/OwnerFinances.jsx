import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  CreditCard,
  Building2,
  DollarSign,
  ArrowUpRight,
  Clock,
  Shield,
  FileText,
  Calendar,
  RefreshCw,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import paymentService from '../../services/paymentService';
import agreementService from '../../services/agreementService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const OwnerFinances = () => {
  const [payments, setPayments] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [financials, setFinancials] = useState({
    totalPaid: 0,
    totalPending: 0,
    rentPaid: 0,
    depositPaid: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [payRes, agrRes] = await Promise.all([
          paymentService.getPayments(),
          agreementService.getAgreements(),
        ]);
        setPayments(payRes.data || []);
        if (payRes.financials) setFinancials(payRes.financials);
        setAgreements(agrRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load financial records');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price) => {
    return `₹ ${new Intl.NumberFormat('en-IN').format(price || 0)}`;
  };

  const activeMonthlyExpected = agreements
    .filter((a) => a.status === 'Active')
    .reduce((sum, a) => sum + (a.monthlyRent || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Owner Financials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Financial & Revenue Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track rental cash flow, security deposit escrow, and recurring income across your leased property portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/owner/agreements/create">
            <Button variant="primary" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
              Create Agreement
            </Button>
          </Link>
          <Link to="/payments">
            <Button variant="outline" size="sm">
              Full Ledger
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Computing portfolio revenue analytics..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Revenue Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card padding="p-5" className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none shadow-md">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 block">
                Total Revenue Collected
              </span>
              <span className="text-3xl font-black text-white mt-1 block">
                {formatPrice(financials.totalPaid)}
              </span>
              <span className="text-[11px] text-emerald-100 mt-1 block">
                All time verified payments
              </span>
            </Card>

            <Card padding="p-5" className="border-slate-200">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">
                Monthly Expected Rent
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {formatPrice(activeMonthlyExpected)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                From {agreements.filter((a) => a.status === 'Active').length} Active Leases
              </span>
            </Card>

            <Card padding="p-5" className="border-slate-200">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">
                Security Deposits Held
              </span>
              <span className="text-2xl font-black text-teal-700 mt-1 block">
                {formatPrice(financials.depositPaid)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Refundable Escrow Funds
              </span>
            </Card>

            <Card padding="p-5" className="border-slate-200">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">
                Pending Receivables
              </span>
              <span className="text-2xl font-black text-amber-700 mt-1 block">
                {formatPrice(financials.totalPending)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Invoices awaiting clearance
              </span>
            </Card>
          </div>

          {/* Active Lease Roster & Recent Payments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Leases */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    Active Leased Units ({agreements.filter((a) => a.status === 'Active').length})
                  </h3>
                </div>
                <Link to="/agreements" className="text-xs font-semibold text-teal-600 hover:underline">
                  View All
                </Link>
              </div>

              {agreements.filter((a) => a.status === 'Active').length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  No active leases currently producing recurring rent.
                </p>
              ) : (
                <div className="space-y-3">
                  {agreements
                    .filter((a) => a.status === 'Active')
                    .slice(0, 3)
                    .map((agr) => (
                      <div
                        key={agr._id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="truncate">
                          <Link
                            to={`/agreements/${agr._id}`}
                            className="font-bold text-slate-900 hover:text-teal-600 truncate block"
                          >
                            {agr.property?.title || 'Property Unit'}
                          </Link>
                          <span className="text-[11px] text-slate-400">
                            Tenant: {agr.tenant?.name} • Due monthly
                          </span>
                        </div>
                        <span className="font-extrabold text-teal-700 text-xs shrink-0">
                          {formatPrice(agr.monthlyRent)}/mo
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </Card>

            {/* Recent Collections */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    Recent Collections
                  </h3>
                </div>
                <Link to="/payments" className="text-xs font-semibold text-teal-600 hover:underline">
                  Full Ledger
                </Link>
              </div>

              {payments.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  No transaction collections recorded yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {payments.slice(0, 3).map((p) => (
                    <div
                      key={p._id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-mono text-[11px] text-teal-700 font-bold block">
                          {p.transactionReference}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {p.paymentType} • {p.month}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 text-xs block">
                          {formatPrice(p.amount)}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold uppercase">
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerFinances;
