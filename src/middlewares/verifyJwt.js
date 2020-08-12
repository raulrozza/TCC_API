const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/environment');

// TOKEN FORMAT
// Authorization: Bearer <access_token>

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) throw new jwt.JsonWebTokenError('Invalid token');

    // Splits token on space due to its format
    const [, token] = header.split(' ');

    const auth = await jwt.verify(token, SECRET_KEY);

    req.auth = auth;

    return next();
  } catch (error) {
    // Access Forbidden
    return res.status(403).json({ error: String(error) });
  }
};