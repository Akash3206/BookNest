const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../server');

// ... existing code ...
// Replace all process.env.JWT_SECRET with JWT_SECRET 

const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
// ... existing code ... 