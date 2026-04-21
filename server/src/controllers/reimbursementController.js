const { body, param, validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Reimbursement = require('../models/Reimbursement');
const User = require('../models/User');
const ApprovalHistory = require('../models/ApprovalHistory');
const { uploadReceipt } = require('../services/cloudinary');
const { sendNotification } = require('../services/mailer');

const submissionRules = [
  body('title').trim().isLength({ min: 3, max: 140 }).withMessage('Expense title is required'),
  body('category').isIn(['Travel', 'Meals', 'Supplies', 'Technology', 'Training', 'Mileage', 'Other']).withMessage('Category is invalid'),
  body('amount').isFloat({ min: 0.01, max: 100000 }).withMessage('Amount must be greater than zero'),
  body('currency').isIn(['USD', 'EUR', 'GBP', 'AED', 'INR']).withMessage('Currency is invalid'),
  body('description').trim().isLength({ min: 10, max: 1200 }).withMessage('Description is required'),
];

const ensureReceipt = (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(400, 'Receipt file is required'));
  }
  next();
};

const getNotificationHtml = (reimbursement, statusText) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
    <h2>Reimbursement ${statusText}</h2>
    <p>${reimbursement.employeeSnapshot.fullName}'s expense <strong>${reimbursement.title}</strong> is now ${statusText.toLowerCase()}.</p>
    <ul>
      <li>Category: ${reimbursement.category}</li>
      <li>Amount: ${reimbursement.currency} ${reimbursement.amount.toFixed(2)}</li>
      <li>Status: ${reimbursement.status}</li>
    </ul>
  </div>
`;

const saveApprovalLog = async ({ reimbursement, actor, actorRole, action, note }) => {
  await ApprovalHistory.create({
    reimbursement: reimbursement._id,
    actor,
    actorRole,
    action,
    note,
  });
};

const notifyStakeholders = async ({ reimbursement, subject, statusText }) => {
  const employeeEmail = reimbursement.employeeSnapshot.email;
  const html = getNotificationHtml(reimbursement, statusText);
  await sendNotification({ to: employeeEmail, subject, html });

  const extraRecipients = [process.env.MANAGER_NOTIFY_EMAIL, process.env.DIRECTOR_NOTIFY_EMAIL, process.env.ACCOUNTANT_NOTIFY_EMAIL].filter(Boolean);
  await Promise.all(
    extraRecipients.map((recipient) =>
      sendNotification({
        to: recipient,
        subject,
        html,
      })
    )
  );
};

const createReimbursement = [
  submissionRules,
  ensureReceipt,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, 'Validation failed', errors.array()));
    }

    const receipt = await uploadReceipt(req.file);
    const employee = await User.findById(req.user._id);

    if (!employee) {
      return next(new ApiError(404, 'Employee account not found'));
    }

    const reimbursement = await Reimbursement.create({
      employee: employee._id,
      employeeSnapshot: {
        fullName: employee.fullName,
        employeeId: employee.employeeId,
        department: employee.department,
        role: employee.role,
        email: employee.email,
      },
      title: req.body.title,
      category: req.body.category,
      expTypeId: req.body.expTypeId || req.body.category,
      amount: Number(req.body.amount),
      currency: req.body.currency,
      description: req.body.description,
      receipt,
      docPath: receipt.url,
      appliedDate: new Date(),
      status: 'Submitted',
      approvalTrail: [{ role: 'Employee', action: 'Submitted', actor: employee._id, comment: 'Self-submitted by employee' }],
    });

    await saveApprovalLog({
      reimbursement,
      actor: employee._id,
      actorRole: employee.role,
      action: 'Submitted',
      note: 'Expense submitted',
    });

    await notifyStakeholders({
      reimbursement,
      subject: `ERS submission received: ${reimbursement.title}`,
      statusText: 'Submitted',
    });

    res.status(201).json(new ApiResponse(201, 'Reimbursement submitted', { reimbursement }));
  }),
];

const listReimbursements = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};

  if (req.user.role === 'Employee') {
    query.employee = req.user._id;
  }

  if (req.user.role === 'Manager') {
    query.status = { $in: ['Submitted', 'ManagerApproved', 'Rejected'] };
  }

  if (req.user.role === 'Director') {
    query.status = { $in: ['ManagerApproved', 'DirectorApproved', 'Rejected'] };
  }

  if (req.user.role === 'Accountant') {
    query.status = { $in: ['DirectorApproved', 'FinanceQueued', 'Paid'] };
  }

  if (status) {
    query.status = status;
  }

  const reimbursements = await Reimbursement.find(query)
    .populate('employee', 'fullName employeeId department role email')
    .sort({ submittedAt: -1 });

  res.json(new ApiResponse(200, 'Reimbursements fetched', { reimbursements }));
});

const getReimbursement = asyncHandler(async (req, res, next) => {
  const reimbursement = await Reimbursement.findById(req.params.id)
    .populate('employee', 'fullName employeeId department role email');

  if (!reimbursement) {
    return next(new ApiError(404, 'Reimbursement not found'));
  }

  const isOwner = reimbursement.employee._id.toString() === req.user._id.toString();
  const privilegedRoles = ['Admin', 'Manager', 'Director', 'Accountant'];

  if (!isOwner && !privilegedRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'Access denied'));
  }

  res.json(new ApiResponse(200, 'Reimbursement fetched', { reimbursement }));
});

const reviewRules = [
  param('id').isMongoId().withMessage('Valid reimbursement id is required'),
  body('action').isIn(['Approved', 'Rejected', 'Paid']).withMessage('Action is invalid'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment is too long'),
  body('paymentReference').optional().isLength({ max: 120 }).withMessage('Payment reference is too long'),
];

const reviewReimbursement = [
  reviewRules,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, 'Validation failed', errors.array()));
    }

    const reimbursement = await Reimbursement.findById(req.params.id).populate('employee', 'fullName email');
    if (!reimbursement) {
      return next(new ApiError(404, 'Reimbursement not found'));
    }

    const { action, comment = '', paymentReference = '' } = req.body;
    const role = req.user.role;

    if (role === 'Manager' && reimbursement.status !== 'Submitted') {
      return next(new ApiError(400, 'Manager can only review submitted requests'));
    }

    if (role === 'Director' && reimbursement.status !== 'ManagerApproved') {
      return next(new ApiError(400, 'Director can only review manager-approved requests'));
    }

    if (role === 'Accountant' && reimbursement.status !== 'DirectorApproved') {
      return next(new ApiError(400, 'Accountant can only process director-approved requests'));
    }

    if (role === 'Manager' && action === 'Approved') {
      reimbursement.status = 'ManagerApproved';
      reimbursement.approvedByManagerAt = new Date();
    } else if (role === 'Director' && action === 'Approved') {
      reimbursement.status = 'DirectorApproved';
      reimbursement.approvedByDirectorAt = new Date();
    } else if (role === 'Accountant' && action === 'Paid') {
      reimbursement.status = 'Paid';
      reimbursement.paidAt = new Date();
      reimbursement.paymentReference = paymentReference;
    } else if (action === 'Rejected') {
      reimbursement.status = 'Rejected';
    } else {
      return next(new ApiError(400, 'Invalid action for your role'));
    }

    reimbursement.reviewNotes = comment;
    reimbursement.approvalTrail.push({
      role,
      action,
      actor: req.user._id,
      comment,
    });

    await reimbursement.save();

    await saveApprovalLog({
      reimbursement,
      actor: req.user._id,
      actorRole: role,
      action,
      note: comment,
    });

    const statusText = reimbursement.status;
    await sendNotification({
      to: reimbursement.employee.email,
      subject: `ERS update: ${reimbursement.title}`,
      html: getNotificationHtml(reimbursement, statusText),
    });

    res.json(new ApiResponse(200, 'Reimbursement updated', { reimbursement }));
  }),
];

const dashboardSummary = asyncHandler(async (req, res) => {
  const baseMatch = {};
  if (req.user.role === 'Employee') {
    baseMatch.employee = req.user._id;
  }

  const [totals, byStatus, latest] = await Promise.all([
    Reimbursement.aggregate([{ $match: baseMatch }, { $group: { _id: null, totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    Reimbursement.aggregate([{ $match: baseMatch }, { $group: { _id: '$status', count: { $sum: 1 }, amount: { $sum: '$amount' } } }]),
    Reimbursement.find(baseMatch).sort({ submittedAt: -1 }).limit(6).populate('employee', 'fullName employeeId role'),
  ]);

  res.json(
    new ApiResponse(200, 'Dashboard summary', {
      totals: totals[0] || { totalAmount: 0, count: 0 },
      byStatus,
      latest,
    })
  );
});

module.exports = {
  createReimbursement,
  listReimbursements,
  getReimbursement,
  reviewReimbursement,
  dashboardSummary,
};
