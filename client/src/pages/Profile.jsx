import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FieldError from '../components/common/FieldError';
import useForm from '../hooks/useForm';
import {
  validateName,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
} from '../utils/validators';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();

  const [profileSuccess, setProfileSuccess] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile Form Validation
  const profileValidators = {
    name: (val) => validateName(val, 'Full Name'),
    phone: (val) => (val && val.trim() ? validatePhone(val, 'Phone Number') : null),
  };

  const profileForm = useForm(
    {
      name: user?.name || '',
      phone: user?.phone || '',
    },
    profileValidators
  );

  // Password Form Validation
  const passwordValidators = {
    currentPassword: (val) => validateRequired(val, 'Current Password'),
    newPassword: (val) => validatePassword(val, 'New Password', 6),
    confirmPassword: (val, all) => validateConfirmPassword(all.newPassword, val),
  };

  const passwordForm = useForm(
    {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    passwordValidators
  );

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    const isValid = profileForm.validateAll();
    if (!isValid) return;

    setProfileLoading(true);

    const res = await updateProfile({
      name: profileForm.values.name.trim(),
      phone: profileForm.values.phone.trim(),
    });

    setProfileLoading(false);
    if (res.success) {
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(null), 4000);
    } else {
      setProfileError(res.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    const isValid = passwordForm.validateAll();
    if (!isValid) return;

    setPasswordLoading(true);

    const res = await changePassword({
      currentPassword: passwordForm.values.currentPassword,
      newPassword: passwordForm.values.newPassword,
    });

    setPasswordLoading(false);
    if (res.success) {
      setPasswordSuccess('Password changed successfully!');
      passwordForm.resetForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(null), 4000);
    } else {
      setPasswordError(res.message);
    }
  };

  const getProfileInputStyle = (fieldName) => {
    const hasError = profileForm.touched[fieldName] && Boolean(profileForm.errors[fieldName]);
    const isValid = profileForm.touched[fieldName] && !profileForm.errors[fieldName] && profileForm.values[fieldName];
    if (hasError) return 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500';
    if (isValid) return 'border-emerald-400 bg-emerald-50/20 text-slate-800 focus:border-emerald-500';
    return 'border-slate-200 bg-slate-50 text-slate-800 focus:border-teal-500 focus:bg-white';
  };

  const getPasswordInputStyle = (fieldName) => {
    const hasError = passwordForm.touched[fieldName] && Boolean(passwordForm.errors[fieldName]);
    const isValid = passwordForm.touched[fieldName] && !passwordForm.errors[fieldName] && passwordForm.values[fieldName];
    if (hasError) return 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500';
    if (isValid) return 'border-emerald-400 bg-emerald-50/20 text-slate-800 focus:border-emerald-500';
    return 'border-slate-200 bg-slate-50 text-slate-800 focus:border-teal-500 focus:bg-white';
  };

  const roleBadgeColors = {
    admin: 'bg-teal-100 text-teal-800 border-teal-200',
    owner: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    tenant: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal credentials, contact info, and security preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              roleBadgeColors[user?.role] || 'bg-slate-100 text-slate-700'
            }`}
          >
            {user?.role} Account
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
            <User className="w-5 h-5 text-teal-600" />
            <h2 className="font-bold text-sm">Personal Information</h2>
          </div>

          {profileSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={profileForm.values.name}
                onChange={(e) => profileForm.handleChange('name', e.target.value)}
                onBlur={() => profileForm.handleBlur('name')}
                className={`w-full px-3.5 py-2 border rounded-xl text-xs outline-none transition ${getProfileInputStyle(
                  'name'
                )}`}
              />
              <FieldError
                error={profileForm.errors.name}
                touched={profileForm.touched.name}
                showSuccess
                successMessage="Valid name format"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number (10 digits)
              </label>
              <input
                type="tel"
                name="phone"
                maxLength={10}
                value={profileForm.values.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  profileForm.handleChange('phone', val);
                }}
                onBlur={() => profileForm.handleBlur('phone')}
                placeholder="e.g. 9876543210"
                className={`w-full px-3.5 py-2 border rounded-xl text-xs outline-none transition ${getProfileInputStyle(
                  'phone'
                )}`}
              />
              <FieldError
                error={profileForm.errors.phone}
                touched={profileForm.touched.phone}
                showSuccess={Boolean(profileForm.values.phone)}
                successMessage="Valid mobile number"
                currentLength={profileForm.values.phone ? profileForm.values.phone.length : null}
                maxLength={10}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={profileLoading}
              className="w-full"
            >
              Update Profile
            </Button>
          </form>
        </Card>

        {/* Change Password Form */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
            <Lock className="w-5 h-5 text-teal-600" />
            <h2 className="font-bold text-sm">Security & Password</h2>
          </div>

          {passwordSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.values.currentPassword}
                onChange={(e) => passwordForm.handleChange('currentPassword', e.target.value)}
                onBlur={() => passwordForm.handleBlur('currentPassword')}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2 border rounded-xl text-xs outline-none transition ${getPasswordInputStyle(
                  'currentPassword'
                )}`}
              />
              <FieldError
                error={passwordForm.errors.currentPassword}
                touched={passwordForm.touched.currentPassword}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.values.newPassword}
                onChange={(e) => passwordForm.handleChange('newPassword', e.target.value)}
                onBlur={() => passwordForm.handleBlur('newPassword')}
                placeholder="Minimum 6 characters"
                className={`w-full px-3.5 py-2 border rounded-xl text-xs outline-none transition ${getPasswordInputStyle(
                  'newPassword'
                )}`}
              />
              <FieldError
                error={passwordForm.errors.newPassword}
                touched={passwordForm.touched.newPassword}
                showSuccess
                successMessage="Valid new password"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.values.confirmPassword}
                onChange={(e) => passwordForm.handleChange('confirmPassword', e.target.value)}
                onBlur={() => passwordForm.handleBlur('confirmPassword')}
                placeholder="Repeat new password"
                className={`w-full px-3.5 py-2 border rounded-xl text-xs outline-none transition ${getPasswordInputStyle(
                  'confirmPassword'
                )}`}
              />
              <FieldError
                error={passwordForm.errors.confirmPassword}
                touched={passwordForm.touched.confirmPassword}
                showSuccess={Boolean(passwordForm.values.confirmPassword && !passwordForm.errors.confirmPassword)}
                successMessage="Passwords match"
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              size="md"
              loading={passwordLoading}
              className="w-full"
            >
              Change Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
