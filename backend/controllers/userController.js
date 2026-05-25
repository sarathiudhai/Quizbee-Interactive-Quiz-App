const User = require('../models/User');
const Result = require('../models/Result');

// @desc    Get all users (paginated)
// @route   GET /api/users
// @access  Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's quiz history
    const results = await Result.find({ user: req.params.id })
      .populate('quiz', 'title category')
      .sort({ completedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: { user, recentResults: results }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Admin
exports.updateUser = async (req, res, next) => {
  try {
    // Don't allow password update through this route
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    // Delete user's results
    await Result.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User and associated data deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/users/stats/dashboard
// @access  Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const recentUsers = await User.find({ role: 'student' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    // Users registered in the last 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: weekAgo },
      role: 'student'
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        newUsersThisWeek,
        recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
};
