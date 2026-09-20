import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Key,
  ShieldCheck,
  Search,
  CheckCircle,
  ArrowRight,
  FileText,
  CreditCard,
  Wrench,
  Bell,
  Sparkles,
  MapPin,
  Home as HomeIcon,
} from 'lucide-react';
const Home = () => {
  const features = [
    {
      icon: <Building className="w-6 h-6 text-teal-600" />,
      title: 'Property Lifecycle',
      desc: 'From owner creation and admin approval to active listings, visits, and sales/rentals.',
    },
    {
      icon: <FileText className="w-6 h-6 text-cyan-600" />,
      title: 'Digital Agreements',
      desc: 'Create and track rental agreements between verified owners and registered tenants.',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-emerald-600" />,
      title: 'Payment Tracking',
      desc: 'Log and manage monthly rent, deposits, and payment statuses seamlessly.',
    },
    {
      icon: <Wrench className="w-6 h-6 text-amber-600" />,
      title: 'Maintenance System',
      desc: 'Tenants submit repair requests with priority tracking and resolution logs.',
    },
    {
      icon: <Bell className="w-6 h-6 text-purple-600" />,
      title: 'Real-time Notifications',
      desc: 'Stay informed on approvals, scheduled visits, rent reminders, and status changes.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-rose-600" />,
      title: 'Role-Based Security',
      desc: 'Strict JWT authentication and granular permissions for Admin, Owner, and Tenant.',
    },
  ];

  const workflowSteps = [
    { num: '01', title: 'Listing & Approval', desc: 'Owner submits property; Admin reviews and approves listing.' },
    { num: '02', title: 'Search & Inquiries', desc: 'Tenants discover properties and send inquiries or visit requests.' },
    { num: '03', title: 'Agreement & Payments', desc: 'Generate rental agreements and track recurring payments.' },
    { num: '04', title: 'Maintenance & Reports', desc: 'Manage ongoing maintenance issues and view analytical insights.' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-teal-50/50 via-white to-slate-50">
        <div className="absolute inset-0 hero-glow pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Find a place that feels like home</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Enterprise Property & <br />
              <span className="gradient-text">Real Estate Management</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Discover thoughtfully managed homes and spaces, connect with trusted owners, and manage every step of your rental journey in one place.
            </p>

            {/* Quick Interactive Search Bar Preview */}
            <div className="mt-8 p-3 sm:p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-2 border-b sm:border-b-0 sm:border-r border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Location
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. Chennai, Bangalore"
                      className="w-full text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 bg-transparent"
                      readOnly
                      value="All Locations"
                    />
                  </div>
                </div>

                <div className="p-2 border-b sm:border-b-0 sm:border-r border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Property Type
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <HomeIcon className="w-4 h-4 text-cyan-600 shrink-0" />
                    <select
                      className="w-full text-xs font-medium text-slate-800 outline-none bg-transparent"
                      disabled
                    >
                      <option>Apartment / Villa</option>
                      <option>Independent House</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                </div>

                <div className="p-2 border-b sm:border-b-0 sm:border-r border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Purpose
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Key className="w-4 h-4 text-emerald-600 shrink-0" />
                    <select
                      className="w-full text-xs font-medium text-slate-800 outline-none bg-transparent"
                      disabled
                    >
                      <option>Rent / Lease</option>
                      <option>Buy / Sale</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <Link
                    to="/properties"
                    className="w-full h-full min-h-[42px] flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl font-medium text-xs shadow-md shadow-teal-600/25 transition"
                  >
                    <Search className="w-4 h-4" />
                    <span>Explore Listings</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition"
              >
                <span>View Properties</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition"
              >
                <span>Talk to our team</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Pillars / Features Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              Core Capabilities
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Real Estate Lifecycle
            </p>
            <p className="text-sm text-slate-600">
              Everything you need to discover, manage, and enjoy your next property.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 hover:bg-slate-50/80 border border-slate-200/70 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-200 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-4">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* End-to-End Workflow Stepper */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              A simpler property journey
            </h2>
            <p className="text-2xl font-bold text-slate-900">
              From search to settled
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden"
              >
                <span className="text-3xl font-black text-slate-100 absolute top-2 right-3 select-none">
                  {step.num}
                </span>
                <span className="inline-block px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-[10px] font-bold uppercase mb-2">
                  Step {step.num}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
