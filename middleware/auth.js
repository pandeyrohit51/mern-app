const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get the token from the header. x-auth-token is the header in which we are sending the token
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.decode(token, config.get('jwtSecret'));
    // we are using decode.user because initially we had send the user in payload in routes/api/users
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Not a valid token ' });
  }
};
