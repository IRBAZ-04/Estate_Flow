const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

/**
 * @desc    Create a new property inquiry
 * @route   POST /api/inquiries
 * @access  Private
 */
const createInquiry = async (req, res, next) => {
  try {
    const { propertyId, message, name, email, phone } = req.body;

    if (!propertyId || !message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide both propertyId and an inquiry message',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    // Prevent owner from inquiring on their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot submit an inquiry for your own property listing',
      });
    }

    const inquiry = await Inquiry.create({
      user: req.user._id,
      owner: property.owner,
      property: property._id,
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone || '',
      message: message.trim(),
      status: 'Pending',
    });

    const populatedInquiry = await Inquiry.findById(inquiry._id)
      .populate('property', 'title location price purpose images')
      .populate('owner', 'name email phone profileImage')
      .populate('user', 'name email phone');

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully to property owner',
      data: populatedInquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get inquiries for the current logged-in user
 * @route   GET /api/inquiries
 * @access  Private
 */
const getInquiries = async (req, res, next) => {
  try {
    const { type } = req.query; // 'sent' or 'received'
    let query = {};

    if (req.user.role === 'admin') {
      if (type === 'sent') query = { user: req.user._id };
      else if (type === 'received') query = { owner: req.user._id };
      else query = {}; // all inquiries
    } else if (req.user.role === 'owner') {
      if (type === 'sent') {
        query = { user: req.user._id };
      } else {
        query = { owner: req.user._id };
      }
    } else {
      // Tenants only see their sent inquiries
      query = { user: req.user._id };
    }

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title location price purpose images status')
      .populate('owner', 'name email phone profileImage')
      .populate('user', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single inquiry by ID
 * @route   GET /api/inquiries/:id
 * @access  Private
 */
const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property', 'title location price purpose images address')
      .populate('owner', 'name email phone profileImage')
      .populate('user', 'name email phone profileImage');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    const isSender = inquiry.user._id.toString() === req.user._id.toString();
    const isOwner = inquiry.owner._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isSender && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this inquiry',
      });
    }

    return res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update inquiry status or reply (Owner status update or Tenant close)
 * @route   PUT /api/inquiries/:id
 * @access  Private
 */
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status, responseMessage } = req.body;
    let inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    const isSender = inquiry.user.toString() === req.user._id.toString();
    const isOwner = inquiry.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isSender && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot modify this inquiry',
      });
    }

    const updates = {};

    // If owner or admin is updating
    if (isOwner || isAdmin) {
      if (status) {
        if (!['Pending', 'Contacted', 'Accepted', 'Rejected', 'Closed'].includes(status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid inquiry status: ${status}`,
          });
        }
        updates.status = status;
      }
      if (responseMessage !== undefined) {
        updates.responseMessage = responseMessage.trim();
      }
    } else if (isSender) {
      // Sender can only close the inquiry
      if (status && status !== 'Closed') {
        return res.status(403).json({
          success: false,
          message: 'As sender, you can only set status to Closed',
        });
      }
      if (status === 'Closed') {
        updates.status = 'Closed';
      }
    }

    inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('property', 'title location price purpose images')
      .populate('owner', 'name email phone')
      .populate('user', 'name email phone');

    return res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an inquiry
 * @route   DELETE /api/inquiries/:id
 * @access  Private
 */
const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    const isSender = inquiry.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isSender && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this inquiry',
      });
    }

    await Inquiry.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
};
