require('dotenv').config();
const createApp = require('./app');
const connectDB = require('./config/db');
const seedDemoData = require('./utils/seedDemoData');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  const seedResult = await seedDemoData();
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`ERS API listening on port ${PORT}`);
    if (seedResult?.seeded) {
      console.log('Seeded demo users with password Password123!');
    }
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
