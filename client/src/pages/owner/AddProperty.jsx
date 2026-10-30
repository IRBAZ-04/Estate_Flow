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
import FieldError from '../../components/common/FieldError';
import useForm from '../../hooks/useForm';
import {
  validateRequired,
  validateRupeeAmount,
  validateArea,
  validateQuantity,
  validateDescription,
} from '../../utils/validators';

const AddProperty = () => {
  const navigate = useNavigate();

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
  ];

  const [selectedAmenities, setSelectedAmenities] = useState([
    'Lift',
    'Security 24/7',
    'Power Backup',
  ]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageError, setImageError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validators = {
    title: (val) => {
      const req = validateRequired(val, 'Property Title');
      if (req) return req;
      if (val.trim().length < 5) return 'Title must be at least 5 characters';
      if (val.trim().length > 120) return 'Title cannot exceed 120 characters';
      return null;
    },
    price: (val, all) =>
      validateRupeeAmount(val, all.purpose === 'Rent' ? 'Monthly Rent' : 'Total Price', {
        min: 100,
        max: 1000000000,
      }),
    description: (val) =>
      validateDescription(val, 'Detailed Description', { min: 20, max: 2000 }),
    location: (val) => validateRequired(val, 'City / Locality'),
    address: (val) => validateRequired(val, 'Street Address'),
    area: (val) => validateArea(val, 'Carpet Area'),
    bedrooms: (val) => validateQuantity(val, 'Bedrooms', { min: 0, max: 30 }),
    bathrooms: (val) => validateQuantity(val, 'Bathrooms', { min: 0, max: 30 }),
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
  } = useForm(
    {
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
    },
    validators
  );

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length + imageUrls.length > 5) {
      setImageError('You can upload a maximum of 5 images in total');
      return;
    }
    setImageFiles([...imageFiles, ...files]);
    setImageError('');
  };

  const removeFile = (index) => {
    setImageFiles(imageFiles.filter((_, idx) => idx !== index));
    setImageError('');
  };

  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (imageFiles.length + imageUrls.length >= 5) {
      setImageError('You can upload a maximum of 5 images in total');
      return;
    }
    try {
      new URL(imageUrlInput.trim());
    } catch {
      setImageError('Please enter a valid web image URL (starting with http:// or https://)');
      return;
    }
    setImageUrls([...imageUrls, imageUrlInput.trim()]);
    setImageUrlInput('');
    setImageError('');
  };

  const removeImageUrl = (index) => {
    setImageUrls(imageUrls.filter((_, idx) => idx !== index));
    setImageError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const isValid = validateAll();
    if (!isValid) return;

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', values.title.trim());
      data.append('description', values.description.trim());
      data.append('propertyType', values.propertyType);
      data.append('purpose', values.purpose);
      data.append('price', Number(values.price));
      data.append('location', values.location.trim());
      data.append('address', values.address.trim());
      data.append('bedrooms', Number(values.bedrooms));
      data.append('bathrooms', Number(values.bathrooms));
      data.append('area', Number(values.area));
      data.append('furnishingStatus', values.furnishingStatus);
      data.append('parking', values.parking);

      selectedAmenities.forEach((amenity) => {
        data.append('amenities', amenity);
      });

      imageUrls.forEach((url) => {
        data.append('images', url);
      });

      imageFiles.forEach((file) => {
        data.append('images', file);
      });

      await propertyService.createProperty(data);
      setLoading(false);
      navigate('/owner/properties');
    } catch (err) {
      setLoading(false);
      setServerError(err.message || 'Failed to create property listing');
    }
  };

  const getInputStyle = (fieldName) => {
    const hasError = touched[fieldName] && Boolean(errors[fieldName]);
    const isValid = touched[fieldName] && !errors[fieldName] && values[fieldName];
    if (hasError) return 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500';
    if (isValid) return 'border-emerald-400 bg-emerald-50/20 text-slate-800 focus:border-emerald-500';
    return 'border-slate-200 bg-slate-50 text-slate-800 focus:border-teal-500 focus:bg-white';
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

      {serverError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Section 1: Basic Details */}
        <Card padding="p-6" className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>1. Basic Property Information</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={values.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                placeholder="e.g. Spacious 3BHK Apartment with Balcony & City View"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs outline-none transition ${getInputStyle(
                  'title'
                )}`}
              />
              <FieldError
                error={errors.title}
                touched={touched.title}
                showSuccess
                successMessage="Valid property title"
                currentLength={values.title.length}
                maxLength={120}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={values.propertyType}
                  onChange={(e) => handleChange('propertyType', e.target.value)}
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
                  Listing Purpose <span className="text-rose-500">*</span>
                </label>
                <select
                  value={values.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 bg-white"
                >
                  <option value="Rent">Rent / Lease</option>
                  <option value="Sale">Sale / Purchase</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {values.purpose === 'Rent' ? 'Monthly Rent (₹) *' : 'Total Price (₹) *'}
                </label>
                <input
                  type="number"
                  name="price"
                  min="1"
                  value={values.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  onBlur={() => handleBlur('price')}
                  placeholder="e.g. 35000"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs outline-none transition ${getInputStyle(
                    'price'
                  )}`}
                />
                <FieldError
                  error={errors.price}
                  touched={touched.price}
                  showSuccess
                  successMessage="Valid amount"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
              </div>
              <textarea
                name="description"
                rows={4}
                value={values.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                placeholder="Describe the property highlights, nearby landmarks, security features, sunlight, ventilation, and community rules (minimum 20 characters)."
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs outline-none transition resize-none ${getInputStyle(
                  'description'
                )}`}
              ></textarea>
              <FieldError
                error={errors.description}
                touched={touched.description}
                showSuccess
                successMessage="Good description length"
                currentLength={values.description.length}
                maxLength={2000}
              />
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
                City / Locality <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={values.location}
                onChange={(e) => handleChange('location', e.target.value)}
                onBlur={() => handleBlur('location')}
                placeholder="e.g. Adyar, Chennai"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs outline-none transition ${getInputStyle(
                  'location'
                )}`}
              />
              <FieldError
                error={errors.location}
                touched={touched.location}
                showSuccess
                successMessage="Locality provided"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Carpet Area (sq.ft) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="area"
                min="10"
                value={values.area}
                onChange={(e) => handleChange('area', e.target.value)}
                onBlur={() => handleBlur('area')}
                placeholder="e.g. 1450"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs outline-none transition ${getInputStyle(
                  'area'
                )}`}
              />
              <FieldError
                error={errors.area}
                touched={touched.area}
                showSuccess
                successMessage="Valid area"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Complete Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={values.address}
                onChange={(e) => handleChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                placeholder="Door No, Building Name, Street, Landmark"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs outline-none transition ${getInputStyle(
                  'address'
                )}`}
              />
              <FieldError
                error={errors.address}
                touched={touched.address}
                showSuccess
                successMessage="Address provided"
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
                Bedrooms (0-30)
              </label>
              <input
                type="number"
                name="bedrooms"
                min="0"
                max="30"
                value={values.bedrooms}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
                onBlur={() => handleBlur('bedrooms')}
                className={`w-full px-3.5 py-2 border rounded-xl text-xs outline-none transition ${getInputStyle(
                  'bedrooms'
                )}`}
              />
              <FieldError error={errors.bedrooms} touched={touched.bedrooms} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bathrooms (0-30)
              </label>
              <input
                type="number"
                name="bathrooms"
                min="0"
                max="30"
                value={values.bathrooms}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
                onBlur={() => handleBlur('bathrooms')}
                className={`w-full px-3.5 py-2 border rounded-xl text-xs outline-none transition ${getInputStyle(
                  'bathrooms'
                )}`}
              />
              <FieldError error={errors.bathrooms} touched={touched.bathrooms} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Furnishing
              </label>
              <select
                value={values.furnishingStatus}
                onChange={(e) => handleChange('furnishingStatus', e.target.value)}
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
                value={values.parking}
                onChange={(e) => handleChange('parking', e.target.value)}
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
            4. Select Amenities & Features ({selectedAmenities.length} selected)
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
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-600" />
              <span>5. Property Images (Max 5)</span>
            </h2>
            <span className="text-xs text-slate-400">
              {imageFiles.length + imageUrls.length} / 5 photos
            </span>
          </div>

          {imageError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{imageError}</span>
            </div>
          )}

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
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
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
