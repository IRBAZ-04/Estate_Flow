import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Properties from './pages/Properties';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { Sparkles, Shield, ArrowRight } from 'lucide-react';

// Phase 2 Auth Placeholder Shell
const AuthPlaceholder = ({ mode }) => (
  <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-4">
    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
      <Shield className="w-6 h-6" />
    </div>
    <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
      Phase 2 Feature
    </span>
    <h2 className="text-xl font-bold text-slate-900 capitalize">
      {mode === 'login' ? 'User Login' : 'Create an Account'}
    </h2>
    <p className="text-xs text-slate-500 leading-relaxed">
      Full JWT Authentication, password hashing, and role-based authorization for <span className="font-semibold text-slate-700">Admin</span>, <span className="font-semibold text-slate-700">Owner</span>, and <span className="font-semibold text-slate-700">Tenant</span> will be unlocked in Phase 2.
    </p>
    <div className="pt-2">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition"
      >
        <span>Back to Home</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<AuthPlaceholder mode="login" />} />
          <Route path="register" element={<AuthPlaceholder mode="register" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
