const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Reimbursement = require('../models/Reimbursement');

const getOverview = asyncHandler(async (req, res) => {
  const visibilityMatch = req.user.role === 'Employee' ? { employee: req.user._id } : {};

  const [summary, recent] = await Promise.all([
    Reimbursement.aggregate([
      { $match: visibilityMatch },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]),
    Reimbursement.find(visibilityMatch).sort({ submittedAt: -1 }).limit(8).populate('employee', 'fullName employeeId role department'),
  ]);

  res.json(new ApiResponse(200, 'Overview loaded', { summary, recent }));
});

module.exports = { getOverview };
