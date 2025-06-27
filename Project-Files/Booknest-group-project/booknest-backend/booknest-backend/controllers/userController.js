const User = require('../models/User');
const Book = require('../models/Book');

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json(user.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const index = user.wishlist.findIndex(id => id.toString() === bookId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(bookId);
    }
    await user.save();
    await user.populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 