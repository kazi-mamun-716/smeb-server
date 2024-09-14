// controllers/cronController.js
const cron = require('node-cron');
const User = require('../model/userModel');

cron.schedule('0 0 * * *', async () => {
  // Run every day at midnight

  const currentDate = new Date();
  const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);

  try {
    const member = User.find({membership: "member"});
    const inactiveUsers = await User.updateMany({
      lastPaymentDate: { $lt: threeMonthsAgo },
      status: 'active',
      membership: { $ne: 'life time member' } ,
    }, { $set: { status: 'finance secretary' } });
    console.log(`Updated ${inactiveUsers.nModified} user(s) to inactive status.`);
  } catch (error) {
    console.error('Error updating user statuses:', error);
  }
});
