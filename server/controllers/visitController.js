const Visit = require('../models/Visit');
const Property = require('../models/Property');

/**
 * @desc    Schedule a new property visit
 * @route   POST /api/visits
 * @access  Private
 */
const createVisit = async (req, res, next) => {
  try {
    const { propertyId, date, time, notes } = req.body;

    if (!propertyId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide propertyId, date, and time slot for the visit',
      });
    }

    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid visit date format provided',
      });
    }

    if (requestedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Visit date cannot be scheduled in the past',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    // Owner cannot schedule a visit for their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot schedule a visit for your own property listing',
      });
    }

    // Check for duplicate pending/confirmed visit by the same user on the same date
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingVisit = await Visit.findOne({
      property: propertyId,
      requester: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['Pending', 'Confirmed', 'Rescheduled'] },
    });

    if (existingVisit) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active visit scheduled for this property on this date',
      });
    }

    const visit = await Visit.create({
      property: property._id,
      requester: req.user._id,
      owner: property.owner,
      date: requestedDate,
      time: time.trim(),
      notes: notes ? notes.trim() : '',
      status: 'Pending',
    });

    const populatedVisit = await Visit.findById(visit._id)
      .populate('property', 'title location address price purpose images')
      .populate('owner', 'name email phone profileImage')
      .populate('requester', 'name email phone');

    return res.status(201).json({
      success: true,
      message: 'Visit request submitted successfully. Awaiting owner confirmation.',
      data: populatedVisit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get visit requests for current user (Owner received vs Tenant requested)
 * @route   GET /api/visits
 * @access  Private
 */
const getVisits = async (req, res, next) => {
  try {
    const { type } = req.query; // 'sent' or 'received'
    let query = {};

    if (req.user.role === 'admin') {
      if (type === 'sent') query = { requester: req.user._id };
      else if (type === 'received') query = { owner: req.user._id };
      else query = {};
    } else if (req.user.role === 'owner') {
      if (type === 'sent') query = { requester: req.user._id };
      else query = { owner: req.user._id };
    } else {
      query = { requester: req.user._id };
    }

    const visits = await Visit.find(query)
      .populate('property', 'title location address price purpose images status')
      .populate('owner', 'name email phone profileImage')
      .populate('requester', 'name email phone profileImage')
      .sort({ date: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: visits.length,
      data: visits,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single visit request by ID
 * @route   GET /api/visits/:id
 * @access  Private
 */
const getVisitById = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id)
      .populate('property', 'title location address price purpose images')
      .populate('owner', 'name email phone profileImage')
      .populate('requester', 'name email phone profileImage');

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit appointment not found',
      });
    }

    const isRequester = visit.requester._id.toString() === req.user._id.toString();
    const isOwner = visit.owner._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRequester && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this visit request',
      });
    }

    return res.status(200).json({
      success: true,
      data: visit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update visit request status (Owner accepts, rejects, or reschedules)
 * @route   PUT /api/visits/:id
 * @access  Private
 */
const updateVisitStatus = async (req, res, next) => {
  try {
    const { status, date, time, ownerFeedback, notes } = req.body;
    let visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit request not found',
      });
    }

    const isOwner = visit.owner.toString() === req.user._id.toString();
    const isRequester = visit.requester.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin && !isRequester) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this visit request',
      });
    }

    const updates = {};

    // Requester can only cancel the visit
    if (isRequester && !isOwner && !isAdmin) {
      if (status && status !== 'Cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Requesters can only cancel visits',
        });
      }
      updates.status = 'Cancelled';
      if (notes) updates.notes = notes.trim();
    } else {
      // Owner or Admin updates
      if (status) {
        if (!['Pending', 'Confirmed', 'Rejected', 'Rescheduled', 'Completed', 'Cancelled'].includes(status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid visit status: ${status}`,
          });
        }
        updates.status = status;
      }

      if (date) {
        const newDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (newDate < today) {
          return res.status(400).json({
            success: false,
            message: 'Rescheduled date cannot be in the past',
          });
        }
        updates.date = newDate;
      }

      if (time) updates.time = time.trim();
      if (ownerFeedback !== undefined) updates.ownerFeedback = ownerFeedback.trim();
    }

    visit = await Visit.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('property', 'title location address price purpose images')
      .populate('owner', 'name email phone')
      .populate('requester', 'name email phone');

    return res.status(200).json({
      success: true,
      message: `Visit request status updated to '${visit.status}'`,
      data: visit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a visit request (Requester action)
 * @route   PATCH /api/visits/:id/cancel
 * @access  Private
 */
const cancelVisit = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit request not found',
      });
    }

    const isRequester = visit.requester.toString() === req.user._id.toString();
    const isOwner = visit.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRequester && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this visit',
      });
    }

    visit.status = 'Cancelled';
    await visit.save();

    return res.status(200).json({
      success: true,
      message: 'Visit request has been cancelled',
      data: visit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a visit record
 * @route   DELETE /api/visits/:id
 * @access  Private
 */
const deleteVisit = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit request not found',
      });
    }

    const isRequester = visit.requester.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRequester && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this visit request',
      });
    }

    await Visit.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Visit request deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVisit,
  getVisits,
  getVisitById,
  updateVisitStatus,
  cancelVisit,
  deleteVisit,
};
