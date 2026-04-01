
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');


router.get('/overview', protect, adminOnly, async (req, res) => {
  try {
    
    const totalUsers = await User.countDocuments();

    
    const activeUsers = await User.countDocuments({ isActive: true });

    
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newSignups = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    return res.json({
      totalUsers,
      activeUsers,
      totalAdmins,
      newSignups,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/signups', protect, adminOnly, async (req, res) => {
  try {
    const labels = [];   
    const counts = [];  

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const count = await User.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

      labels.push(startOfDay.toLocaleDateString('en-US', { weekday: 'short' }));
      counts.push(count);
    }

    return res.json({ labels, counts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.get('/roles', protect, adminOnly, async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });

    return res.json({
      labels: ['Admins', 'Users'],
      counts: [adminCount, userCount],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;