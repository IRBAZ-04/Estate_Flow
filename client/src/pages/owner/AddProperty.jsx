import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Upload,
  Plus,
  ArrowLeft,
  Check,
  AlertCircle,
  Sparkles,
  MapPin,
  X,
} from 'lucide-react';
import propertyService from '../../services/propertyService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const AddProperty = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    purpose: 'Rent',
    price: '',
    location: '',
    address: '',
    bedrooms: '2',
    bathrooms: '2',
    area: '',
    furnishingStatus: 'Semi-Furnished',
    parking: 'Available',
    imageUrlInput: '',
  });

  const [selectedAmenities, setSelectedAmenities] = useState([
    'Lift',
    'Security 24/7',
    'Power Backup',
  ]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
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

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      setError('You can upload a maximum of 5 images');
      return;
    }
    setImageFiles([...imageFiles, ...files]);
    setError(null);
  };

  const removeFile = (index) => {
    setImageFiles(imageFiles.filter((_, idx) => idx !== index));
  };

  const addImageUrl = () => {
    if (formData.imageUrlInput.trim()) {
      setImageUrls([...imageUrls, formData.imageUrlInput.trim()]);
      setFormData({ ...formData, imageUrlInput: '' });
    }
  };

  const removeImageUrl = (index) => {
    setImageUrls(imageUrls.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.description || !formData.price || !formData.location || !formData.address || !formData.area) {
      setError('Please fill in all mandatory fields');
      return;
    }

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

      // Append amenities
      selectedAmenities.forEach((amenity) => {
        data.append('amenities', amenity);
      });

      // Append image URLs
      imageUrls.forEach((url) => {
        data.append('images', url);
      });

      // Append actual files
      imageFiles.forEach((file) => {
        data.append('images', file);
      });

      await propertyService.createProperty(data);
      setLoading(false);
      navigate('/owner/properties');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to create property listing');
    }
  };

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
            Post a New Property Listing
          </h1>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
          Initial Status: Pending Approval
        </span>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Details */}
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
                placeholder="e.g. Spacious 3BHK Apartment with Balcony & City View"
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
                  {formData.purpose === 'Rent' ? 'Monthly Rent (₹) *' : 'Total Price (₹) *'}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 35000"
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
                placeholder="Describe the property highlights, nearby landmarks, security features, sunlight, etc."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition resize-none"
              ></textarea>
            </div>
          </div>
        </Card>

        {/* Section 2: Location & Dimensions */}
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
                placeholder="e.g. Adyar, Chennai"
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
                placeholder="e.g. 1450"
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
                placeholder="Door No, Building Name, Street, Landmark"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition"
              />
            </div>
          </div>
        </Card>

        {/* Section 3: Specs & Furnishing */}
        <Card padding="p-6" className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>3. Specifications & Furnishing</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Furnishing
              </label>
              <select
                value={formData.furnishingStatus}
                onChange={(e) => setFormData({ ...formData, furnishingStatus: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 bg-white"
              >
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parking
              </label>
              <select
                value={formData.parking}
                onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 bg-white"
              >
                <option value="Available">Available</option>
                <option value="Covered">Covered</option>
                <option value="Open">Open</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Section 4: Amenities Checkbox Grid */}
        <Card padding="p-6" className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            4. Select Amenities & Features
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {availableAmenities.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                      isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                  <span>{amenity}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Section 5: Image Uploads */}
        <Card padding="p-6" className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Upload className="w-4 h-4 text-teal-600" />
            <span>5. Property Images (Max 5)</span>
          </h2>

          <div className="space-y-4">
            {/* File Upload Zone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-2xl p-6 text-center bg-slate-50/50 transition">
              <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                Upload image files (JPEG, PNG, WEBP)
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Maximum size: 5MB per file</p>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="mt-3 text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer"
              />
            </div>

            {/* Selected File Badges */}
            {imageFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {imageFiles.map((file, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs font-medium"
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-teal-600 hover:text-rose-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Or Image URL Input */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Or Add Image Web URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.imageUrlInput}
                  onChange={(e) => setFormData({ ...formData, imageUrlInput: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500"
                />
                <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
                  Add URL
                </Button>
              </div>

              {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {imageUrls.map((url, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 border border-cyan-200 text-cyan-800 rounded-lg text-xs font-medium truncate max-w-xs"
                    >
                      <span className="truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => removeImageUrl(idx)}
                        className="text-cyan-600 hover:text-rose-600 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
            icon={<Plus className="w-4 h-4" />}
          >
            Publish Property Listing
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
