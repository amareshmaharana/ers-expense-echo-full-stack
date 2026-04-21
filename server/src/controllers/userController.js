const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');
const Reimbursement = require('../models/Reimbursement');

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json(new ApiResponse(200, 'Users fetched', { users }));
});

const getUsersByRole = asyncHandler(async (req, res, next) => {
  const { role } = req.params;
  const allowedRoles = ['Admin', 'Employee', 'Manager', 'Director', 'Accountant'];

  if (!allowedRoles.includes(role)) {
    return next(new ApiError(400, 'Role is invalid'));
  }

  const users = await User.find({ role }).select('-passwordHash').sort({ fullName: 1 });
  res.json(new ApiResponse(200, 'Users fetched', { users }));
});

const updateUserStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { active } = req.body;

  if (typeof active !== 'boolean') {
    return next(new ApiError(400, 'Active status must be true or false'));
  }

  const user = await User.findById(id).select('-passwordHash');
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  user.active = active;
  await user.save();

  res.json(new ApiResponse(200, `User ${active ? 'approved' : 'rejected'}`, { user }));
});

const getSystemActivity = asyncHandler(async (req, res) => {
  const maxLimit = 100;
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), maxLimit)
    : maxLimit;

  const cutoffDate = new Date(Date.now() - 7 * DAY_IN_MS);

  const [users, reimbursements] = await Promise.all([
    User.find({ updatedAt: { $gte: cutoffDate } })
      .select('fullName role lastLoginAt createdAt updatedAt')
      .sort({ updatedAt: -1 }),
    Reimbursement.find({ updatedAt: { $gte: cutoffDate } })
      .select('title status currency amount employeeSnapshot.fullName employee createdAt updatedAt')
      .populate('employee', 'fullName')
      .sort({ updatedAt: -1 }),
  ]);

  const userEvents = users.map((item) => ({
    id: `user-${item._id}`,
    label: `${item.fullName} (${item.role})`,
    meta: item.lastLoginAt
      ? `Last login ${new Date(item.lastLoginAt).toLocaleString()}`
      : 'No login activity yet',
    date: item.updatedAt || item.createdAt,
    type: 'user',
  }));

  const reimbursementEvents = reimbursements.map((item) => ({
    id: `claim-${item._id}`,
    label: `${item.title} moved to ${item.status}`,
    meta: `${item.employee?.fullName || item.employeeSnapshot?.fullName || 'Unknown'} • ${item.currency} ${item.amount}`,
    date: item.updatedAt || item.createdAt,
    type: 'claim',
  }));

  const events = [...userEvents, ...reimbursementEvents]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);

  res.json(
    new ApiResponse(200, 'System activity fetched', {
      events,
      retentionDays: 7,
    })
  );
});

module.exports = { listUsers, getUsersByRole, updateUserStatus, getSystemActivity };
