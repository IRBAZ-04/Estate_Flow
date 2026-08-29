import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Building2,
  Calendar,
  CreditCard,
  User,
  Phone,
  Mail,
  PlusCircle,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import agreementService from '../../services/agreementService';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const AgreementsList = () => {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAgreements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await agreementService.getAgreements();
      setAgreements(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load rental agreements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  const formatPrice = (price) => {
    return `₹ ${new Intl.NumberFormat('en-IN').format(price)}`;
  };

  const statusColors = {
    Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Draft: 'bg-amber-100 text-amber-800 border-amber-200',
    Expired: 'bg-slate-100 text-slate-700 border-slate-200',
    Terminated: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  const isOwner = user?.role === 'owner' || user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Rental Contracts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rental Agreements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isOwner
              ? 'Manage active lease contracts with your tenants, review terms, and track rent agreements.'
              : 'Access your official lease agreements, verify monthly rent schedules, and inspect terms.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isOwner && (
            <Link to="/owner/agreements/create">
              <Button variant="primary" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
                Create New Agreement
              </Button>
            </Link>
          )}
          <Link to="/payments">
            <Button variant="outline" size="sm" icon={<CreditCard className="w-3.5 h-3.5" />}>
              Payment History
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading rental agreements..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchAgreements} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry Loading
          </Button>
        </div>
      ) : agreements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Rental Agreements Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isOwner
                ? 'Create a formal rental agreement when you finalize an agreement with a prospective tenant.'
                : 'You do not have any active or past lease agreements on file yet.'}
            </p>
          </div>
          {isOwner && (
            <Link to="/owner/agreements/create">
              <Button variant="primary" size="md" icon={<PlusCircle className="w-4 h-4" />}>
                Generate First Agreement
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <span className="text-xs text-slate-500">
            Total Agreements: <strong className="text-slate-900">{agreements.length}</strong>
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agreements.map((agr) => {
              const prop = agr.property;
              const counterpart = isOwner ? agr.tenant : agr.owner;
              const propImg =
                prop?.images && prop.images.length > 0
                  ? prop.images[0]
                  : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80';

              return (
                <Card
                  key={agr._id}
                  className="space-y-4 shadow-xs hover:shadow-md hover:border-teal-300 transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Property & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={propImg}
                          alt={prop?.title || 'Property'}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <Link
                            to={`/agreements/${agr._id}`}
                            className="font-bold text-sm text-slate-900 hover:text-teal-600 transition line-clamp-1 block"
                          >
                            {prop?.title || 'Residential Rental Unit'}
                          </Link>
                          <span className="text-[11px] text-slate-400 font-mono">
                            AGR-{agr._id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                          statusColors[agr.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {agr.status}
                      </span>
                    </div>

                    {/* Financial Specs */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Rent</span>
                        <span className="font-extrabold text-teal-700 text-sm">
                          {formatPrice(agr.monthlyRent)} / mo
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Security Deposit</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {formatPrice(agr.securityDeposit)}
                        </span>
                      </div>
                    </div>

                    {/* Counterpart Details & Dates */}
                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">{isOwner ? 'Tenant:' : 'Owner:'}</span>
                        <span className="font-semibold text-slate-900">{counterpart?.name || 'N/A'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Lease Duration:</span>
                        <span className="font-medium text-slate-800">
                          {new Date(agr.startDate).toLocaleDateString()} —{' '}
                          {new Date(agr.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/agreements/${agr._id}`}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                    >
                      <span>View Agreement Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link to="/payments">
                      <Button variant="outline" size="sm">
                        View Ledger
                      </Button>
                    </Link>
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

export default AgreementsList;
