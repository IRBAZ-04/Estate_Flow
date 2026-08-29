import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Upload,
  Save,
  ArrowLeft,
  Check,
  AlertCircle,
  Sparkles,
  MapPin,
  X,
  Trash2,
} from 'lucide-react';
import propertyService from '../../services/propertyService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    purpose: 'Rent',
    price: '',
    location: '',
    address: '',
    bedrooms: '0',
    bathrooms: '0',
    area: '',
    furnishingStatus: 'Unfurnished',
    parking: 'Available',
    status: 'Pending',
    imageUrlInput: '',
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const propertyTypes = [
    'Apartment',
    'Villa',
    'Independent House',
    'Commercial',
    'Office',
    'Plot/Land',
    'Shop',
  ];

  const availableAmenities = [
    'Lift',
    'Security 24/7',
    'Power Backup',
    'Gym',
    'Swimming Pool',
    'Clubhouse',
    'Children Play Area',
    'Garden',
    'Gas Pipeline',
    'Covered Parking',
    'CCTV Surveillance',
    'Water Purifier',
    'Intercom',
    'Air Conditioned',
  ];

  useEffect(() => {
    const loadProperty = async () => {
      setFetching(true);
      try {
        const res = await propertyService.getPropertyById(id);
        const p = res.data;
        setFormData({
          title: p.title || '',
          description: p.description || '',
          propertyType: p.propertyType || 'Apartment',
          purpose: p.purpose || 'Rent',
          price: p.price || '',
          location: p.location || '',
          address: p.address || '',
          bedrooms: p.bedrooms !== undefined ? String(p.bedrooms) : '0',
          bathrooms: p.bathrooms !== undefined ? String(p.bathrooms) : '0',
          area: p.area || '',
          furnishingStatus: p.furnishingStatus || 'Unfurnished',
          parking: p.parking || 'Available',
          status: p.status || 'Pending',
          imageUrlInput: '',
        });
        setSelectedAmenities(p.amenities || []);
        setExistingImages(p.images || []);
      } catch (err) {
        setError(err.message || 'Failed to load property details');
      } finally {
        setFetching(false);
      }
    };

    loadProperty();
  }, [id]);

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, idx) => idx !== index));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles([...newImageFiles, ...files]);
  };

  const removeNewFile = (index) => {
    setNewImageFiles(newImageFiles.filter((_, idx) => idx !== index));
  };

  const addImageUrl = () => {
    if (formData.imageUrlInput.trim()) {
      setExistingImages([...existingImages, formData.imageUrlInput.trim()]);
      setFormData({ ...formData, imageUrlInput: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('propertyType', formData.propertyType);
      data.append('purpose', formData.purpose);
      data.append('price', formData.price);
      data.append('location', formData.location);
      data.append('address', formData.address);
      data.append('bedrooms', formData.bedrooms);
      data.append('bathrooms', formData.bathrooms);
      data.append('area', formData.area);
      data.append('furnishingStatus', formData.furnishingStatus);
      data.append('parking', formData.parking);
      data.append('status', formData.status);

      selectedAmenities.forEach((amenity) => {
        data.append('amenities', amenity);
      });

      existingImages.forEach((img) => {
        data.append('existingImages', img);
      });

      newImageFiles.forEach((file) => {
        data.append('images', file);
      });

      await propertyService.updateProperty(id, data);
      setLoading(false);
      navigate('/owner/properties');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to update property');
    }
  };

  if (fetching) {
    return (
      <div className="py-24 flex justify-center">
        <Loader size="lg" message="Loading property for editing..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <Link
            to="/owner/properties"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Properties</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Edit Property Listing
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Status:</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold uppercase outline-none"
          >
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Sold">Sold</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <Card padding="p-6" className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>1. Basic Property Information</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Type *
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 bg-white"
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Listing Purpose *
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 bg-white"
                >
                  <option value="Rent">Rent / Lease</option>
                  <option value="Sale">Sale / Purchase</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition resize-none"
              ></textarea>
            </div>
          </div>
        </Card>

        {/* Location & Dimensions */}
        <Card padding="p-6" className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>2. Location & Dimensions</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Locality *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Carpet Area (sq.ft) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Complete Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition"
              />
            </div>
          </div>
        </Card>

        {/* Specs & Furnishing */}
        <Card padding="p-6" className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            3. Specifications & Amenities
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Furnishing</label>
              <select
                value={formData.furnishingStatus}
                onChange={(e) => setFormData({ ...formData, furnishingStatus: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs bg-white"
              >
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Parking</label>
              <select
                value={formData.parking}
                onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs bg-white"
              >
                <option value="Available">Available</option>
                <option value="Covered">Covered</option>
                <option value="Open">Open</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableAmenities.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium text-left ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                      isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span>{amenity}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Existing & New Images */}
        <Card padding="p-6" className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Upload className="w-4 h-4 text-teal-600" />
            <span>4. Manage Property Images</span>
          </h2>

          {existingImages.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">Current Images:</label>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={img} alt="property" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-80 hover:opacity-100 transition shadow-xs"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-semibold text-slate-700">Add New Images:</label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileChange}
              className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-600 file:text-white cursor-pointer"
            />

            <div className="flex gap-2 pt-1">
              <input
                type="url"
                value={formData.imageUrlInput}
                onChange={(e) => setFormData({ ...formData, imageUrlInput: e.target.value })}
                placeholder="Or paste image URL"
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
                Add URL
              </Button>
            </div>
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link to="/owner/properties">
            <Button variant="outline" size="lg">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
