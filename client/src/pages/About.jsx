import React from 'react';
import { Database, Server, Layout, CheckCircle, Code2, Users, Shield, Layers } from 'lucide-react';

const About = () => {
  const phases = [
    { num: 1, name: 'Project Setup & Architecture', status: 'Completed' },
    { num: 2, name: 'Authentication & Role Management', status: 'Next' },
    { num: 3, name: 'Property Management (CRUD & Images)', status: 'Pending' },
    { num: 4, name: 'Advanced Search & Server-Side Filtering', status: 'Pending' },
    { num: 5, name: 'Inquiries & Visit Scheduling', status: 'Pending' },
    { num: 6, name: 'Rental Agreements & Payment Tracking', status: 'Pending' },
    { num: 7, name: 'Maintenance Requests & Notifications', status: 'Pending' },
    { num: 8, name: 'Role Dashboards & Admin Analytics', status: 'Pending' },
    { num: 9, name: 'Security Hardening & Testing', status: 'Pending' },
    { num: 10, name: 'Finalization, Deployment & Docs', status: 'Pending' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Header */}
      <div className="max-w-3xl pb-8 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          About the Project & Architecture
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          The <span className="font-semibold text-slate-900">Real Estate Property Management System</span> is built as a complete university Full Stack Development course project strictly adhering to the MERN stack (MongoDB, Express.js, React.js, Node.js).
        </p>
      </div>

      {/* Tech Stack Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Database className="w-6 h-6 text-emerald-600 mb-3" />
          <h3 className="font-bold text-sm text-slate-900">MongoDB & Mongoose</h3>
          <p className="text-xs text-slate-500 mt-1">
            Schema validation, relational references for Users, Properties, Agreements, Visits, Payments, and Notifications.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Server className="w-6 h-6 text-amber-600 mb-3" />
          <h3 className="font-bold text-sm text-slate-900">Express & Node.js</h3>
          <p className="text-xs text-slate-500 mt-1">
            MVC architecture, RESTful routing, centralized error handler, Multer uploads, and JWT authentication middleware.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Layout className="w-6 h-6 text-teal-600 mb-3" />
          <h3 className="font-bold text-sm text-slate-900">React & Vite</h3>
          <p className="text-xs text-slate-500 mt-1">
            React Router, Axios interceptors, Context API, Lucide icons, and Recharts analytical dashboards.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Code2 className="w-6 h-6 text-cyan-600 mb-3" />
          <h3 className="font-bold text-sm text-slate-900">Tailwind CSS</h3>
          <p className="text-xs text-slate-500 mt-1">
            Custom real-estate design system, glassmorphism, responsive breakpoints, and modern typography tokens.
          </p>
        </div>
      </div>

      {/* 10-Phase Roadmap */}
      <div className="mt-12">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-600" />
          <span>10-Phase Incremental Roadmap</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {phases.map((p) => (
            <div
              key={p.num}
              className={`p-4 rounded-xl border flex items-center justify-between ${
                p.status === 'Completed'
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : p.status === 'Next'
                  ? 'bg-teal-50/70 border-teal-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    p.status === 'Completed'
                      ? 'bg-emerald-600 text-white'
                      : p.status === 'Next'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {p.num}
                </span>
                <span className="font-medium text-xs text-slate-800">{p.name}</span>
              </div>

              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  p.status === 'Completed'
                    ? 'bg-emerald-200/80 text-emerald-800'
                    : p.status === 'Next'
                    ? 'bg-teal-200/80 text-teal-800 animate-pulse'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
