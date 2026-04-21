const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [120, 'Full name must be at most 120 characters'],
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      trim: true,
      uppercase: true,
      unique: true,
      index: true,
    },
    empTypeId: {
      type: String,
      trim: true,
      maxlength: [60, 'Employee type ID must be at most 60 characters'],
      default: null,
      alias: 'Emp_TypeID',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'Employee', 'Manager', 'Director', 'Accountant'],
      required: true,
      default: 'Employee',
    },
    department: {
      type: String,
      required: function requiredDepartment() {
        return ['Employee', 'Manager', 'Director'].includes(this.role);
      },
      trim: true,
      maxlength: [80, 'Department must be at most 80 characters'],
    },
    dob: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-Binary', 'Prefer not to say'],
      default: null,
    },
    contactNumber: {
      type: String,
      trim: true,
      maxlength: [30, 'Contact number must be at most 30 characters'],
      default: null,
    },
    designation: {
      type: String,
      trim: true,
      maxlength: [120, 'Designation must be at most 120 characters'],
      default: null,
    },
    authorityLevel: {
      type: String,
      trim: true,
      maxlength: [80, 'Authority level must be at most 80 characters'],
      default: null,
    },
    securityQuestion: {
      type: String,
      trim: true,
      maxlength: [200, 'Security question must be at most 200 characters'],
      default: null,
    },
    securityQuestionId: {
      type: String,
      trim: true,
      maxlength: [60, 'Security question ID must be at most 60 characters'],
      default: null,
      alias: 'Sec_queID',
    },
    securityAnswerHash: {
      type: String,
      select: false,
      default: null,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model('User', userSchema);
