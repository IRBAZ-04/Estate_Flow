import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, Building2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FieldError from '../components/common/FieldError';
import useForm from '../hooks/useForm';
import { validateEmail, validatePassword } from '../utils/validators';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Quick Demo Logins
  const demoAccounts = [
    { label: 'Admin', email: 'admin@estateflow.com', password: 'Admin@123456', role: 'admin' },
    { label: 'Owner (Demo)', email: 'owner@estateflow.com', password: 'Owner@123456', role: 'owner' },
    { label: 'Tenant (Demo)', email: 'tenant@estateflow.com', password: 'Tenant@123456', role: 'tenant' },
  ];

  const validators = {
    email: (val) => validateEmail(val, 'Email Address'),
    password: (val) => validatePassword(val, 'Password', 6),
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
  } = useForm(
    {
      email: '',
      password: '',
    },
    validators
  );

  const fillDemo = (demo) => {
    setValues({ email: demo.email, password: demo.password });
    setErrors({});
    setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const isValid = validateAll();
    if (!isValid) return;

    setLoading(true);

    const res = await login(values.email.trim().toLowerCase(), values.password);
    setLoading(false);

    if (res.success) {
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else if (res.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (res.user.role === 'owner') {
        navigate('/owner/dashboard', { replace: true });
      } else {
        navigate('/tenant/dashboard', { replace: true });
      }
    } else {
      setServerError(res.message);
    }
  };

  const getInputStyle = (fieldName) => {
    const hasError = touched[fieldName] && Boolean(errors[fieldName]);
    const isValid = touched[fieldName] && !errors[fieldName] && values[fieldName];
    if (hasError) {
      return 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20';
    }
    if (isValid) {
      return 'border-emerald-400 bg-emerald-50/20 text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20';
    }
    return 'border-slate-200 bg-slate-50 text-slate-800 focus:border-teal-500 focus:bg-white';
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/25 mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to EstateFlow
          </h1>
          <p className="text-xs text-slate-500">
            Access your property dashboard, agreements, and real-time alerts
          </p>
        </div>

        <Card padding="p-6 sm:p-8" className="shadow-lg">
          {/* Quick Demo Credentials Bar */}
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-600" />
                Quick Demo Accounts:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {demoAccounts.map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => fillDemo(d)}
                  className="px-2 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 text-[11px] font-medium rounded-lg transition text-center truncate"
                  title={`Fill ${d.label} credentials`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {serverError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs placeholder:text-slate-400 outline-none transition ${getInputStyle(
                    'email'
                  )}`}
                />
              </div>
              <FieldError
                error={errors.email}
                touched={touched.email}
                showSuccess
                successMessage="Valid email format"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-xs placeholder:text-slate-400 outline-none transition ${getInputStyle(
                    'password'
                  )}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <FieldError
                error={errors.password}
                touched={touched.password}
                showSuccess
                successMessage="Password entered"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700">
                Create an account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
