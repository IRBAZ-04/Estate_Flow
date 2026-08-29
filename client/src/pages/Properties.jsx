import React from 'react';
import { Link } from 'react-router-dom';
import { Building, SlidersHorizontal, Search, MapPin, Bed, Bath, Sparkles } from 'lucide-react';

const Properties = () => {
  // Sample layout preview cards demonstrating the planned property UI
  const previewProperties = [
    {
      id: 'prev-1',
      title: 'Luxury 3BHK Skyline Apartment',
      location: 'Adyar, Chennai',
      price: '₹ 45,000 / month',
      purpose: 'Rent',
      type: 'Apartment',
      beds: 3,
      baths: 3,
      area: '1850 sq.ft',
      status: 'Approved',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'prev-2',
      title: 'Modern Waterfront Villa',
      location: 'ECR, Chennai',
      price: '₹ 2.4 Cr',
      purpose: 'Sale',
      type: 'Villa',
      beds: 4,
      baths: 4,
      area: '3200 sq.ft',
      status: 'Approved',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'prev-3',
      title: 'Prime Tech Park Commercial Office',
      location: 'OMR, Chennai',
      price: '₹ 1,20,000 / month',
      purpose: 'Rent',
      type: 'Commercial',
      beds: 0,
      baths: 2,
      area: '2400 sq.ft',
      status: 'Approved',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Listing Catalog Preview (Phase 1 Shell)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Properties
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified listings for rent and sale across prime locations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-xl shadow-xs transition"
          >
            Post a Property
          </Link>
        </div>
      </div>

      {/* Search & Filter Preview Bar */}
      <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location, or amenities..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-teal-500 focus:bg-white transition"
            readOnly
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-600 text-xs font-medium rounded-xl border border-slate-200 cursor-not-allowed"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters (Phase 4)</span>
          </button>
        </div>
      </div>

      {/* Property Grid Preview */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            UI Preview Listings
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Dynamic MongoDB Data In Phase 3
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-900/80 backdrop-blur-xs text-white">
                    {prop.purpose}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-600/90 backdrop-blur-xs text-white">
                    {prop.type}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 backdrop-blur-xs text-slate-900 shadow-xs">
                    {prop.price}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-600 transition-colors">
                    {prop.title}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{prop.location}</span>
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  {prop.beds > 0 && (
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-teal-600" />
                      <span>{prop.beds} Beds</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-teal-600" />
                    <span>{prop.baths} Baths</span>
                  </span>
                  <span className="font-mono text-slate-500">{prop.area}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properties;
