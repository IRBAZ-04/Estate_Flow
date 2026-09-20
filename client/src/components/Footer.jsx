import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Estate<span className="text-teal-400">Flow</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discover better spaces, connect with trusted property owners, and manage your rental journey with confidence.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Trusted property experiences
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-teal-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-teal-400 transition">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition">
                  Support & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Core Roles
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[10px]">
                  ADMIN
                </span>
                <span>Approvals, Analytics, Control</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                  OWNER
                </span>
                <span>Listings, Inquiries, Tenants</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-[10px]">
                  TENANT
                </span>
                <span>Search, Visits, Payments</span>
              </li>
            </ul>
          </div>

          {/* Service promise */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Why EstateFlow
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated listings, clear communication, and helpful tools for owners and residents.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} EstateFlow. Better spaces, made simple.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Built for modern living</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
