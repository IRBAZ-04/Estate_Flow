const Maintenance = require('../models/Maintenance');
const Property = require('../models/Property');
const notify = require('../utils/notify');

/**
 * @desc    Create a new maintenance request ticket
 * @route   POST /api/maintenance
 * @access  Private (Tenant / Admin)
 */
const createMaintenance = async (req, res, next) => {
  try {
    const { propertyId, title, description, category, priority = 'Medium', images } = req.body;

    if (!propertyId || !title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide propertyId, title, description, and category',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    let parsedImages = [];
    if (images) {
      parsedImages = Array.isArray(images)
        ? images
        : typeof images === 'string'
        ? images.split(',').map((img) => img.trim()).filter(Boolean)
        : [];
    }

    const ticket = await Maintenance.create({
      property: property._id,
      tenant: req.user._id,
      owner: property.owner,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'Pending',
      images: parsedImages,
    });

    // Notify property owner
    await notify({
      recipient: property.owner,
      type: 'maintenance_created',
      title: 'New Maintenance Request',
      message: `${req.user.name} reported a ${priority} priority ${category} issue: "${title.trim()}" on ${property.title}`,
      relatedId: ticket._id,
      link: '/owner/maintenance',
    });

    const populatedTicket = await Maintenance.findById(ticket._id)
      .populate('property', 'title location address images')
      .populate('tenant', 'name email phone profileImage')
      .populate('owner', 'name email phone');

    return res.status(201).json({
      success: true,
      message: 'Maintenance ticket created successfully and submitted to property owner',
      data: populatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get maintenance tickets for current user
 * @route   GET /api/maintenance
 * @access  Private
 */
const getMaintenance = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      query = {};
    } else if (req.user.role === 'owner') {
      query = { owner: req.user._id };
    } else {
      query = { tenant: req.user._id };
    }

    const tickets = await Maintenance.find(query)
      .populate('property', 'title location address images')
      .populate('tenant', 'name email phone profileImage')
      .populate('owner', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single maintenance ticket by ID
 * @route   GET /api/maintenance/:id
 * @access  Private
 */
const getMaintenanceById = async (req, res, next) => {
  try {
    const ticket = await Maintenance.findById(req.params.id)
      .populate('property', 'title location address images')
      .populate('tenant', 'name email phone profileImage')
      .populate('owner', 'name email phone profileImage');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance ticket not found',
      });
    }

    const isTenant = ticket.tenant._id.toString() === req.user._id.toString();
    const isOwner = ticket.owner._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isTenant && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this maintenance ticket',
      });
    }

    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update maintenance ticket status or technician notes
 * @route   PUT /api/maintenance/:id
 * @access  Private
 */
const updateMaintenance = async (req, res, next) => {
  try {
    const { status, priority, technicianNotes } = req.body;
    let ticket = await Maintenance.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance ticket not found',
      });
    }

    const isTenant = ticket.tenant.toString() === req.user._id.toString();
    const isOwner = ticket.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isTenant && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this maintenance ticket',
      });
    }

    const updates = {};

    if (isOwner || isAdmin) {
      if (status) {
        if (!['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid maintenance status: ${status}`,
          });
        }
        updates.status = status;
        if (status === 'Resolved' && !ticket.resolvedAt) {
          updates.resolvedAt = new Date();
        }
      }
      if (priority) updates.priority = priority;
      if (technicianNotes !== undefined) updates.technicianNotes = technicianNotes.trim();
    } else if (isTenant) {
      // Tenant can close a ticket
      if (status && status !== 'Closed') {
        return res.status(403).json({
          success: false,
          message: 'Tenants can only mark tickets as Closed',
        });
      }
      if (status === 'Closed') {
        updates.status = 'Closed';
      }
    }

    ticket = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('property', 'title location address')
      .populate('tenant', 'name email phone')
      .populate('owner', 'name email phone');

    // Notify tenant on status change
    if (updates.status && (isOwner || isAdmin)) {
      await notify({
        recipient: ticket.tenant._id,
        type: 'maintenance_updated',
        title: 'Maintenance Ticket Updated',
        message: `Your maintenance ticket "${ticket.title}" has been updated to "${ticket.status}".`,
        relatedId: ticket._id,
        link: '/tenant/maintenance',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Maintenance ticket updated successfully',
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMaintenance,
  getMaintenance,
  getMaintenanceById,
  updateMaintenance,
};
