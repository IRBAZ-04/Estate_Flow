import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Building2, Menu, X, Shield, User, LogIn, Sparkles } from 'lucide-react';
import BackendStatusBadge from './BackendStatusBadge';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About Project', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

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
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-teal-600 bg-teal-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            <BackendStatusBadge />
            
            <div className="h-5 w-px bg-slate-200 mx-1"></div>

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
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <BackendStatusBadge />
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
        </div>
      )}
    </header>
  );
};

export default Navbar;
