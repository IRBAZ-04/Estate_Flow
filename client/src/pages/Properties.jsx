import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Filter,
} from 'lucide-react';
import propertyService from '../services/propertyService';
import favoriteService from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const Properties = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [favoritesMap, setFavoritesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Pagination & Metadata
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 9,
  });

  // Filter State
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    purpose: searchParams.get('purpose') || 'All',
    propertyType: searchParams.get('propertyType') || 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || 'All',
    bathrooms: searchParams.get('bathrooms') || 'All',
    furnishingStatus: searchParams.get('furnishingStatus') || 'All',
    parking: searchParams.get('parking') || 'All',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: parseInt(searchParams.get('page'), 10) || 1,
  });

  const propertyTypes = [
    'All',
    'Apartment',
    'Villa',
    'Independent House',
    'Plot/Land',
    'Commercial',
    'Office',
    'Shop',
  ];

  // Fetch properties from backend API
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.keyword.trim()) params.keyword = filters.keyword.trim();
      if (filters.location.trim()) params.location = filters.location.trim();
      if (filters.purpose !== 'All') params.purpose = filters.purpose;
      if (filters.propertyType !== 'All') params.propertyType = filters.propertyType;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.bedrooms !== 'All') params.bedrooms = filters.bedrooms;
      if (filters.bathrooms !== 'All') params.bathrooms = filters.bathrooms;
      if (filters.furnishingStatus !== 'All') params.furnishingStatus = filters.furnishingStatus;
      if (filters.parking !== 'All') params.parking = filters.parking;
      if (filters.sortBy !== 'newest') params.sortBy = filters.sortBy;
      params.page = filters.page;
      params.limit = 9;

      const res = await propertyService.getProperties(params);
      setProperties(res.data || []);
      setPagination({
        currentPage: res.currentPage || 1,
        totalPages: res.totalPages || 1,
        total: res.total || 0,
        limit: res.limit || 9,
      });

      // Update URL query parameters
      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v) urlParams.set(k, v);
      });
      setSearchParams(urlParams, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user favorites if logged in
  const fetchUserFavorites = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await favoriteService.getFavorites();
      const map = {};
      (res.data || []).forEach((fav) => {
        if (fav.property?._id) {
          map[fav.property._id] = true;
        }
      });
      setFavoritesMap(map);
    } catch (err) {
      console.warn('[Favorites Error]:', err.message);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [
    filters.purpose,
    filters.propertyType,
    filters.furnishingStatus,
    filters.parking,
    filters.bedrooms,
    filters.bathrooms,
    filters.sortBy,
    filters.page,
  ]);

  useEffect(() => {
    fetchUserFavorites();
  }, [isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchProperties();
  };

  const handleToggleFavorite = async (e, propertyId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please sign in to save properties to your favorites.');
      return;
    }

    const isFav = !!favoritesMap[propertyId];
    // Optimistic UI update
    setFavoritesMap((prev) => ({ ...prev, [propertyId]: !isFav }));

    try {
      if (isFav) {
        await favoriteService.removeFavorite(propertyId);
      } else {
        await favoriteService.addFavorite(propertyId);
      }
    } catch (err) {
      // Revert on error
      setFavoritesMap((prev) => ({ ...prev, [propertyId]: isFav }));
      alert(err.message || 'Failed to update favorite');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      purpose: 'All',
      propertyType: 'All',
      minPrice: '',
      maxPrice: '',
      bedrooms: 'All',
      bathrooms: 'All',
      furnishingStatus: 'All',
      parking: 'All',
      sortBy: 'newest',
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.keyword ||
    filters.location ||
    filters.purpose !== 'All' ||
    filters.propertyType !== 'All' ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.bedrooms !== 'All' ||
    filters.bathrooms !== 'All' ||
    filters.furnishingStatus !== 'All' ||
    filters.parking !== 'All';

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
            Explore Properties
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search verified properties across cities with granular pricing, type, and specification filters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link to="/favorites">
              <Button variant="outline" size="sm" icon={<Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />}>
                My Favorites
              </Button>
            </Link>
          )}

          {user?.role === 'owner' && (
            <Link to="/owner/properties/add">
              <Button variant="primary" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
                Post Property
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Search Bar & Filter Toggle */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          {/* Keyword Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              placeholder="Search by title, location, street address, or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-teal-500 focus:bg-white transition"
            />
            {filters.keyword && (
              <button
                type="button"
                onClick={() => setFilters({ ...filters, keyword: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Purpose Filter Buttons */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shrink-0">
            {['All', 'Rent', 'Sale'].map((purp) => (
              <button
                key={purp}
                type="button"
                onClick={() => setFilters({ ...filters, purpose: purp, page: 1 })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filters.purpose === purp
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {purp === 'All' ? 'All Purpose' : purp === 'Rent' ? 'For Rent' : 'For Sale'}
              </button>
            ))}
          </div>

          {/* Filter Drawer Toggle Button */}
          <Button
            type="button"
            variant={filterPanelOpen || hasActiveFilters ? 'primary' : 'outline'}
            size="md"
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
            icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          >
            <span>Filters {hasActiveFilters && '•'}</span>
          </Button>

          <Button type="submit" variant="secondary" size="md" icon={<Search className="w-3.5 h-3.5" />}>
            Search
          </Button>
        </form>

        {/* Collapsible Multi-Filter Panel */}
        {filterPanelOpen && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-fadeIn">
            {/* Location */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Specific Location / City
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value, page: 1 })}
                  placeholder="e.g. Chennai, Adyar, OMR"
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value, page: 1 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Property Types' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price & Max Price */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Price Range (₹)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value, page: 1 })}
                  placeholder="Min ₹"
                  className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  min="0"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value, page: 1 })}
                  placeholder="Max ₹"
                  className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Bedrooms Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Bedrooms (BHK)
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value, page: 1 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
              >
                <option value="All">Any Bedrooms</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>

            {/* Bathrooms Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Bathrooms
              </label>
              <select
                value={filters.bathrooms}
                onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value, page: 1 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
              >
                <option value="All">Any Bathrooms</option>
                <option value="1">1 Bathroom</option>
                <option value="2">2 Bathrooms</option>
                <option value="3">3+ Bathrooms</option>
              </select>
            </div>

            {/* Furnishing Status */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Furnishing
              </label>
              <select
                value={filters.furnishingStatus}
                onChange={(e) => setFilters({ ...filters, furnishingStatus: e.target.value, page: 1 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
              >
                <option value="All">Any Furnishing</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            {/* Parking */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Parking Space
              </label>
              <select
                value={filters.parking}
                onChange={(e) => setFilters({ ...filters, parking: e.target.value, page: 1 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 bg-white"
              >
                <option value="All">Any Parking</option>
                <option value="Covered">Covered</option>
                <option value="Open">Open</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

            {/* Clear Filters Action */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Chips & Sorting Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Results Count & Active Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500">
            Showing <strong className="text-slate-900">{properties.length}</strong> of{' '}
            <strong className="text-slate-900">{pagination.total}</strong> properties
          </span>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-teal-600 font-semibold hover:underline flex items-center gap-1 ml-2"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-slate-500 text-xs flex items-center gap-1 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value, page: 1 })}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-teal-500 shadow-2xs cursor-pointer"
          >
            <option value="newest">Newest Listed</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="area_desc">Area: Large to Small</option>
            <option value="oldest">Oldest Listed</option>
          </select>
        </div>
      </div>

      {/* Property Results Grid */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Searching verified property database..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchProperties} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry Search
          </Button>
        </div>
      ) : properties.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No matching properties found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any approved property listings matching your exact search filters.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Reset Search & Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => {
              const displayImage =
                prop.images && prop.images.length > 0
                  ? prop.images[0]
                  : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

              const isFavorited = !!favoritesMap[prop._id];

              return (
                <div
                  key={prop._id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col group relative"
                >
                  {/* Property Image & Badges */}
                  <Link to={`/properties/${prop._id}`} className="relative h-48 overflow-hidden bg-slate-100 block">
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
                  </Link>

                  {/* Favorite Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(e, prop._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-rose-600 transition shadow-xs cursor-pointer z-10"
                    title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFavorited ? 'text-rose-600 fill-rose-600 scale-110' : 'text-slate-600 hover:scale-110'
                      }`}
                    />
                  </button>

                  {/* Details Container */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <Link
                        to={`/properties/${prop._id}`}
                        className="font-bold text-slate-900 text-sm group-hover:text-teal-600 transition-colors line-clamp-1 block"
                      >
                        {prop.title}
                      </Link>
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
                </div>
              );
            })}
          </div>

          {/* Pagination Navigation */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                disabled={pagination.currentPage <= 1}
                onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setFilters({ ...filters, page: pageNum })}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold transition ${
                    pagination.currentPage === pageNum
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Properties;
