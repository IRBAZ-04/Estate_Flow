import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, Home, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const Unauthorized = () => {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'owner') return '/owner/dashboard';
    return '/tenant/dashboard';
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-5 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldX className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold uppercase tracking-wider">
            403 Forbidden
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Access Denied
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your account role (<span className="font-semibold text-slate-800 uppercase">{user?.role || 'Guest'}</span>) does not have sufficient permissions to access this administrative portal or resource.
          </p>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={getDashboardPath()} className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              icon={<LayoutDashboard className="w-4 h-4" />}
            >
              My Dashboard
            </Button>
          </Link>

          <Link to="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              className="w-full"
              icon={<Home className="w-4 h-4" />}
            >
              Home Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
