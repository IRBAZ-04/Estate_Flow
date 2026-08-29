const Property = require('../models/Property');

/**
 * @desc    Get all public approved/available properties with multi-parameter search, filtering, sorting, and pagination
 * @route   GET /api/properties
 * @access  Public
 */
const getPublicProperties = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      propertyType,
      purpose,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      furnishingStatus,
      parking,
      availability,
      sortBy = 'newest',
      page = 1,
      limit = 9,
    } = req.query;

    // Filter only approved/available properties by default for public consumption
    const query = {
      status: { $in: ['Approved', 'Available'] },
    };

    // If specific availability is requested (e.g. 'Available', 'Rented', 'Sold')
    if (availability && availability !== 'All') {
      query.status = availability;
    }

    // Keyword search over title, description, location, or address
    if (keyword && keyword.trim() !== '') {
      const cleanKeyword = keyword.trim();
      query.$or = [
        { title: { $regex: cleanKeyword, $options: 'i' } },
        { description: { $regex: cleanKeyword, $options: 'i' } },
        { location: { $regex: cleanKeyword, $options: 'i' } },
        { address: { $regex: cleanKeyword, $options: 'i' } },
      ];
    }

    // Specific location filter
    if (location && location.trim() !== '' && location !== 'All') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    // Property Type filter
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // Purpose filter (Rent / Sale)
    if (purpose && purpose !== 'All') {
      query.purpose = purpose;
    }

    // Furnishing Status filter
    if (furnishingStatus && furnishingStatus !== 'All') {
      query.furnishingStatus = furnishingStatus;
    }

    // Parking filter
    if (parking && parking !== 'All') {
      query.parking = parking;
    }

    // Bedrooms filter
    if (bedrooms && bedrooms !== 'All' && !isNaN(bedrooms)) {
      const bedCount = Number(bedrooms);
      // If 4+, match greater than or equal to 4
      if (bedCount >= 4) {
        query.bedrooms = { $gte: 4 };
      } else {
        query.bedrooms = bedCount;
      }
    }

    // Bathrooms filter
    if (bathrooms && bathrooms !== 'All' && !isNaN(bathrooms)) {
      const bathCount = Number(bathrooms);
      if (bathCount >= 3) {
        query.bathrooms = { $gte: 3 };
      } else {
        query.bathrooms = bathCount;
      }
    }

    // Price range filters
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(minPrice)) query.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(maxPrice)) query.price.$lte = Number(maxPrice);
    }

    // Sorting presets
    let sortOptions = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'price_asc') sortOptions = { price: 1 };
    if (sortBy === 'price_desc') sortOptions = { price: -1 };
    if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
    if (sortBy === 'area_desc') sortOptions = { area: -1 };

    // Pagination calculations
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, Math.min(50, parseInt(limit, 10) || 9));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone profileImage role')
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / pageSize) || 1,
      currentPage: pageNumber,
      limit: pageSize,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all properties owned by current logged-in owner
 * @route   GET /api/properties/my
 * @access  Private (Owner / Admin)
 */
const getMyProperties = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' && req.query.all === 'true'
      ? {}
      : { owner: req.user._id };

    const properties = await Property.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    const metrics = {
      total: properties.length,
      pending: properties.filter((p) => p.status === 'Pending').length,
      approved: properties.filter((p) => p.status === 'Approved' || p.status === 'Available').length,
      rentedOrSold: properties.filter((p) => p.status === 'Rented' || p.status === 'Sold').length,
      rejected: properties.filter((p) => p.status === 'Rejected').length,
    };

    return res.status(200).json({
      success: true,
      count: properties.length,
      metrics,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single property by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone profileImage role createdAt'
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new property listing
 * @route   POST /api/properties
 * @access  Private (Owner / Admin)
 */
const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      purpose,
      price,
      location,
      address,
      bedrooms,
      bathrooms,
      area,
      furnishingStatus,
      parking,
      amenities,
      images: bodyImages,
    } = req.body;

    if (!title || !description || !propertyType || !purpose || !price || !location || !address || !area) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields: title, description, propertyType, purpose, price, location, address, and area',
      });
    }

    let propertyImages = [];
    if (req.files && req.files.length > 0) {
      propertyImages = req.files.map((file) => `/uploads/properties/${file.filename}`);
    }

    if (bodyImages) {
      const parsedImages = Array.isArray(bodyImages)
        ? bodyImages
        : typeof bodyImages === 'string'
        ? bodyImages.split(',').map((img) => img.trim()).filter(Boolean)
        : [];
      propertyImages = [...propertyImages, ...parsedImages];
    }

    if (propertyImages.length === 0) {
      propertyImages = [
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
      ];
    }

    let parsedAmenities = [];
    if (amenities) {
      parsedAmenities = Array.isArray(amenities)
        ? amenities
        : typeof amenities === 'string'
        ? amenities.split(',').map((a) => a.trim()).filter(Boolean)
        : [];
    }

    const initialStatus = req.user.role === 'admin' ? 'Approved' : 'Pending';

    const property = await Property.create({
      title: title.trim(),
      description: description.trim(),
      propertyType,
      purpose,
      price: Number(price),
      location: location.trim(),
      address: address.trim(),
      bedrooms: bedrooms !== undefined ? Number(bedrooms) : 0,
      bathrooms: bathrooms !== undefined ? Number(bathrooms) : 0,
      area: Number(area),
      furnishingStatus: furnishingStatus || 'Unfurnished',
      parking: parking || 'Available',
      amenities: parsedAmenities,
      images: propertyImages,
      owner: req.user._id,
      status: initialStatus,
    });

    return res.status(201).json({
      success: true,
      message:
        initialStatus === 'Pending'
          ? 'Property created successfully and submitted for Admin approval'
          : 'Property created and published successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing property
 * @route   PUT /api/properties/:id
 * @access  Private (Owner / Admin)
 */
const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit properties that you own',
      });
    }

    const {
      title,
      description,
      propertyType,
      purpose,
      price,
      location,
      address,
      bedrooms,
      bathrooms,
      area,
      furnishingStatus,
      parking,
      amenities,
      status,
      existingImages,
    } = req.body;

    const updates = {};
    if (title) updates.title = title.trim();
    if (description) updates.description = description.trim();
    if (propertyType) updates.propertyType = propertyType;
    if (purpose) updates.purpose = purpose;
    if (price !== undefined) updates.price = Number(price);
    if (location) updates.location = location.trim();
    if (address) updates.address = address.trim();
    if (bedrooms !== undefined) updates.bedrooms = Number(bedrooms);
    if (bathrooms !== undefined) updates.bathrooms = Number(bathrooms);
    if (area !== undefined) updates.area = Number(area);
    if (furnishingStatus) updates.furnishingStatus = furnishingStatus;
    if (parking) updates.parking = parking;

    if (amenities !== undefined) {
      updates.amenities = Array.isArray(amenities)
        ? amenities
        : typeof amenities === 'string'
        ? amenities.split(',').map((a) => a.trim()).filter(Boolean)
        : [];
    }

    let updatedImages = [];
    if (existingImages) {
      updatedImages = Array.isArray(existingImages)
        ? existingImages
        : typeof existingImages === 'string'
        ? existingImages.split(',').map((img) => img.trim()).filter(Boolean)
        : [];
    } else {
      updatedImages = property.images;
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/properties/${file.filename}`);
      updatedImages = [...updatedImages, ...newImages];
    }
    updates.images = updatedImages;

    if (status) {
      if (req.user.role === 'admin') {
        updates.status = status;
      } else if (['Available', 'Rented', 'Sold'].includes(status)) {
        updates.status = status;
      }
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a property
 * @route   DELETE /api/properties/:id
 * @access  Private (Owner / Admin)
 */
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete properties that you own',
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Property listing deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update property status (Admin approval or Owner status toggle)
 * @route   PATCH /api/properties/:id/status
 * @access  Private (Owner / Admin)
 */
const updatePropertyStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    if (req.user.role === 'admin') {
      property.status = status;
      await property.save();
      return res.status(200).json({
        success: true,
        message: `Property status changed to '${status}' by Admin`,
        data: property,
      });
    }

    if (property.owner.toString() === req.user._id.toString()) {
      if (!['Available', 'Rented', 'Sold'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Owners can only update status between Available, Rented, and Sold',
        });
      }
      property.status = status;
      await property.save();
      return res.status(200).json({
        success: true,
        message: `Property status updated to '${status}'`,
        data: property,
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Unauthorized to change status for this property',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
};
