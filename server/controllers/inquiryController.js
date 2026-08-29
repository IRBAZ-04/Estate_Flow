const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const notify = require('../utils/notify');

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
        message: 'Please provide a valid propertyId and an inquiry message',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    // Prevent owner inquiring on their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send an inquiry on your own property',
      });
    }

    const inquiry = await Inquiry.create({
      property: property._id,
      user: req.user._id,
      owner: property.owner,
      name: name || req.user.name || 'User',
      email: email || req.user.email || 'user@email.com',
      phone: phone || req.user.phone || '',
      message: message.trim(),
      status: 'Pending',
    });

    // Notify Property Owner
    await notify({
      recipient: property.owner,
      type: 'inquiry_received',
      title: 'New Property Inquiry',
      message: `${req.user.name} sent an inquiry for "${property.title}": "${message.trim().slice(0, 80)}..."`,
      relatedId: inquiry._id,
      link: '/owner/inquiries',
    });

    const populatedInquiry = await Inquiry.findById(inquiry._id)
      .populate('property', 'title location price purpose images')
      .populate('user', 'name email phone profileImage')
      .populate('owner', 'name email phone');

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully to the property owner',
      data: populatedInquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get inquiries for current logged-in user
 * @route   GET /api/inquiries
 * @access  Private
 */
const getInquiries = async (req, res, next) => {
  try {
    const { type } = req.query;
    let query = {};

    if (req.user.role === 'admin') {
      query = {};
    } else if (req.user.role === 'owner') {
      if (type === 'sent') {
        query = { user: req.user._id };
      } else {
        query = { owner: req.user._id };
      }
    } else {
      query = { user: req.user._id };
    }

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title location price purpose images status')
      .populate('user', 'name email phone profileImage')
      .populate('owner', 'name email phone profileImage')
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
 * @desc    Get single inquiry details
 * @route   GET /api/inquiries/:id
 * @access  Private
 */
const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property', 'title location price purpose images')
      .populate('user', 'name email phone profileImage')
      .populate('owner', 'name email phone profileImage');

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
        message: 'Unauthorized: You do not have access to this inquiry',
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
 * @desc    Update inquiry status or reply (Owner/Admin)
 * @route   PUT /api/inquiries/:id
 * @access  Private
 */
const updateInquiry = async (req, res, next) => {
  try {
    const { status, reply, responseMessage } = req.body;
    let inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    const isOwner = inquiry.owner.toString() === req.user._id.toString();
    const isSender = inquiry.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isSender && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot update this inquiry',
      });
    }

    const updates = {};
    const replyText = reply || responseMessage;

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
      if (replyText) {
        updates.responseMessage = replyText.trim();
        updates.status = updates.status || 'Contacted';
      }
    } else if (isSender) {
      if (status === 'Closed') {
        updates.status = 'Closed';
      } else {
        return res.status(403).json({
          success: false,
          message: 'Inquirers can only mark an inquiry as Closed',
        });
      }
    }

    const originalUserId = inquiry.user;

    inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('property', 'title location price')
      .populate('user', 'name email phone')
      .populate('owner', 'name email phone');

    // Notify Inquiry Sender on update
    if (isOwner || isAdmin) {
      const recipientId = inquiry.user?._id || originalUserId;
      await notify({
        recipient: recipientId,
        type: 'inquiry_updated',
        title: `Inquiry Update: ${inquiry.status}`,
        message: `The owner updated your inquiry on "${inquiry.property?.title}": ${replyText ? `"${replyText.trim()}"` : `Status changed to ${inquiry.status}`}`,
        relatedId: inquiry._id,
        link: '/tenant/inquiries',
      });
    }

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
    const isOwner = inquiry.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isSender && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot delete this inquiry',
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
  updateInquiry,
  deleteInquiry,
};
