const mongoose = require('mongoose');

const approvalEntrySchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['Employee', 'Admin', 'Manager', 'Director', 'Accountant'],
      required: true,
    },
    action: {
      type: String,
      enum: ['Submitted', 'Approved', 'Rejected', 'Paid'],
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment must be at most 500 characters'],
      default: '',
    },
    actedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const reimbursementSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    employeeSnapshot: {
      fullName: { type: String, required: true },
      employeeId: { type: String, required: true },
      department: { type: String, required: true },
      role: { type: String, required: true },
      email: { type: String, required: true },
    },
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
      minlength: [3, 'Expense title must be at least 3 characters'],
      maxlength: [140, 'Expense title must be at most 140 characters'],
    },
    category: {
      type: String,
      enum: ['Travel', 'Meals', 'Supplies', 'Technology', 'Training', 'Mileage', 'Other'],
      required: true,
    },
    expTypeId: {
      type: String,
      trim: true,
      maxlength: [80, 'Expense type ID must be at most 80 characters'],
      default: null,
      alias: 'Exp_typeID',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
      max: [100000, 'Amount exceeds system limit'],
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'AED', 'INR'],
      default: 'USD',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1200, 'Description must be at most 1200 characters'],
    },
    receipt: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      fileName: { type: String, required: true },
      mimeType: { type: String, required: true },
    },
    docPath: {
      type: String,
      trim: true,
      default: '',
      alias: 'Doc_path',
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'ManagerApproved', 'DirectorApproved', 'FinanceQueued', 'Paid', 'Rejected'],
      default: 'Submitted',
      index: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
      alias: 'Applied_date',
    },
    approvedByManagerAt: { type: Date, default: null },
    approvedByDirectorAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },
    paymentReference: { type: String, trim: true, default: '' },
    reviewNotes: { type: String, trim: true, maxlength: [1000, 'Review notes must be at most 1000 characters'], default: '' },
    approvalTrail: [approvalEntrySchema],
  },
  { timestamps: true, strict: true }
);

reimbursementSchema.index({ status: 1, submittedAt: -1 });
reimbursementSchema.index({ employee: 1, submittedAt: -1 });

module.exports = mongoose.model('Reimbursement', reimbursementSchema);
