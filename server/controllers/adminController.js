const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Visit = require('../models/Visit');
const Agreement = require('../models/Agreement');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');
const notify = require('../utils/notify');

/**
 * @desc    Get comprehensive platform analytics & statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalOwners,
      totalTenants,
      totalAdmins,
      blockedUsers,
      totalProperties,
      pendingProperties,
      approvedProperties,
      availableProperties,
      rentedProperties,
      soldProperties,
      rejectedProperties,
      totalInquiries,
      totalVisits,
      totalAgreements,
      activeAgreements,
      totalMaintenance,
      pendingMaintenance,
      resolvedMaintenance,
      payments,
      propertiesByTypeAgg,
      propertiesByPurposeAgg,
      usersByRoleAgg,
      propertiesByStatusAgg,
      maintenanceByCategoryAgg,
      maintenanceByStatusAgg,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'owner' }),
      User.countDocuments({ role: 'tenant' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ status: { $in: ['blocked', 'Blocked'] } }),
      Property.countDocuments(),
      Property.countDocuments({ status: 'Pending' }),
      Property.countDocuments({ status: 'Approved' }),
      Property.countDocuments({ status: 'Available' }),
      Property.countDocuments({ status: 'Rented' }),
      Property.countDocuments({ status: 'Sold' }),
      Property.countDocuments({ status: 'Rejected' }),
      Inquiry.countDocuments(),
      Visit.countDocuments(),
      Agreement.countDocuments(),
      Agreement.countDocuments({ status: 'Active' }),
      Maintenance.countDocuments(),
      Maintenance.countDocuments({ status: 'Pending' }),
      Maintenance.countDocuments({ status: { $in: ['Resolved', 'Closed'] } }),
      Payment.find(),
      Property.aggregate([
        { $group: { _id: '$propertyType', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
      Property.aggregate([
        { $group: { _id: '$purpose', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
      ]),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
      ]),
      Property.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
      ]),
      Maintenance.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
      Maintenance.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
      ]),
    ]);

    // Financial totals
    const totalRevenueCollected = payments
      .filter((p) => p.status === 'Paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalPendingRevenue = payments
      .filter((p) => p.status === 'Pending')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalDepositsHeld = payments
      .filter((p) => p.status === 'Paid' && p.paymentType === 'Security Deposit')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          users: {
            total: totalUsers,
            owners: totalOwners,
            tenants: totalTenants,
            admins: totalAdmins,
            blocked: blockedUsers,
          },
          properties: {
            total: totalProperties,
            pending: pendingProperties,
            approved: approvedProperties + availableProperties,
            rented: rentedProperties,
            sold: soldProperties,
            rejected: rejectedProperties,
          },
          operations: {
            inquiries: totalInquiries,
            visits: totalVisits,
            totalAgreements,
            activeAgreements,
            totalMaintenance,
            pendingMaintenance,
            resolvedMaintenance,
          },
          financials: {
            totalRevenueCollected,
            totalPendingRevenue,
            totalDepositsHeld,
            transactionCount: payments.length,
          },
        },
        charts: {
          propertiesByType: propertiesByTypeAgg,
          propertiesByPurpose: propertiesByPurposeAgg,
          usersByRole: usersByRoleAgg.map((u) => ({
            name: u.name ? u.name.charAt(0).toUpperCase() + u.name.slice(1) : 'Unknown',
            count: u.count,
          })),
          propertiesByStatus: propertiesByStatusAgg,
          maintenanceByCategory: maintenanceByCategoryAgg,
          maintenanceByStatus: maintenanceByStatusAgg,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users with search and filter
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getAdminUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'All') {
      query.role = role.toLowerCase();
    }

    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    if (search && search.trim() !== '') {
      const cleanSearch = search.trim();
      query.$or = [
        { name: { $regex: cleanSearch, $options: 'i' } },
        { email: { $regex: cleanSearch, $options: 'i' } },
        { phone: { $regex: cleanSearch, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * pageSize;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // Normalize status output for clean UI display
    const formattedUsers = users.map((u) => ({
      ...u.toObject(),
      status: u.status === 'blocked' ? 'Blocked' : 'Active',
    }));

    return res.status(200).json({
      success: true,
      count: formattedUsers.length,
      total,
      totalPages: Math.ceil(total / pageSize) || 1,
      currentPage: pageNum,
      data: formattedUsers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user status (Block / Unblock) with safeguard
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin only)
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const normalizedStatus = status ? status.toLowerCase() : '';

    if (!['active', 'blocked'].includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Status must be "Active" or "Blocked"',
      });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    // Safeguard: Prevent admin from blocking themselves
    if (targetUser._id.toString() === req.user._id.toString() && normalizedStatus === 'blocked') {
      return res.status(400).json({
        success: false,
        message: 'Security Restriction: You cannot block your own administrative account',
      });
    }

    // Safeguard: Ensure at least one active Admin exists
    if (targetUser.role === 'admin' && normalizedStatus === 'blocked') {
      const activeAdminsCount = await User.countDocuments({
        role: 'admin',
        status: { $in: ['active', 'Active'] },
      });
      if (activeAdminsCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Security Restriction: Cannot block the only active administrator on the platform',
        });
      }
    }

    targetUser.status = normalizedStatus;
    await targetUser.save();

    const displayStatus = normalizedStatus === 'blocked' ? 'Blocked' : 'Active';

    return res.status(200).json({
      success: true,
      message: `User status changed to "${displayStatus}" successfully`,
      data: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        status: displayStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get pending property listings awaiting admin approval
 * @route   GET /api/admin/properties/pending
 * @access  Private (Admin only)
 */
const getPendingProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: 'Pending' })
      .populate('owner', 'name email phone profileImage role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve or Reject a property listing with optional feedback
 * @route   PUT /api/admin/properties/:id/approval
 * @access  Private (Admin only)
 */
const updatePropertyApproval = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "Approved" or "Rejected"',
      });
    }

    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone'
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    property.status = status;
    await property.save();

    // Send notification to the owner
    const reasonText = rejectionReason ? ` Reason: ${rejectionReason.trim()}` : '';
    await notify({
      recipient: property.owner._id,
      type: 'property_approval',
      title: `Listing ${status}: "${property.title}"`,
      message: `Your property listing has been ${status.toLowerCase()} by the platform administrator.${reasonText}`,
      relatedId: property._id,
      link: `/properties/${property._id}`,
    });

    return res.status(200).json({
      success: true,
      message: `Property listing successfully ${status.toLowerCase()}`,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get centralized platform operations overview
 * @route   GET /api/admin/operations
 * @access  Private (Admin only)
 */
const getPlatformOperations = async (req, res, next) => {
  try {
    const [recentInquiries, recentVisits, recentAgreements, recentPayments, recentTickets] =
      await Promise.all([
        Inquiry.find()
          .populate('property', 'title location price')
          .populate('user', 'name email')
          .populate('owner', 'name email')
          .sort({ createdAt: -1 })
          .limit(10),
        Visit.find()
          .populate('property', 'title location price')
          .populate('requester', 'name email')
          .populate('owner', 'name email')
          .sort({ createdAt: -1 })
          .limit(10),
        Agreement.find()
          .populate('property', 'title location')
          .populate('owner', 'name email')
          .populate('tenant', 'name email')
          .sort({ createdAt: -1 })
          .limit(10),
        Payment.find()
          .populate('property', 'title location')
          .populate('owner', 'name email')
          .populate('tenant', 'name email')
          .sort({ paymentDate: -1, createdAt: -1 })
          .limit(10),
        Maintenance.find()
          .populate('property', 'title location')
          .populate('tenant', 'name email')
          .populate('owner', 'name email')
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        inquiries: recentInquiries,
        visits: recentVisits,
        agreements: recentAgreements,
        payments: recentPayments,
        maintenance: recentTickets,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  getPendingProperties,
  updatePropertyApproval,
  getPlatformOperations,
};
