import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Trash2,
  Building2,
  ArrowLeft,
  Search,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import favoriteService from '../services/favoriteService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await favoriteService.getFavorites();
      setFavorites(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load favorite properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (propertyId) => {
    // Optimistic UI removal
    setFavorites(favorites.filter((f) => f.property?._id !== propertyId));
    try {
      await favoriteService.removeFavorite(propertyId);
    } catch (err) {
      alert(err.message || 'Failed to remove property from favorites');
      fetchFavorites();
    }
  };

  const formatPrice = (price, purpose) => {
    const formatted = new Intl.NumberFormat('en-IN').format(price);
    return purpose === 'Rent' ? `₹ ${formatted} / mo` : `₹ ${formatted}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Property Catalog</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Saved Favorite Properties</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Properties you have bookmarked for quick access, visit scheduling, and inquiries.
          </p>
        </div>

        <Link to="/properties">
          <Button variant="outline" size="sm" icon={<Search className="w-3.5 h-3.5" />}>
            Explore More Properties
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" message="Loading your saved properties..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchFavorites} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry Loading
          </Button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">Your favorites list is empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Save properties you like by tapping the heart icon on any listing card.
            </p>
          </div>
          <Link to="/properties">
            <Button variant="primary" size="md" icon={<Search className="w-4 h-4" />}>
              Discover Properties
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <span className="text-xs text-slate-500">
            You have <strong className="text-slate-900">{favorites.length}</strong> saved properties
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => {
              const prop = fav.property;
              if (!prop) return null;

              const displayImage =
                prop.images && prop.images.length > 0
                  ? prop.images[0]
                  : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={prop._id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col group relative"
                >
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

                  {/* Remove Favorite Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFavorite(prop._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-rose-600 hover:bg-rose-50 transition shadow-xs cursor-pointer z-10"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

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
        </div>
      )}
    </div>
  );
};

export default Favorites;
