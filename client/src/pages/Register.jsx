import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserCheck, Building2, AlertCircle, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FieldError from '../components/common/FieldError';
import useForm from '../hooks/useForm';
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validators = {
    name: (val) => validateName(val, 'Full Name'),
    email: (val) => validateEmail(val, 'Email Address'),
    phone: (val) => (val && val.trim() ? validatePhone(val, 'Phone Number') : null),
    password: (val) => validatePassword(val, 'Password', 6),
    confirmPassword: (val, all) => validateConfirmPassword(all.password, val),
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
  } = useForm(
    {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'tenant', // 'tenant' | 'owner'
    },
    validators
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const isValid = validateAll();
    if (!isValid) return;

    setLoading(true);

    const res = await register({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      password: values.password,
      role: values.role,
    });

    setLoading(false);

    if (res.success) {
      if (res.user.role === 'owner') {
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
            Create Your Account
          </h1>
          <p className="text-xs text-slate-500">
            Join EstateFlow to search, list, or manage properties
          </p>
        </div>

        <Card padding="p-6 sm:p-8" className="shadow-lg">
          {serverError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('role', 'tenant')}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition flex flex-col gap-0.5 ${
                    values.role === 'tenant'
                      ? 'border-teal-600 bg-teal-50/70 text-teal-900 font-semibold ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold">Tenant / Buyer</span>
                  <span className="text-[10px] text-slate-400 font-normal">Search & rent</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('role', 'owner')}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition flex flex-col gap-0.5 ${
                    values.role === 'owner'
                      ? 'border-teal-600 bg-teal-50/70 text-teal-900 font-semibold ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold">Property Owner</span>
                  <span className="text-[10px] text-slate-400 font-normal">List & manage</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs placeholder:text-slate-400 outline-none transition ${getInputStyle(
                    'name'
                  )}`}
                />
              </div>
              <FieldError
                error={errors.name}
                touched={touched.name}
                showSuccess
                successMessage="Valid name"
              />
            </div>

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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number (10 digits)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  maxLength={10}
                  value={values.phone}
                  onChange={(e) => {
                    // Only allow digits up to 10
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    handleChange('phone', val);
                  }}
                  onBlur={() => handleBlur('phone')}
                  placeholder="9876543210"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs placeholder:text-slate-400 outline-none transition ${getInputStyle(
                    'phone'
                  )}`}
                />
              </div>
              <FieldError
                error={errors.phone}
                touched={touched.phone}
                showSuccess={Boolean(values.phone)}
                successMessage="Valid Indian phone"
                currentLength={values.phone ? values.phone.length : null}
                maxLength={10}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={values.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    placeholder="Min. 6 chars"
                    className={`w-full pl-10 pr-9 py-2.5 border rounded-xl text-xs placeholder:text-slate-400 outline-none transition ${getInputStyle(
                      'password'
                    )}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <FieldError
                  error={errors.password}
                  touched={touched.password}
                  showSuccess
                  successMessage="Strong length"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    placeholder="Repeat password"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs placeholder:text-slate-400 outline-none transition ${getInputStyle(
                      'confirmPassword'
                    )}`}
                  />
                </div>
                <FieldError
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  showSuccess={Boolean(values.confirmPassword && !errors.confirmPassword)}
                  successMessage="Passwords match"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={<UserCheck className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
