import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  UserX,
  UserCheck,
  ArrowLeft,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Selected User Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers({
        search: search.trim() || undefined,
        role: roleFilter !== 'All' ? roleFilter.toLowerCase() : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter, statusFilter]);

  const handleToggleStatus = async (targetUser) => {
    const newStatus = targetUser.status === 'Active' ? 'Blocked' : 'Active';

    if (targetUser._id === currentUser?._id && newStatus === 'Blocked') {
      alert('Security Protection: You cannot block your own administrative account.');
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to change ${targetUser.name}'s status to "${newStatus}"?`
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await adminService.updateUserStatus(targetUser._id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, status: newStatus } : u))
      );
      if (selectedUser?._id === targetUser._id) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    } finally {
      setActionLoading(false);
    }
  };

  const roleColors = {
    admin: 'bg-teal-100 text-teal-800 border-teal-200',
    owner: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    tenant: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

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
            <Users className="w-6 h-6 text-teal-600" />
            <span>User Account Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, inspect, and manage registered tenants, property owners, and platform administrators.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchUsers} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh Directory
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by User Name, Email, or Phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-slate-500 font-semibold">Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
            >
              <option value="All">All Roles</option>
              <option value="Tenant">Tenants</option>
              <option value="Owner">Owners</option>
              <option value="Admin">Admins</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-500 font-semibold">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Searching registered users..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            Retry
          </Button>
        </div>
      ) : users.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No Users Match Search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keyword or clearing the role/status filters.
          </p>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Account Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => {
                  const isCurrentAdmin = u._id === currentUser?._id;

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-[160px]">
                              {u.name}
                              {isCurrentAdmin && (
                                <span className="ml-1 text-[10px] text-teal-600 font-normal">
                                  (You)
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-slate-400 block font-mono truncate max-w-[160px]">
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {u.phone || 'N/A'}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            roleColors[u.role] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            u.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border-rose-200'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="px-2.5 py-1 rounded-lg text-teal-600 hover:bg-teal-50 font-semibold transition"
                          >
                            Inspect
                          </button>

                          {!isCurrentAdmin && (
                            <button
                              onClick={() => handleToggleStatus(u)}
                              disabled={actionLoading}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                                u.status === 'Active'
                                  ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                                  : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                              }`}
                            >
                              {u.status === 'Active' ? (
                                <>
                                  <UserX className="w-3 h-3" />
                                  <span>Block</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3 h-3" />
                                  <span>Unblock</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Details Inspection Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center">
                  {selectedUser.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedUser.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {selectedUser._id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Email:</span>
                  <span className="font-semibold text-slate-900">{selectedUser.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Phone:</span>
                  <span className="font-semibold text-slate-900">{selectedUser.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Role:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      roleColors[selectedUser.role] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {selectedUser.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Account Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      selectedUser.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border-rose-200'
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Member Since:</span>
                  <span className="text-slate-700">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              {selectedUser._id !== currentUser?._id ? (
                <Button
                  variant={selectedUser.status === 'Active' ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleStatus(selectedUser)}
                  loading={actionLoading}
                >
                  {selectedUser.status === 'Active' ? 'Block Account' : 'Unblock Account'}
                </Button>
              ) : (
                <span className="text-[11px] text-slate-400 italic">Self Account Protection</span>
              )}

              <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
