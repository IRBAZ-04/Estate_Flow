import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Car,
  Sofa,
  CheckCircle2,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Calendar,
  MessageSquare,
  Edit,
  Shield,
  Tag,
  Share2,
  Heart,
} from 'lucide-react';
import propertyService from '../services/propertyService';
import favoriteService from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await propertyService.getPropertyById(id);
        setProperty(res.data);
      } catch (err) {
        setError(err.message || 'Property not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    const checkFav = async () => {
      if (!isAuthenticated || !id) return;
      try {
        const res = await favoriteService.checkFavorite(id);
        setIsFavorited(res.isFavorite);
      } catch (err) {
        console.warn('[Favorite Check]:', err.message);
      }
    };

    checkFav();
  }, [id, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to save properties to your favorites.');
      return;
    }

    const nextState = !isFavorited;
    setIsFavorited(nextState);

    try {
      if (nextState) {
        await favoriteService.addFavorite(id);
      } else {
        await favoriteService.removeFavorite(id);
      }
    } catch (err) {
      setIsFavorited(!nextState);
      alert(err.message || 'Failed to update favorite');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader size="lg" message="Loading property details..." />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-2xl border border-rose-200 text-center space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-rose-800">Unable to load property</h2>
        <p className="text-xs text-slate-500">{error || 'This listing does not exist or may have been removed.'}</p>
        <Link to="/properties">
          <Button variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Properties
          </Button>
        </Link>
      </div>
    );
  }

  const isOwner = user && property.owner && user._id === property.owner._id;
  const isAdmin = user && user.role === 'admin';

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'];

  const formatPrice = (price, purpose) => {
    const formatted = new Intl.NumberFormat('en-IN').format(price);
    return purpose === 'Rent' ? `₹ ${formatted} / month` : `₹ ${formatted}`;
  };

  const statusColors = {
    Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Rejected: 'bg-rose-100 text-rose-800 border-rose-200',
    Rented: 'bg-blue-100 text-blue-800 border-blue-200',
    Sold: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to listings</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              isFavorited
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isFavorited ? 'text-rose-600 fill-rose-600' : 'text-slate-500'}`}
            />
            <span>{isFavorited ? 'Saved in Favorites' : 'Save to Favorites'}</span>
          </button>

          {(isOwner || isAdmin) && (
            <Link to={`/owner/properties/edit/${property._id}`}>
              <Button variant="outline" size="sm" icon={<Edit className="w-3.5 h-3.5" />}>
                Edit Property
              </Button>
            </Link>
          )}

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              statusColors[property.status] || 'bg-slate-100 text-slate-700'
            }`}
          >
            {property.status}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Gallery & Details, Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Gallery, Title, Description, Amenities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="h-80 sm:h-[420px] rounded-2xl overflow-hidden bg-slate-900 shadow-md">
              <img
                src={images[selectedImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`h-20 w-24 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      selectedImage === idx
                        ? 'border-teal-600 ring-2 ring-teal-500/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Location Header */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-slate-900 text-white">
                For {property.purpose}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                {property.propertyType}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {property.title}
            </h1>

            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{property.address}, {property.location}</span>
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-semibold text-slate-400 block">Price</span>
                <span className="text-2xl font-black text-teal-700">
                  {formatPrice(property.price, property.purpose)}
                </span>
              </div>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card padding="p-4" className="text-center space-y-1">
              <Bed className="w-5 h-5 text-teal-600 mx-auto" />
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Bedrooms</span>
              <span className="text-sm font-extrabold text-slate-900">{property.bedrooms || 'N/A'}</span>
            </Card>

            <Card padding="p-4" className="text-center space-y-1">
              <Bath className="w-5 h-5 text-teal-600 mx-auto" />
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Bathrooms</span>
              <span className="text-sm font-extrabold text-slate-900">{property.bathrooms || 'N/A'}</span>
            </Card>

            <Card padding="p-4" className="text-center space-y-1">
              <Maximize2 className="w-5 h-5 text-teal-600 mx-auto" />
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Carpet Area</span>
              <span className="text-sm font-extrabold text-slate-900">{property.area} sq.ft</span>
            </Card>

            <Card padding="p-4" className="text-center space-y-1">
              <Sofa className="w-5 h-5 text-teal-600 mx-auto" />
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Furnishing</span>
              <span className="text-xs font-bold text-slate-900 truncate block">{property.furnishingStatus}</span>
            </Card>
          </div>

          {/* Description */}
          <Card className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">Property Overview</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </Card>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <Card className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Features & Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Sidebar: Owner Contact Card & Action Workflows */}
        <div className="space-y-6">
          {/* Owner Card */}
          <Card className="space-y-4 shadow-md">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {property.owner?.name?.charAt(0) || 'O'}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-600 block">Listed By</span>
                <h3 className="font-bold text-slate-900 text-sm">{property.owner?.name || 'Property Owner'}</h3>
                <span className="text-[11px] text-slate-400 font-medium">Verified Property Owner</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              {property.owner?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{property.owner.phone}</span>
                </div>
              )}
              {property.owner?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{property.owner.email}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                icon={<Calendar className="w-4 h-4" />}
                onClick={() => alert('Visit Scheduling will be active in Phase 5!')}
              >
                Schedule a Visit
              </Button>

              <Button
                variant="outline"
                size="md"
                className="w-full"
                icon={<MessageSquare className="w-4 h-4" />}
                onClick={() => alert('Inquiries messaging will be active in Phase 5!')}
              >
                Send Direct Inquiry
              </Button>
            </div>
          </Card>

          {/* Quick Property Spec Summary */}
          <Card className="space-y-3 bg-slate-900 text-white border-none">
            <h3 className="font-bold text-xs uppercase tracking-wider text-teal-400">
              Listing Details
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Property ID:</span>
                <span className="font-mono text-[11px] text-slate-400">{property._id.slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Parking:</span>
                <span className="font-medium text-white">{property.parking}</span>
              </div>
              <div className="flex justify-between">
                <span>Furnishing:</span>
                <span className="font-medium text-white">{property.furnishingStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>Listed Date:</span>
                <span className="font-medium text-white">
                  {new Date(property.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
