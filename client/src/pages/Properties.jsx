import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  SlidersHorizontal,
  RefreshCw,
  Home,
  Tag,
  ArrowUpDown,
  PlusCircle,
} from 'lucide-react';
import propertyService from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const Properties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    keyword: '',
    purpose: 'All',
    propertyType: 'All',
    sortBy: 'newest',
  });

  const propertyTypes = [
    'All',
    'Apartment',
    'Villa',
    'Independent House',
    'Commercial',
    'Office',
    'Plot/Land',
    'Shop',
  ];

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.purpose !== 'All') params.purpose = filters.purpose;
      if (filters.propertyType !== 'All') params.propertyType = filters.propertyType;
      if (filters.sortBy !== 'newest') params.sortBy = filters.sortBy;

      const res = await propertyService.getProperties(params);
      setProperties(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters.purpose, filters.propertyType, filters.sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const formatPrice = (price, purpose) => {
    const formatted = new Intl.NumberFormat('en-IN').format(price);
    return purpose === 'Rent' ? `₹ ${formatted} / mo` : `₹ ${formatted}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover Verified Properties
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse through approved homes, villas, and commercial real estate available for rent or purchase.
          </p>
        </div>

        {user?.role === 'owner' && (
          <Link to="/owner/properties/add">
            <Button variant="primary" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
              Post a Property
            </Button>
          </Link>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              placeholder="Search by title, location, or area..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-teal-500 focus:bg-white transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.purpose}
              onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-teal-500 transition"
            >
              <option value="All">All Purposes</option>
              <option value="Rent">For Rent</option>
              <option value="Sale">For Sale</option>
            </select>

            <select
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-teal-500 transition"
            >
              {propertyTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Types' : t}
                </option>
              ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-teal-500 transition"
            >
              <option value="newest">Newest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="oldest">Oldest Listed</option>
            </select>

            <Button type="submit" variant="primary" size="md" icon={<Search className="w-3.5 h-3.5" />}>
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Property Results */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" message="Loading approved properties from database..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchProperties} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry Loading
          </Button>
        </div>
      ) : properties.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No properties found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filters.keyword || filters.purpose !== 'All' || filters.propertyType !== 'All'
              ? 'Try adjusting your search criteria or filters.'
              : 'No approved property listings are currently available. Owners can create properties from their dashboard.'}
          </p>
          {user?.role === 'owner' && (
            <Link to="/owner/properties/add">
              <Button variant="primary" size="sm">
                Add New Property Listing
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{properties.length}</strong> available properties
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => {
              const displayImage =
                prop.images && prop.images.length > 0
                  ? prop.images[0]
                  : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

              return (
                <Link
                  key={prop._id}
                  to={`/properties/${prop._id}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col group"
                >
                  {/* Property Image Container */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={displayImage}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-900/80 backdrop-blur-xs text-white">
                        {prop.purpose}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-teal-600/90 backdrop-blur-xs text-white">
                        {prop.propertyType}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 backdrop-blur-xs text-slate-900 shadow-xs">
                        {formatPrice(prop.price, prop.purpose)}
                      </span>
                    </div>
                  </div>

                  {/* Details Container */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-600 transition-colors line-clamp-1">
                        {prop.title}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{prop.location}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      {prop.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-teal-600" />
                          <span>{prop.bedrooms} Beds</span>
                        </span>
                      )}
                      {prop.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-teal-600" />
                          <span>{prop.bathrooms} Baths</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-mono text-slate-500">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.area} sq.ft</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
