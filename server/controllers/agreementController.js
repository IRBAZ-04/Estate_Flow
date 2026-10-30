const Agreement = require('../models/Agreement');
const Property = require('../models/Property');
const User = require('../models/User');
const notify = require('../utils/notify');

/**
 * @desc    Create a new rental agreement
 * @route   POST /api/agreements
 * @access  Private (Owner / Admin)
 */
const createAgreement = async (req, res, next) => {
  try {
    const {
      propertyId,
      tenantId,
      tenantEmail,
      monthlyRent,
      securityDeposit,
      startDate,
      endDate,
      terms,
      status = 'Active',
    } = req.body;

    if (!propertyId || (!tenantId && !tenantEmail) || !monthlyRent || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide propertyId, tenant info, monthlyRent, startDate, and endDate',
      });
    }

    if (isNaN(Number(monthlyRent)) || Number(monthlyRent) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Monthly rent must be a valid positive amount',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start or end date format provided',
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'Agreement end date must be after the start date',
      });
    }

    // Verify Property & Ownership
    const property = await Property.findById(propertyId);
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
        message: 'Unauthorized: You can only create agreements for your own properties',
      });
    }

    // Find and verify Tenant
    let tenantUser = null;
    if (tenantId) {
      tenantUser = await User.findById(tenantId);
    } else if (tenantEmail) {
      tenantUser = await User.findOne({ email: tenantEmail.toLowerCase().trim() });
    }

    if (!tenantUser) {
      return res.status(404).json({
        success: false,
        message: 'Tenant user not found with the provided details',
      });
    }

    if (tenantUser._id.toString() === property.owner.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Property owner cannot be the tenant on the same agreement',
      });
    }

    const agreement = await Agreement.create({
      property: property._id,
      owner: property.owner,
      tenant: tenantUser._id,
      monthlyRent: Number(monthlyRent),
      securityDeposit: securityDeposit !== undefined ? Number(securityDeposit) : 0,
      startDate: start,
      endDate: end,
      terms: terms || undefined,
      status: status || 'Active',
    });

    // If agreement is Active, update property status to Rented
    if (agreement.status === 'Active') {
      property.status = 'Rented';
      await property.save();
    }

    // Notify Tenant
    await notify({
      recipient: tenantUser._id,
      type: 'agreement_created',
      title: 'New Rental Agreement Created',
      message: `${req.user.name} created a residential lease agreement for "${property.title}" (₹ ${monthlyRent}/mo).`,
      relatedId: agreement._id,
      link: `/agreements/${agreement._id}`,
    });

    const populatedAgreement = await Agreement.findById(agreement._id)
      .populate('property', 'title location address price purpose images status')
      .populate('owner', 'name email phone profileImage')
      .populate('tenant', 'name email phone profileImage');

    return res.status(201).json({
      success: true,
      message: 'Rental agreement created successfully',
      data: populatedAgreement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get agreements for current user (Owner vs Tenant)
 * @route   GET /api/agreements
 * @access  Private
 */
const getAgreements = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      query = {};
    } else if (req.user.role === 'owner') {
      query = { owner: req.user._id };
    } else {
      query = { tenant: req.user._id };
    }

    const agreements = await Agreement.find(query)
      .populate('property', 'title location address price purpose images status')
      .populate('owner', 'name email phone profileImage')
      .populate('tenant', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: agreements.length,
      data: agreements,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single agreement by ID
 * @route   GET /api/agreements/:id
 * @access  Private
 */
const getAgreementById = async (req, res, next) => {
  try {
    const agreement = await Agreement.findById(req.params.id)
      .populate('property', 'title location address price purpose images status bedrooms bathrooms area furnishingStatus')
      .populate('owner', 'name email phone profileImage')
      .populate('tenant', 'name email phone profileImage');

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Rental agreement not found',
      });
    }

    const isOwner = agreement.owner._id.toString() === req.user._id.toString();
    const isTenant = agreement.tenant._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isTenant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot access this rental agreement',
      });
    }

    return res.status(200).json({
      success: true,
      data: agreement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update agreement details or status
 * @route   PUT /api/agreements/:id
 * @access  Private (Owner / Admin)
 */
const updateAgreement = async (req, res, next) => {
  try {
    let agreement = await Agreement.findById(req.params.id);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Rental agreement not found',
      });
    }

    const isOwner = agreement.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the property owner or admin can modify this agreement',
      });
    }

    const { monthlyRent, securityDeposit, startDate, endDate, terms, status } = req.body;

    const updates = {};
    if (monthlyRent !== undefined) updates.monthlyRent = Number(monthlyRent);
    if (securityDeposit !== undefined) updates.securityDeposit = Number(securityDeposit);
    if (terms !== undefined) updates.terms = terms.trim();

    if (startDate) updates.startDate = new Date(startDate);
    if (endDate) updates.endDate = new Date(endDate);

    if (updates.startDate && updates.endDate && updates.endDate <= updates.startDate) {
      return res.status(400).json({
        success: false,
        message: 'Agreement end date must be after the start date',
      });
    }

    if (status) {
      if (!['Draft', 'Active', 'Expired', 'Terminated'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid agreement status: ${status}`,
        });
      }
      updates.status = status;

      // Synchronize property status
      const property = await Property.findById(agreement.property);
      if (property) {
        if (status === 'Active') {
          property.status = 'Rented';
          await property.save();
        } else if (status === 'Terminated' || status === 'Expired') {
          property.status = 'Available';
          await property.save();
        }
      }
    }

    agreement = await Agreement.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('property', 'title location address price purpose images status')
      .populate('owner', 'name email phone profileImage')
      .populate('tenant', 'name email phone profileImage');

    return res.status(200).json({
      success: true,
      message: 'Rental agreement updated successfully',
      data: agreement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an agreement
 * @route   DELETE /api/agreements/:id
 * @access  Private (Owner / Admin)
 */
const deleteAgreement = async (req, res, next) => {
  try {
    const agreement = await Agreement.findById(req.params.id);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Rental agreement not found',
      });
    }

    const isOwner = agreement.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot delete this agreement',
      });
    }

    await Agreement.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Rental agreement deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAgreement,
  getAgreements,
  getAgreementById,
  updateAgreement,
  deleteAgreement,
};
