import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  Menu,
  X,
  Shield,
  User,
  LogIn,
  Sparkles,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  PlusCircle,
  Building,
  Heart,
  MessageSquare,
  Calendar,
  FileText,
  CreditCard,
  TrendingUp,
  Wrench,
  Bell,
  CheckCheck,
  ShieldCheck,
  Users,
  FileCheck,
  Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Notification Bell State
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifs = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      // Quiet fail in background
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleMarkAllNotifsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'owner') return '/owner/dashboard';
    return '/tenant/dashboard';
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const roleColors = {
    admin: 'bg-teal-100 text-teal-800 border-teal-200',
    owner: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    tenant: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Estate<span className="text-teal-600">Flow</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">
                Property Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-teal-600 bg-teal-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {isAuthenticated && (
              <NavLink
                to={getDashboardPath()}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-teal-600 bg-teal-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                Dashboard
              </NavLink>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <>
                <NavLink
                  to="/admin/approvals"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-teal-600 bg-teal-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  Approvals
                </NavLink>

                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-teal-600 bg-teal-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  Users
                </NavLink>

                <NavLink
                  to="/admin/operations"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-teal-600 bg-teal-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  Operations
                </NavLink>
              </>
            )}

            {isAuthenticated && user?.role !== 'admin' && (
              <>
                <NavLink
                  to="/agreements"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-teal-600 bg-teal-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  Agreements
                </NavLink>

                <NavLink
                  to="/payments"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-teal-600 bg-teal-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  Payments
                </NavLink>

                <NavLink
                  to={user?.role === 'owner' ? '/owner/maintenance' : '/tenant/maintenance'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-teal-600 bg-teal-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  Maintenance
                </NavLink>
              </>
            )}

            {isAuthenticated && user?.role === 'owner' && (
              <NavLink
                to="/owner/properties"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-teal-600 bg-teal-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                My Properties
              </NavLink>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setUserDropdownOpen(false);
                  }}
                  className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-teal-600 transition shadow-2xs cursor-pointer"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Popover */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Bell className="w-3.5 h-3.5 text-teal-600" />
                        <span>Notifications ({unreadCount} Unread)</span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllNotifsRead}
                          className="text-[11px] text-teal-600 hover:underline font-semibold cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-400">
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <Link
                            key={n._id}
                            to={n.link || '/notifications'}
                            onClick={() => setNotifDropdownOpen(false)}
                            className={`block p-3 hover:bg-slate-50 transition ${
                              !n.read ? 'bg-teal-50/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={`font-bold ${
                                  !n.read ? 'text-slate-900' : 'text-slate-700'
                                }`}
                              >
                                {n.title}
                              </span>
                              {!n.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1 shrink-0"></span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                              {n.message}
                            </p>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {new Date(n.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </Link>
                        ))
                      )}
                    </div>

                    <div className="p-2 border-t border-slate-100 text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-xs font-bold text-teal-600 hover:underline block py-1"
                      >
                        View All Activity Feed →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="h-5 w-px bg-slate-200 mx-1"></div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[110px]">
                      {user?.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wide inline-block px-1 rounded ${
                        roleColors[user?.role] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email}</p>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
                      <span>{user?.role?.toUpperCase()} Dashboard</span>
                    </Link>

                    {user?.role === 'admin' && (
                      <>
                        <Link
                          to="/admin/approvals"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                          <span>Property Approvals</span>
                        </Link>
                        <Link
                          to="/admin/users"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition"
                        >
                          <Users className="w-3.5 h-3.5 text-teal-600" />
                          <span>User Directory</span>
                        </Link>
                        <Link
                          to="/admin/operations"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition"
                        >
                          <Activity className="w-3.5 h-3.5 text-teal-600" />
                          <span>Platform Operations</span>
                        </Link>
                      </>
                    )}

                    <Link
                      to="/notifications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition"
                    >
                      <Bell className="w-3.5 h-3.5 text-teal-600" />
                      <span>Notifications ({unreadCount})</span>
                    </Link>

                    <Link
                      to="/agreements"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span>Rental Agreements</span>
                    </Link>

                    <Link
                      to="/payments"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Payment History</span>
                    </Link>

                    <Link
                      to="/favorites"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-rose-600 transition"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>Saved Favorites</span>
                    </Link>

                    {user?.role === 'owner' ? (
                      <>
                        <Link
                          to="/owner/maintenance"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-rose-600 transition"
                        >
                          <Wrench className="w-3.5 h-3.5 text-rose-500" />
                          <span>Maintenance Requests</span>
                        </Link>
                        <Link
                          to="/owner/finances"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Financial Overview</span>
                        </Link>
                        <Link
                          to="/owner/properties"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition"
                        >
                          <Building className="w-3.5 h-3.5 text-cyan-600" />
                          <span>My Properties</span>
                        </Link>
                      </>
                    ) : user?.role === 'tenant' ? (
                      <>
                        <Link
                          to="/tenant/maintenance"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-rose-600 transition"
                        >
                          <Wrench className="w-3.5 h-3.5 text-rose-500" />
                          <span>My Maintenance</span>
                        </Link>
                        <Link
                          to="/tenant/inquiries"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                          <span>My Sent Inquiries</span>
                        </Link>
                      </>
                    ) : null}

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition"
                    >
                      <User className="w-3.5 h-3.5 text-teal-600" />
                      <span>Account Profile</span>
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm shadow-teal-600/20 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'text-teal-600 bg-teal-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="px-3 py-2 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-900 block text-sm">{user?.name}</span>
                <span className="text-xs text-slate-500">{user?.email}</span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold uppercase">
                  {user?.role}
                </span>
              </div>

              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-medium"
              >
                <LayoutDashboard className="w-4 h-4 text-teal-600" />
                <span>My Dashboard</span>
              </Link>

              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/approvals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-medium"
                  >
                    <FileCheck className="w-4 h-4 text-teal-600" />
                    <span>Property Approvals</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-medium"
                  >
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>User Directory</span>
                  </Link>
                  <Link
                    to="/admin/operations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-medium"
                  >
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span>Operations Log</span>
                  </Link>
                </>
              )}

              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-medium"
              >
                <Bell className="w-4 h-4 text-teal-600" />
                <span>Notifications ({unreadCount})</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-medium"
              >
                <User className="w-4 h-4 text-teal-600" />
                <span>Profile Settings</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
              >
                <Sparkles className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
