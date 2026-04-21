const mongoose = require('mongoose');

const approvalHistorySchema = new mongoose.Schema(
  {
    reimbursement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reimbursement',
      required: true,
      index: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actorRole: {
      type: String,
      enum: ['Employee', 'Admin', 'Manager', 'Director', 'Accountant'],
      required: true,
    },
    action: {
      type: String,
      enum: ['Created', 'Submitted', 'Approved', 'Rejected', 'Paid'],
      required: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note must be at most 500 characters'],
      default: '',
    },
    occurredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, strict: true }
);

approvalHistorySchema.index({ reimbursement: 1, occurredAt: -1 });

module.exports = mongoose.model('ApprovalHistory', approvalHistorySchema);
