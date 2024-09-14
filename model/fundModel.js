const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  totalFunds: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalExpenses: {
    type: Number,
    default: 0
  }
  // You can add more fields as needed
});

const Fund = mongoose.model('Fund', fundSchema);

module.exports = Fund;