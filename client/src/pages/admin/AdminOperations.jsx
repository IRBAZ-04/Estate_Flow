import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  MessageSquare,
  Calendar,
  FileText,
  CreditCard,
  Wrench,
  ArrowLeft,
  RefreshCw,
  Building2,
  User,
  Clock,
  ExternalLink,
} from 'lucide-react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const AdminOperations = () => {
  const [operations, setOperations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('inquiries');

  const fetchOperations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getOperations();
      setOperations(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load platform operations log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  const formatPrice = (price) => {
    return `₹ ${new Intl.NumberFormat('en-IN').format(price || 0)}`;
  };

  const tabs = [
    { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare className="w-3.5 h-3.5" />, count: operations?.inquiries?.length || 0 },
    { id: 'visits', label: 'Scheduled Visits', icon: <Calendar className="w-3.5 h-3.5" />, count: operations?.visits?.length || 0 },
    { id: 'agreements', label: 'Rental Agreements', icon: <FileText className="w-3.5 h-3.5" />, count: operations?.agreements?.length || 0 },
    { id: 'payments', label: 'Payment Ledger', icon: <CreditCard className="w-3.5 h-3.5" />, count: operations?.payments?.length || 0 },
    { id: 'maintenance', label: 'Maintenance Tickets', icon: <Wrench className="w-3.5 h-3.5" />, count: operations?.maintenance?.length || 0 },
  ];

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
            <Activity className="w-6 h-6 text-teal-600" />
            <span>Platform Operations & Activity Log</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centralized platform oversight across inquiries, site visits, legal contracts, payment records, and service tickets.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchOperations} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh Logs
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === tab.id ? 'bg-white text-teal-700' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading platform operations..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchOperations}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          {/* Tab 1: Inquiries */}
          {activeTab === 'inquiries' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Sender (Tenant)</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Message Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {operations?.inquiries?.map((inq) => (
                    <tr key={inq._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 truncate max-w-[180px]">
                        {inq.property?.title || 'Property'}
                      </td>
                      <td className="py-3 px-4 text-slate-700 truncate max-w-[130px]">
                        {inq.user?.name || inq.name || 'Tenant'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[130px]">
                        {inq.owner?.name || 'Owner'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 border border-slate-200">
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 truncate max-w-[200px]">
                        {inq.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Visits */}
          {activeTab === 'visits' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">Visit Date & Time</th>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Requester</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {operations?.visits?.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {new Date(v.date).toLocaleDateString()} @ {v.time}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 truncate max-w-[200px]">
                        {v.property?.title || 'Property'}
                      </td>
                      <td className="py-3 px-4 text-slate-700 truncate max-w-[130px]">
                        {v.requester?.name || 'Requester'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[130px]">
                        {v.owner?.name || 'Owner'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 border border-slate-200">
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Agreements */}
          {activeTab === 'agreements' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">Agreement ID</th>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Tenant</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Monthly Rent</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {operations?.agreements?.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-teal-700">
                        AGR-{a._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 truncate max-w-[180px]">
                        {a.property?.title || 'Property'}
                      </td>
                      <td className="py-3 px-4 text-slate-700 truncate max-w-[120px]">
                        {a.tenant?.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[120px]">
                        {a.owner?.name}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-teal-800">
                        {formatPrice(a.monthlyRent)}/mo
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 border border-slate-200">
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(a.startDate).toLocaleDateString()} — {new Date(a.endDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 4: Payments */}
          {activeTab === 'payments' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">Payment Date</th>
                    <th className="py-3 px-4">Txn Ref</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Month</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {operations?.payments?.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(p.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-teal-700">
                        {p.transactionReference}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 border">
                          {p.paymentType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{p.month}</td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        {formatPrice(p.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 5: Maintenance */}
          {activeTab === 'maintenance' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Tenant</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {operations?.maintenance?.map((m) => (
                    <tr key={m._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{m.category}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                          {m.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 truncate max-w-[200px]">
                        {m.title}
                      </td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[120px]">
                        {m.tenant?.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 border border-slate-200">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOperations;
