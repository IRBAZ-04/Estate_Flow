import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

const BackendStatusBadge = () => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await api.get('/health');
      setStatusData(res.data?.data || null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Server Offline');
      setStatusData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Auto-poll every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const isConnected = statusData?.database?.status === 'Connected';
  const isOnline = statusData?.status === 'online';

  return (
    <div className="relative inline-block text-xs">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-colors border shadow-xs ${
          loading
            ? 'bg-slate-100 text-slate-600 border-slate-300'
            : isOnline && isConnected
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            : isOnline
            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
        }`}
        title="Click to view API & Database connection status"
      >
        <span className="relative flex h-2 w-2">
          {isOnline && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isConnected ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            ></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              loading
                ? 'bg-slate-400'
                : isOnline && isConnected
                ? 'bg-emerald-500'
                : isOnline
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          ></span>
        </span>
        <span>
          {loading
            ? 'Checking API...'
            : isOnline && isConnected
            ? 'API: Online (DB Live)'
            : isOnline
            ? 'API: Online (DB Connecting)'
            : 'API: Offline'}
        </span>
      </button>

      {showDetails && (
        <div className="absolute right-0 mt-2 w-72 p-3 bg-white rounded-xl shadow-xl border border-slate-200 z-50 text-slate-700">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              System Status
            </span>
            <button
              onClick={checkHealth}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-teal-600 transition"
              title="Refresh status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">API Server:</span>
              <span className="font-mono font-semibold text-slate-800">
                {isOnline ? 'Active (Port 5000)' : 'Unreachable'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">MongoDB:</span>
              <span
                className={`font-semibold ${
                  isConnected ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {statusData?.database?.status || 'Disconnected'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Environment:</span>
              <span className="font-mono text-slate-700">
                {statusData?.environment || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Phase:</span>
              <span className="font-medium text-teal-700">Phase 1: Scaffolding</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendStatusBadge;
