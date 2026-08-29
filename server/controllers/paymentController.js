const Payment = require('../models/Payment');
const Agreement = require('../models/Agreement');
const notify = require('../utils/notify');

/**
 * @desc    Record a new payment transaction
 * @route   POST /api/payments
 * @access  Private
 */
const createPayment = async (req, res, next) => {
  try {
    const {
      agreementId,
      amount,
      paymentType = 'Rent',
      month,
      paymentMethod = 'Simulated Digital Payment',
      status = 'Paid',
      transactionReference,
      notes,
    } = req.body;

    if (!agreementId || !amount || !month) {
      return res.status(400).json({
        success: false,
        message: 'Please provide agreementId, amount, and billing month/period',
      });
    }

    const agreement = await Agreement.findById(agreementId).populate('property');
    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Rental agreement not found',
      });
    }

    const isTenant = agreement.tenant.toString() === req.user._id.toString();
    const isOwner = agreement.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isTenant && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to record payments for this agreement',
      });
    }

    // Generate unique reference if not provided
    const txnRef =
      transactionReference && transactionReference.trim() !== ''
        ? transactionReference.trim()
        : `TXN-EST-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;

    const payment = await Payment.create({
      agreement: agreement._id,
      property: agreement.property,
      tenant: agreement.tenant,
      owner: agreement.owner,
      amount: Number(amount),
      paymentType,
      month: month.trim(),
      paymentDate: new Date(),
      paymentMethod,
      status,
      transactionReference: txnRef,
      notes: notes ? notes.trim() : undefined,
    });

    // Notify Owner if Tenant recorded payment
    if (isTenant) {
      await notify({
        recipient: agreement.owner,
        type: 'payment_recorded',
        title: 'Payment Received',
        message: `${req.user.name} recorded a ${paymentType} payment of ₹ ${amount} for ${month} (${txnRef}).`,
        relatedId: payment._id,
        link: '/payments',
      });
    }

    const populatedPayment = await Payment.findById(payment._id)
      .populate('property', 'title location price purpose')
      .populate('tenant', 'name email phone')
      .populate('owner', 'name email phone')
      .populate('agreement', 'monthlyRent securityDeposit startDate endDate');

    return res.status(201).json({
      success: true,
      message: 'Payment record created successfully',
      data: populatedPayment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get payment transaction records for current user
 * @route   GET /api/payments
 * @access  Private
 */
const getPayments = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      query = {};
    } else if (req.user.role === 'owner') {
      query = { owner: req.user._id };
    } else {
      query = { tenant: req.user._id };
    }

    const payments = await Payment.find(query)
      .populate('property', 'title location price purpose images')
      .populate('tenant', 'name email phone')
      .populate('owner', 'name email phone')
      .populate('agreement', 'monthlyRent securityDeposit')
      .sort({ paymentDate: -1, createdAt: -1 });

    // Compute financial overview metrics
    const totalPaid = payments
      .filter((p) => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
      .filter((p) => p.status === 'Pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const rentPaid = payments
      .filter((p) => p.status === 'Paid' && p.paymentType === 'Rent')
      .reduce((sum, p) => sum + p.amount, 0);

    const depositPaid = payments
      .filter((p) => p.status === 'Paid' && p.paymentType === 'Security Deposit')
      .reduce((sum, p) => sum + p.amount, 0);

    return res.status(200).json({
      success: true,
      count: payments.length,
      financials: {
        totalPaid,
        totalPending,
        rentPaid,
        depositPaid,
      },
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single payment record by ID
 * @route   GET /api/payments/:id
 * @access  Private
 */
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('property', 'title location address price purpose images')
      .populate('tenant', 'name email phone')
      .populate('owner', 'name email phone')
      .populate('agreement', 'monthlyRent securityDeposit startDate endDate terms status');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found',
      });
    }

    const isTenant = payment.tenant._id.toString() === req.user._id.toString();
    const isOwner = payment.owner._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isTenant && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot access this payment record',
      });
    }

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update payment status (Owner/Admin confirmation)
 * @route   PUT /api/payments/:id
 * @access  Private (Owner / Admin)
 */
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    let payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found',
      });
    }

    const isOwner = payment.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the property owner or admin can update payment status',
      });
    }

    const updates = {};
    if (status) {
      if (!['Pending', 'Paid', 'Failed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment status: ${status}`,
        });
      }
      updates.status = status;
    }

    if (notes !== undefined) updates.notes = notes.trim();

    payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('property', 'title location price')
      .populate('tenant', 'name email phone')
      .populate('owner', 'name email phone');

    // Notify Tenant
    await notify({
      recipient: payment.tenant._id,
      type: 'payment_updated',
      title: `Payment Status: ${payment.status}`,
      message: `Your payment record (${payment.transactionReference}) status has been updated to "${payment.status}".`,
      relatedId: payment._id,
      link: '/payments',
    });

    return res.status(200).json({
      success: true,
      message: `Payment status updated to '${payment.status}'`,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
};
