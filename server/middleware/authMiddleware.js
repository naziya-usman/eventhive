const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user from payload
      req.user = decoded;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        message: 'Your session is invalid or has expired. Please log in again.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: 'Please log in to continue.',
    });
  }
};
