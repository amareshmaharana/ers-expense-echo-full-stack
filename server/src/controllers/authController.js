const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');

const tokenForUser = (user) =>
  jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const loginRules = [
  body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const login = [
  loginRules,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, 'Validation failed', errors.array()));
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    if (!user.active) {
      return next(new ApiError(403, 'Your account is awaiting admin approval'));
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = tokenForUser(user);
    const safeUser = user.toObject();
    delete safeUser.passwordHash;

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(new ApiResponse(200, 'Login successful', { token, user: safeUser }));
  }),
];

const registerRules = [
  body('fullName').trim().isLength({ min: 2, max: 120 }).withMessage('Full name is required'),
  body('employeeId').trim().isLength({ min: 2, max: 40 }).withMessage('Employee ID is required'),
  body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['Employee', 'Manager', 'Director', 'Accountant', 'Admin']).withMessage('Role is invalid'),
];

const registrationRoleValidators = {
  Employee: (payload, validationErrors) => {
    if (!payload.dob) validationErrors.push({ msg: 'Date of birth is required', path: 'dob' });
    if (!payload.gender) validationErrors.push({ msg: 'Gender is required', path: 'gender' });
    if (!payload.contactNumber) validationErrors.push({ msg: 'Contact number is required', path: 'contactNumber' });
    if (!payload.designation) validationErrors.push({ msg: 'Designation is required', path: 'designation' });
    if (!payload.department) validationErrors.push({ msg: 'Department is required', path: 'department' });
    if (!payload.securityQuestion) validationErrors.push({ msg: 'Security question is required', path: 'securityQuestion' });
    if (!payload.securityAnswer) validationErrors.push({ msg: 'Security answer is required', path: 'securityAnswer' });
  },
  Manager: (payload, validationErrors) => {
    if (!payload.department) validationErrors.push({ msg: 'Department is required', path: 'department' });
    if (!payload.authorityLevel) validationErrors.push({ msg: 'Level of authority is required', path: 'authorityLevel' });
    if (!payload.designation) validationErrors.push({ msg: 'Designation is required', path: 'designation' });
  },
  Director: (payload, validationErrors) => {
    if (!payload.department) validationErrors.push({ msg: 'Department is required', path: 'department' });
    if (!payload.authorityLevel) validationErrors.push({ msg: 'Level of authority is required', path: 'authorityLevel' });
    if (!payload.designation) validationErrors.push({ msg: 'Designation is required', path: 'designation' });
  },
  Accountant: (payload, validationErrors) => {
    if (payload.accessKey && payload.accessKey.length > 120) {
      validationErrors.push({ msg: 'Access key is too long', path: 'accessKey' });
    }
  },
  Admin: (payload, validationErrors) => {
    if (payload.accessKey && payload.accessKey.length > 120) {
      validationErrors.push({ msg: 'Access key is too long', path: 'accessKey' });
    }
  },
};

const register = [
  registerRules,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, 'Validation failed', errors.array()));
    }

    const requestedRole = req.body.role;
    const roleValidationErrors = [];
    registrationRoleValidators[requestedRole]?.(req.body, roleValidationErrors);
    if (roleValidationErrors.length) {
      return next(new ApiError(400, 'Validation failed', roleValidationErrors));
    }

    const existing = await User.findOne({
      $or: [{ email: req.body.email.toLowerCase() }, { employeeId: req.body.employeeId.toUpperCase() }],
    });

    if (existing) {
      return next(new ApiError(409, 'User already exists'));
    }

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const securityAnswerHash = req.body.securityAnswer ? await bcrypt.hash(req.body.securityAnswer, 12) : null;
    const configuredAccessKey = process.env.ERS_ACCESS_KEY || '';

    if (
      ['Admin', 'Accountant'].includes(requestedRole) &&
      configuredAccessKey &&
      req.body.accessKey !== configuredAccessKey
    ) {
      return next(new ApiError(403, 'Invalid access key'));
    }

    const created = await User.create({
      fullName: req.body.fullName,
      employeeId: req.body.employeeId.toUpperCase(),
      empTypeId: req.body.empTypeId || req.body.designation || requestedRole,
      email: req.body.email.toLowerCase(),
      passwordHash,
      role: requestedRole,
      department: req.body.department || undefined,
      dob: req.body.dob ? new Date(req.body.dob) : null,
      gender: req.body.gender || null,
      contactNumber: req.body.contactNumber || null,
      designation: req.body.designation || null,
      authorityLevel: req.body.authorityLevel || null,
      securityQuestion: req.body.securityQuestion || null,
      securityQuestionId: req.body.securityQuestionId || null,
      securityAnswerHash,
      manager: null,
      active: true,
    });

    const token = tokenForUser(created);
    const safeUser = created.toObject();
    delete safeUser.passwordHash;
    delete safeUser.securityAnswerHash;

    res
      .status(201)
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(new ApiResponse(201, 'Registration successful', { token, user: safeUser }));
  }),
];

const me = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, 'Authenticated user', { user: req.user }));
});

const createUserRules = [
  body('fullName').trim().isLength({ min: 2, max: 120 }).withMessage('Full name is required'),
  body('employeeId').trim().isLength({ min: 2, max: 40 }).withMessage('Employee ID is required'),
  body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['Admin', 'Employee', 'Manager', 'Director', 'Accountant']).withMessage('Role is invalid'),
  body('department').trim().isLength({ min: 2, max: 80 }).withMessage('Department is required'),
];

const createUser = [
  createUserRules,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, 'Validation failed', errors.array()));
    }

    const existing = await User.findOne({
      $or: [{ email: req.body.email.toLowerCase() }, { employeeId: req.body.employeeId.toUpperCase() }],
    });

    if (existing) {
      return next(new ApiError(409, 'User already exists'));
    }

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const created = await User.create({
      fullName: req.body.fullName,
      employeeId: req.body.employeeId.toUpperCase(),
      empTypeId: req.body.empTypeId || req.body.designation || req.body.role,
      email: req.body.email.toLowerCase(),
      passwordHash,
      role: req.body.role,
      department: req.body.department,
      securityQuestionId: req.body.securityQuestionId || null,
      manager: req.body.manager || null,
      active: req.body.active ?? true,
    });

    const safeUser = created.toObject();
    delete safeUser.passwordHash;
    delete safeUser.securityAnswerHash;

    res.status(201).json(new ApiResponse(201, 'User created', { user: safeUser }));
  }),
];

module.exports = { login, register, me, createUser, tokenForUser };
