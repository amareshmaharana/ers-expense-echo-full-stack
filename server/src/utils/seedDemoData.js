const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Reimbursement = require('../models/Reimbursement');
const ApprovalHistory = require('../models/ApprovalHistory');

const demoPassword = 'Password123!';

const seedDemoData = async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    return { seeded: false };
  }

  const passwordHash = await bcrypt.hash(demoPassword, 12);

  const [admin, employee, manager, director, accountant] = await User.insertMany([
    {
      fullName: 'Avery Brooks',
      employeeId: 'ADM-1001',
      email: 'admin@ers.local',
      passwordHash,
      role: 'Admin',
      department: 'Operations',
    },
    {
      fullName: 'Jordan Ellis',
      employeeId: 'EMP-2001',
      email: 'employee@ers.local',
      passwordHash,
      role: 'Employee',
      department: 'Product',
    },
    {
      fullName: 'Morgan Reed',
      employeeId: 'MGR-3001',
      email: 'manager@ers.local',
      passwordHash,
      role: 'Manager',
      department: 'Product',
    },
    {
      fullName: 'Sofia Lane',
      employeeId: 'DIR-4001',
      email: 'director@ers.local',
      passwordHash,
      role: 'Director',
      department: 'Finance',
    },
    {
      fullName: 'Theo Grant',
      employeeId: 'ACC-5001',
      email: 'accountant@ers.local',
      passwordHash,
      role: 'Accountant',
      department: 'Finance',
    },
  ]);

  employee.manager = manager._id;
  await employee.save();

  const reimbursement = await Reimbursement.create({
    employee: employee._id,
    employeeSnapshot: {
      fullName: employee.fullName,
      employeeId: employee.employeeId,
      department: employee.department,
      role: employee.role,
      email: employee.email,
    },
    title: 'Executive client dinner',
    category: 'Meals',
    amount: 245.5,
    currency: 'USD',
    description: 'Dinner with stakeholders during the quarterly product launch planning session.',
    receipt: {
      url: 'https://placehold.co/1200x1600?text=Receipt+Demo',
      publicId: 'demo-receipt-1',
      fileName: 'demo-receipt.png',
      mimeType: 'image/png',
    },
    status: 'Submitted',
    approvalTrail: [{ role: 'Employee', action: 'Submitted', actor: employee._id, comment: 'Demo seed data' }],
  });

  await ApprovalHistory.create({
    reimbursement: reimbursement._id,
    actor: employee._id,
    actorRole: 'Employee',
    action: 'Submitted',
    note: 'Demo seed data',
  });

  return {
    seeded: true,
    credentials: {
      admin: admin.email,
      employee: employee.email,
      manager: manager.email,
      director: director.email,
      accountant: accountant.email,
      password: demoPassword,
    },
  };
};

module.exports = seedDemoData;
