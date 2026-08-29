const Visit = require('../models/Visit');
const Property = require('../models/Property');
const notify = require('../utils/notify');

/**
 * @desc    Schedule a property visit request
 * @route   POST /api/visits
 * @access  Private
 */
const createVisit = async (req, res, next) => {
  try {
    const { propertyId, date, time, notes } = req.body;

    if (!propertyId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide propertyId, date, and preferred time for the visit',
      });
    }

    const scheduledDate = new Date(date);
    if (isNaN(scheduledDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format provided for visit',
      });
    }

    // Prevent past date bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (scheduledDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Visit date cannot be in the past',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    // Prevent owner scheduling visit for own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot schedule a visit for your own property',
      });
    }

    // Check for existing pending/confirmed visit from same user
    const existingVisit = await Visit.findOne({
      property: propertyId,
      requester: req.user._id,
      status: { $in: ['Pending', 'Confirmed'] },
    });

    if (existingVisit) {
      return res.status(400).json({
        success: false,
        message: `You already have an active ${existingVisit.status.toLowerCase()} visit scheduled for this property on ${new Date(existingVisit.date).toLocaleDateString()}`,
      });
    }

    const visit = await Visit.create({
      property: property._id,
      requester: req.user._id,
      owner: property.owner,
      date: scheduledDate,
      time: time.trim(),
      notes: notes ? notes.trim() : undefined,
      status: 'Pending',
    });

    // Notify Owner
    await notify({
      recipient: property.owner,
      type: 'visit_scheduled',
      title: 'New Visit Request',
      message: `${req.user.name} requested a site visit on ${scheduledDate.toLocaleDateString()} at ${time.trim()} for "${property.title}"`,
      relatedId: visit._id,
      link: '/owner/visits',
    });

    const populatedVisit = await Visit.findById(visit._id)
      .populate('property', 'title location price purpose images')
      .populate('requester', 'name email phone profileImage')
      .populate('owner', 'name email phone');

    return res.status(201).json({
      success: true,
      message: 'Visit request submitted successfully to the property owner',
      data: populatedVisit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get visits for current user
 * @route   GET /api/visits
 * @access  Private
 */
const getVisits = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      query = {};
    } else if (req.user.role === 'owner') {
      query = { owner: req.user._id };
    } else {
      query = { requester: req.user._id };
    }

    const visits = await Visit.find(query)
      .populate('property', 'title location price purpose images status')
      .populate('requester', 'name email phone profileImage')
      .populate('owner', 'name email phone profileImage')
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
 * @desc    Get single visit details
 * @route   GET /api/visits/:id
 * @access  Private
 */
const getVisitById = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id)
      .populate('property', 'title location price purpose images')
      .populate('requester', 'name email phone profileImage')
      .populate('owner', 'name email phone profileImage');

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit request not found',
      });
    }

    const isRequester = visit.requester._id.toString() === req.user._id.toString();
    const isOwner = visit.owner._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRequester && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot access this visit record',
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
 * @desc    Update visit status (Owner Accept, Reject, Reschedule, Complete)
 * @route   PUT /api/visits/:id
 * @access  Private (Owner / Admin)
 */
const updateVisitStatus = async (req, res, next) => {
  try {
    const { status, date, time, notes } = req.body;
    let visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit request not found',
      });
    }

    const isOwner = visit.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the property owner or admin can update this visit',
      });
    }

    const updates = {};
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
      if (isNaN(newDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid rescheduled date format' });
      }
      updates.date = newDate;
    }

    if (time) updates.time = time.trim();
    if (notes !== undefined) updates.notes = notes.trim();

    visit = await Visit.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('property', 'title location price')
      .populate('requester', 'name email phone')
      .populate('owner', 'name email phone');

    // Notify requester
    await notify({
      recipient: visit.requester._id,
      type: 'visit_updated',
      title: `Visit Request ${visit.status}`,
      message: `Your visit for "${visit.property?.title}" is now ${visit.status} on ${new Date(visit.date).toLocaleDateString()} at ${visit.time}.`,
      relatedId: visit._id,
      link: '/tenant/visits',
    });

    return res.status(200).json({
      success: true,
      message: `Visit request updated to '${visit.status}'`,
      data: visit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel visit request by Requester
 * @route   PATCH /api/visits/:id/cancel
 * @access  Private (Requester / Admin)
 */
const cancelVisit = async (req, res, next) => {
  try {
    let visit = await Visit.findById(req.params.id);

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
        message: 'Unauthorized: You can only cancel your own visit requests',
      });
    }

    visit.status = 'Cancelled';
    await visit.save();

    // Notify Owner of cancellation
    await notify({
      recipient: visit.owner,
      type: 'visit_updated',
      title: 'Visit Cancelled',
      message: `The scheduled visit for "${visit.property?.title}" on ${new Date(visit.date).toLocaleDateString()} was cancelled.`,
      relatedId: visit._id,
      link: '/owner/visits',
    });

    return res.status(200).json({
      success: true,
      message: 'Visit request cancelled successfully',
      data: visit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete visit record
 * @route   DELETE /api/visits/:id
 * @access  Private
 */
const deleteVisit = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit record not found',
      });
    }

    const isRequester = visit.requester.toString() === req.user._id.toString();
    const isOwner = visit.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRequester && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot delete this visit record',
      });
    }

    await Visit.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Visit record deleted successfully',
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
